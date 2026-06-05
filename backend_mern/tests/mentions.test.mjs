/**
 * Regression tests for issue #57 -- @mention resolution.
 *
 * Root cause: addComment resolves mentions via `User.find({ username: ... })`,
 * but the User schema had no `username` field, so the lookup always returned []
 * and the comment `mentions` array was always empty.
 *
 * Fix (this PR): add a unique, lowercase `username` to the User schema and derive
 * one for every user at registration. The existing addComment query then resolves
 * mentions correctly. addComment itself is intentionally left untouched so this
 * change does not overlap with the in-flight authorization PR for #56, which also
 * edits addComment.
 *
 * A real mongod is not available here, so the pure logic (username derivation and
 * mention resolution against a fake user collection) is tested directly, with
 * structural assertions tying the tests to the patched files.
 */
import assert from "node:assert/strict";
import fs from "node:fs";

let passed = 0;
const ok = (n) => { console.log("  PASS:", n); passed++; };

const userModel = fs.readFileSync(new URL("../models/User.js", import.meta.url), "utf8");
const auth = fs.readFileSync(new URL("../controllers/authController.js", import.meta.url), "utf8");
const ctrl = fs.readFileSync(new URL("../controllers/taskController.js", import.meta.url), "utf8");

/* ---------- faithful copies of the pure logic ---------- */

// the EXISTING addComment mention parse (unchanged by this PR)
function parseMentions(text) {
  const mentionMatches = text.match(/@(\w+)/g) || [];
  return mentionMatches.map((u) => u.replace("@", ""));
}

// authController.generateUniqueUsername (DB-independent via injected existsFn)
async function generateUniqueUsername(email, name, existsFn) {
  const source = (String(email).split("@")[0] || name || "user").toLowerCase();
  const base = source.replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";
  let candidate = base;
  let suffix = 0;
  while (await existsFn(candidate)) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

// fake User collection: find({ username: { $in } })
function makeUsers(list) {
  return { find: (q) => Promise.resolve(list.filter((u) => q.username.$in.includes(u.username))) };
}

/* ---------- 0) structural linkage to the patched files ---------- */
assert.ok(/username:\s*{[^}]*unique:\s*true[^}]*sparse:\s*true[^}]*lowercase:\s*true/s.test(userModel),
  "User.js must add a unique, sparse, lowercase username field");
assert.ok(auth.includes("generateUniqueUsername"), "authController must derive a username");
assert.ok(/username,\s*\}\)/s.test(auth) || /username,\n\s*\}\)/s.test(auth),
  "registerUser must persist username on create");
assert.ok(auth.includes("username: user.username"), "auth responses must return username");
// addComment must remain unchanged (no overlap with #56): it still queries username
assert.ok(ctrl.includes("User.find({ username: { $in: usernames } })"),
  "addComment keeps its existing username lookup (untouched by this PR)");
ok("patched files: username field (unique/sparse/lowercase) + derived at registration + returned in responses; addComment untouched");

/* ---------- 1) the original bug: no username field => mentions never resolve ---------- */
{
  const legacyUsers = makeUsers([{ _id: "1" }, { _id: "2" }]); // no username keys at all
  const ids = (await legacyUsers.find({ username: { $in: parseMentions("@john @bob") } })).map((u) => u._id);
  assert.deepEqual(ids, [], "with no username field, lookup returns [] -- the reported bug");
  ok("reproduced bug: without a username field, @mentions resolve to an empty array");
}

/* ---------- 2) after fix: mentions resolve against the derived usernames ---------- */
{
  const users = makeUsers([
    { _id: "u-john", username: "john" },
    { _id: "u-bob", username: "bob" },
    { _id: "u-carol", username: "carol" },
  ]);
  const parsed = parseMentions("ping @john and @bob to review, not @dave");
  assert.deepEqual(parsed, ["john", "bob", "dave"], "mentions parsed from comment text");
  const ids = (await users.find({ username: { $in: parsed } })).map((u) => u._id);
  assert.deepEqual(ids, ["u-john", "u-bob"], "@john and @bob resolve; @dave (no such user) is ignored");
  ok("after fix: existing users resolve by their username; unknown handles are ignored");
}

/* ---------- 3) username derivation at registration ---------- */
{
  const has = (set) => (c) => Promise.resolve(set.has(c));

  assert.equal(await generateUniqueUsername("John.Doe@example.com", "John Doe", has(new Set())),
    "johndoe", "derives from email local-part, stripped to [a-z0-9_], lowercased");
  assert.equal(await generateUniqueUsername("alice@x.com", "Alice", has(new Set(["alice"]))),
    "alice1", "appends suffix when base is taken");
  assert.equal(await generateUniqueUsername("alice@x.com", "Alice", has(new Set(["alice", "alice1", "alice2"]))),
    "alice3", "walks suffixes until one is free");
  assert.equal(await generateUniqueUsername("***@x.com", "", has(new Set())),
    "user", "falls back to 'user' when local part has no usable chars");
  assert.equal(await generateUniqueUsername("averyveryveryveryverylong@x.com", "x", has(new Set())),
    "averyveryveryveryver", "truncates to 20 chars");

  const derived = await generateUniqueUsername("Jo_hn.99@x.com", "x", has(new Set()));
  assert.equal(derived, "jo_hn99", "keeps [a-z0-9_], drops dots, lowercases");
  // the derived username is itself a single valid @mention token, so it resolves:
  const u = makeUsers([{ _id: "x", username: derived }]);
  const ids = (await u.find({ username: { $in: parseMentions("@" + derived) } })).map((m) => m._id);
  assert.deepEqual(ids, ["x"], "a derived username is a valid mention token and resolves");
  ok("username derivation: email-based, [a-z0-9_] only, lowercased, <=20 chars, collision-suffixed, mention-resolvable");
}

console.log(`\nALL ${passed} CHECKS PASSED`);
