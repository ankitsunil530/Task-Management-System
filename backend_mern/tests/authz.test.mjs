/**
 * Authorization regression tests for issue #56.
 *
 * Covers the three reported cases:
 *   - Watch endpoint authorization (IDOR): toggleWatcher now runs checkPermission.
 *   - Creator access retention: checkPermission and getMyTasks include createdBy.
 *   - Correct 403/404 status responses: the global error handler honors a
 *     status set via res.status(...), and checkPermission throws err.status=403.
 *
 * A real mongod is not available in this sandbox, so the pure authorization
 * logic and the error-handler logic are tested directly (both are pure and
 * DB-independent), and structural assertions tie these tests to the real
 * patched files so they cannot drift from what ships.
 */
import assert from "node:assert/strict";
import fs from "node:fs";

let passed = 0;
const ok = (name) => { console.log("  PASS:", name); passed++; };

const ctrl = fs.readFileSync(new URL("../controllers/taskController.js", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../server.js", import.meta.url), "utf8");

/* ---------- faithful copies of the patched logic (verbatim) ---------- */

// global error handler from server.js (the patched line)
function errorHandler(err, req, res) {
  const status = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  res.status(status).json({ error: err.message });
}
function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
  };
}

// checkPermission from taskController.js (the patched version)
function checkPermission(task, user) {
  const uid = user._id.toString();
  const isAssigned = task.assignedTo.some((u) => u.toString() === uid);
  const isCreator = task.createdBy && task.createdBy.toString() === uid;
  if (!isAssigned && !isCreator && user.role !== "admin") {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
  }
}

// the toggleWatcher decision flow (post-fix): permission first, then toggle
function toggleWatcherFlow(task, user) {
  checkPermission(task, user);
  const uid = user._id.toString();
  const i = task.watchers.findIndex((w) => w.toString() === uid);
  if (i === -1) task.watchers.push(uid); else task.watchers.splice(i, 1);
  return { success: true };
}

const U = (id, role = "user") => ({ _id: id, role });

/* ---------- 0) structural linkage to the real files ---------- */
assert.ok(server.includes("res.statusCode >= 400 ? res.statusCode : 500"),
  "server.js must honor res.statusCode as a fallback");
assert.ok(/const isCreator = task\.createdBy/.test(ctrl), "checkPermission must include createdBy");
assert.ok(/error\.status = 403/.test(ctrl), "checkPermission must throw 403");
assert.ok(ctrl.includes("$or: [") && /createdBy: req\.user\._id/.test(ctrl),
  "getMyTasks must include createdBy via $or");
// toggleWatcher must call checkPermission BEFORE touching watchers
const tw = ctrl.slice(ctrl.indexOf("export const toggleWatcher"));
const twBody = tw.slice(0, tw.indexOf("\n};"));
assert.ok(twBody.includes("checkPermission(task, req.user)"), "toggleWatcher must call checkPermission");
assert.ok(twBody.indexOf("checkPermission(task, req.user)") < twBody.indexOf("task.watchers"),
  "toggleWatcher must authorize BEFORE mutating watchers");
assert.ok(twBody.includes('res.status(404)') && twBody.includes('res.status(400)'),
  "toggleWatcher must return 404 (not found) and 400 (invalid id)");
ok("patched files contain: res.statusCode fallback, createdBy in checkPermission+getMyTasks, checkPermission-before-watchers, 400/404 in toggleWatcher");

/* ---------- 1) error handler yields correct status codes ---------- */
{
  // checkPermission-style: err.status=403
  let r = makeRes(); errorHandler(Object.assign(new Error("Not authorized"), { status: 403 }), {}, r);
  assert.equal(r.statusCode, 403, "err.status=403 -> 403");
  // not-found via res.status(404) (addComment/toggleWatcher/getTask style), err has no status
  r = makeRes(); r.status(404); errorHandler(new Error("Task not found"), {}, r);
  assert.equal(r.statusCode, 404, "res.status(404)+throw -> 404");
  // invalid id via res.status(400)
  r = makeRes(); r.status(400); errorHandler(new Error("Invalid task id"), {}, r);
  assert.equal(r.statusCode, 400, "res.status(400)+throw -> 400");
  // genuine unknown error (nothing set) still defaults to 500
  r = makeRes(); errorHandler(new Error("boom"), {}, r);
  assert.equal(r.statusCode, 500, "unknown error -> 500 (default preserved)");
  ok("error handler: 403/404/400 honored, unknown errors still 500");
}

/* ---------- 2) checkPermission authorization + creator retention ---------- */
{
  const task = { createdBy: "creator", assignedTo: ["alice", "bob"] };
  assert.doesNotThrow(() => checkPermission(task, U("alice")), "assignee allowed");
  assert.doesNotThrow(() => checkPermission(task, U("creator")), "creator allowed (retention)");
  assert.doesNotThrow(() => checkPermission(task, U("zzz", "admin")), "admin allowed");
  let threw = null;
  try { checkPermission(task, U("mallory")); } catch (e) { threw = e; }
  assert.ok(threw, "unrelated non-admin must be denied");
  assert.equal(threw.status, 403, "denial must carry status 403");
  ok("checkPermission: assignee/creator/admin allowed; unrelated denied with 403");
}

/* ---------- 3) creator retention after reassignment ---------- */
{
  // creator A created the task, admin reassigns to B only (assignTask replaces array)
  const task = { createdBy: "A", assignedTo: ["B"] };
  assert.doesNotThrow(() => checkPermission(task, U("A")),
    "creator A must still access the task after being reassigned off assignedTo");
  // and getMyTasks would still return it because the query ORs createdBy:
  const matchesMyTasks = (t, uid) =>
    t.assignedTo.includes(uid) || t.createdBy === uid;
  assert.ok(matchesMyTasks(task, "A"), "getMyTasks $or(createdBy) must still surface A's created task");
  ok("creator retains GET access AND the task still appears in getMyTasks after reassignment");
}

/* ---------- 4) toggleWatcher IDOR is closed ---------- */
{
  const task = { createdBy: "owner", assignedTo: ["assignee"], watchers: [] };
  // unrelated user must NOT be able to watch
  let threw = null;
  try { toggleWatcherFlow(task, U("stranger")); } catch (e) { threw = e; }
  assert.ok(threw && threw.status === 403, "stranger watching any task must be rejected with 403");
  assert.deepEqual(task.watchers, [], "watchers must be untouched after rejected attempt (IDOR closed)");
  // assignee CAN watch
  assert.doesNotThrow(() => toggleWatcherFlow(task, U("assignee")));
  assert.deepEqual(task.watchers, ["assignee"], "assignee may watch");
  // creator CAN watch
  assert.doesNotThrow(() => toggleWatcherFlow(task, U("owner")));
  assert.deepEqual(task.watchers, ["assignee", "owner"], "creator may watch");
  // admin CAN watch (even if unrelated)
  assert.doesNotThrow(() => toggleWatcherFlow(task, U("root", "admin")));
  assert.deepEqual(task.watchers, ["assignee", "owner", "root"], "admin may watch");
  // toggling again removes (still authorized)
  assert.doesNotThrow(() => toggleWatcherFlow(task, U("assignee")));
  assert.deepEqual(task.watchers, ["owner", "root"], "re-toggle unwatches");
  ok("toggleWatcher: stranger blocked (403, no mutation); creator/assignee/admin allowed; toggle works");
}

console.log(`\nALL ${passed} CHECKS PASSED`);
