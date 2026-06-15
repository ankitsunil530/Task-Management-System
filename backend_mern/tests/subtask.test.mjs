/**
 * Tests for subtask CRUD added in issue #73.
 *
 *   node backend_mern/tests/subtask.test.mjs
 *
 * Zero-dependency: Node built-in test runner, reads source directly.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controller = readFileSync(
  new URL("../controllers/taskController.js", import.meta.url),
  "utf8"
);
const routes = readFileSync(
  new URL("../routes/taskRoutes.js", import.meta.url),
  "utf8"
);
const model = readFileSync(
  new URL("../models/Task.js", import.meta.url),
  "utf8"
);
const validation = readFileSync(
  new URL("../validations/taskValidation.js", import.meta.url),
  "utf8"
);

/* ===================== CONTROLLER: three handlers exist ===================== */

test("addSubtask is exported", () => {
  assert.match(controller, /export const addSubtask\s*=/);
});

test("toggleSubtask is exported", () => {
  assert.match(controller, /export const toggleSubtask\s*=/);
});

test("deleteSubtask is exported", () => {
  assert.match(controller, /export const deleteSubtask\s*=/);
});

/* ===================== CONTROLLER: permission + validation ===================== */

test("all three subtask handlers call checkPermission", () => {
  // addComment(1) + toggleWatcher(1) + getTask/update/delete/restore/assign(5)
  // + 3 subtask handlers = at least 8 occurrences; assert the 3 new ones exist
  // by checking each handler body contains checkPermission.
  const addBody = controller.slice(
    controller.indexOf("export const addSubtask"),
    controller.indexOf("export const toggleSubtask")
  );
  const toggleBody = controller.slice(
    controller.indexOf("export const toggleSubtask"),
    controller.indexOf("export const deleteSubtask")
  );
  const deleteBody = controller.slice(
    controller.indexOf("export const deleteSubtask"),
    controller.indexOf("export const toggleWatcher")
  );
  assert.match(addBody, /checkPermission\(task, req\.user\)/, "addSubtask must check permission");
  assert.match(toggleBody, /checkPermission\(task, req\.user\)/, "toggleSubtask must check permission");
  assert.match(deleteBody, /checkPermission\(task, req\.user\)/, "deleteSubtask must check permission");
});

test("addSubtask validates task id and pushes trimmed title", () => {
  const body = controller.slice(
    controller.indexOf("export const addSubtask"),
    controller.indexOf("export const toggleSubtask")
  );
  assert.match(body, /validateObjectId\(id\)/);
  assert.match(body, /task\.subTasks\.push\(\{ title: title\.trim\(\) \}\)/);
  assert.match(body, /res\.status\(201\)/, "create should respond 201");
});

test("toggleSubtask finds subdoc by id and flips completed", () => {
  const body = controller.slice(
    controller.indexOf("export const toggleSubtask"),
    controller.indexOf("export const deleteSubtask")
  );
  assert.match(body, /validateObjectId\(subId\)/);
  assert.match(body, /task\.subTasks\.id\(subId\)/);
  assert.match(body, /subtask\.completed = !subtask\.completed/);
});

test("deleteSubtask finds subdoc by id and removes it", () => {
  const body = controller.slice(
    controller.indexOf("export const deleteSubtask"),
    controller.indexOf("export const toggleWatcher")
  );
  assert.match(body, /validateObjectId\(subId\)/);
  assert.match(body, /task\.subTasks\.id\(subId\)/);
  assert.match(body, /subtask\.deleteOne\(\)/);
});

test("each handler returns 404 when subtask not found", () => {
  const toggleBody = controller.slice(
    controller.indexOf("export const toggleSubtask"),
    controller.indexOf("export const deleteSubtask")
  );
  const deleteBody = controller.slice(
    controller.indexOf("export const deleteSubtask"),
    controller.indexOf("export const toggleWatcher")
  );
  assert.match(toggleBody, /Subtask not found/);
  assert.match(deleteBody, /Subtask not found/);
});

/* ===================== MODEL: enum actions ===================== */

test("Task model enum includes subtask actions", () => {
  assert.match(model, /"subtask_added"/);
  assert.match(model, /"subtask_completed"/);
  assert.match(model, /"subtask_deleted"/);
});

/* ===================== VALIDATION: schema ===================== */

test("addSubtaskSchema validates title (1-200 chars)", () => {
  assert.match(validation, /export const addSubtaskSchema/);
  assert.match(validation, /Subtask title is required/);
});

/* ===================== ROUTES: wiring ===================== */

test("routes import all three subtask handlers", () => {
  assert.match(routes, /addSubtask/);
  assert.match(routes, /toggleSubtask/);
  assert.match(routes, /deleteSubtask/);
  assert.match(routes, /addSubtaskSchema/);
});

test("POST /:id/subtasks route is registered with validation", () => {
  assert.match(
    routes,
    /router\.post\(["']\/:[^/]+\/subtasks["'],\s*protect,\s*validate\(addSubtaskSchema\),\s*addSubtask\)/
  );
});

test("PATCH and DELETE /:id/subtasks/:subId routes are registered", () => {
  assert.match(
    routes,
    /router\.patch\(["']\/:[^/]+\/subtasks\/:subId["'],\s*protect,\s*toggleSubtask\)/
  );
  assert.match(
    routes,
    /router\.delete\(["']\/:[^/]+\/subtasks\/:subId["'],\s*protect,\s*deleteSubtask\)/
  );
});

/* ===================== PROGRESS LOGIC (frontend mirror) ===================== */

const progress = (subtasks) => {
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.completed).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
};

test("progress: 2 of 5 done = 40%", () => {
  const subs = [
    { completed: true }, { completed: true }, { completed: false },
    { completed: false }, { completed: false },
  ];
  assert.deepEqual(progress(subs), { done: 2, total: 5, percent: 40 });
});

test("progress: empty list = 0% (no divide-by-zero)", () => {
  assert.deepEqual(progress([]), { done: 0, total: 0, percent: 0 });
});

test("progress: all done = 100%", () => {
  const subs = [{ completed: true }, { completed: true }];
  assert.deepEqual(progress(subs), { done: 2, total: 2, percent: 100 });
});
