/**
 * Soft-delete regression (zero dependency, Node built-ins only).
 *
 *   node --test backend_mern/tests/soft-delete.test.mjs
 *
 * Covers the fix for "soft-delete is dead code" (#64):
 *  - deleteTask no longer hard-deletes (no task.deleteOne()); it sets
 *    isDeleted = true and a deletedAt timestamp instead
 *  - every task read/list/stat query filters out soft-deleted documents
 *    ({ isDeleted: { $ne: true } } or a $match in the aggregations)
 *  - a restore path exists and looks up the soft-deleted document explicitly
 *  - the schema declares deletedAt
 *  - structural assertions tie the test to the patched source files so it
 *    cannot pass against the un-patched code
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");

const controller = read("../controllers/taskController.js");
const model = read("../models/Task.js");
const routes = read("../routes/taskRoutes.js");

test("deleteTask no longer hard-deletes", () => {
  assert.ok(
    !/await task\.deleteOne\(\)/.test(controller),
    "deleteTask must not call task.deleteOne() (that is the hard delete being removed)"
  );
});

test("deleteTask soft-deletes by flagging the document", () => {
  assert.match(
    controller,
    /task\.isDeleted\s*=\s*true/,
    "deleteTask must set task.isDeleted = true"
  );
  assert.match(
    controller,
    /task\.deletedAt\s*=\s*new Date\(\)/,
    "deleteTask must stamp deletedAt"
  );
});

test("schema declares a deletedAt field", () => {
  assert.match(model, /deletedAt:\s*{[\s\S]*?type:\s*Date/, "Task schema must declare deletedAt: Date");
});

test("list and stat queries exclude soft-deleted tasks", () => {
  // Count the explicit isDeleted exclusions across the controller. getMyTasks,
  // exportMyTasks, getAllTasks (filter), getTask, updateTask, deleteTask lookup,
  // assignTask, addComment, toggleWatcher, plus the 4 stat counts = many.
  const exclusions = (controller.match(/isDeleted:\s*{\s*\$ne:\s*true\s*}/g) || []).length;
  assert.ok(
    exclusions >= 10,
    `expected the soft-delete filter on all read/list/stat queries, found ${exclusions}`
  );
});

test("stat aggregations match out soft-deleted tasks", () => {
  const matches = (controller.match(/\$match:\s*{\s*isDeleted:\s*{\s*\$ne:\s*true\s*}\s*}/g) || []).length;
  assert.ok(matches >= 2, `expected a $match stage on both stat aggregations, found ${matches}`);
});

test("getTask and mutation handlers use findOne with the isDeleted filter", () => {
  // The detail + mutation handlers must not be reachable for a soft-deleted task.
  assert.ok(
    !/Task\.findById\(id\)/.test(controller),
    "task handlers should query findOne({ _id: id, isDeleted: { $ne: true } }) rather than findById(id)"
  );
});

test("a restore path exists in controller and routes", () => {
  assert.match(controller, /export const restoreTask\b/, "restoreTask controller must exist");
  assert.match(
    controller,
    /Task\.findOne\(\s*{\s*_id:\s*id,\s*isDeleted:\s*true\s*}\s*\)/,
    "restoreTask must look up the soft-deleted document explicitly (isDeleted: true)"
  );
  assert.match(routes, /restoreTask/, "routes must import/use restoreTask");
  assert.match(routes, /\/:id\/restore/, "a /:id/restore route must be registered");
});
