/**
 * Regression tests for the deleteUser guards added in issue #75.
 *
 *   node backend_mern/tests/delete-user.test.mjs
 *
 * Zero-dependency: uses Node built-in test runner and reads source files
 * directly. No live database needed.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controller = readFileSync(
  new URL("../controllers/authController.js", import.meta.url),
  "utf8"
);

/* ===================== LOGIC TESTS ===================== */

// Simulate Guard 1: self-delete check
const isSelfDelete = (paramId, userId) => paramId === userId.toString();

test("Guard 1: self-delete rejected when param id equals req.user._id", () => {
  assert.ok(isSelfDelete("abc123", { toString: () => "abc123" }));
});

test("Guard 1: different user is not flagged as self-delete", () => {
  assert.ok(!isSelfDelete("abc123", { toString: () => "xyz999" }));
});

// Simulate Guard 2: last-admin check
const wouldRemoveLastAdmin = (targetRole, adminCount) =>
  targetRole === "admin" && adminCount <= 1;

test("Guard 2: deleting the only admin is rejected", () => {
  assert.ok(wouldRemoveLastAdmin("admin", 1));
});

test("Guard 2: deleting one of two admins is allowed", () => {
  assert.ok(!wouldRemoveLastAdmin("admin", 2));
});

test("Guard 2: deleting a regular user is never blocked by last-admin check", () => {
  assert.ok(!wouldRemoveLastAdmin("user", 1));
});

test("Guard 2: deleting a regular user when no admins exist is still allowed", () => {
  assert.ok(!wouldRemoveLastAdmin("user", 0));
});

/* ===================== STRUCTURAL TESTS ===================== */

test("Task model is imported in authController", () => {
  assert.match(
    controller,
    /import Task from ["']\.\.\/models\/Task\.js["']/,
    "authController must import Task model"
  );
});

test("Guard 1 self-delete check is present", () => {
  assert.match(
    controller,
    /req\.params\.id === req\.user\._id\.toString\(\)/,
    "must compare req.params.id to req.user._id.toString()"
  );
  assert.match(
    controller,
    /You cannot delete your own account/,
    "must reject with self-delete error message"
  );
});

test("Guard 2 last-admin check is present", () => {
  assert.match(
    controller,
    /User\.countDocuments\(\s*\{\s*role:\s*["']admin["']/,
    "must count admin users before deleting an admin"
  );
  assert.match(
    controller,
    /Cannot delete the last admin/,
    "must reject with last-admin error message"
  );
});

test("Guard 3 Task.updateMany cleans up assignedTo and watchers", () => {
  assert.match(
    controller,
    /Task\.updateMany/,
    "must call Task.updateMany to clean up task references"
  );
  assert.match(
    controller,
    /\$pull.*assignedTo.*user\._id/s,
    "must pull deleted user from assignedTo"
  );
  assert.match(
    controller,
    /\$pull.*watchers.*user\._id/s,
    "must pull deleted user from watchers"
  );
});

test("user.deleteOne() still called after guards pass", () => {
  assert.match(
    controller,
    /await user\.deleteOne\(\)/,
    "actual deletion must still happen after guards"
  );
});
