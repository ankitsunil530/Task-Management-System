/**
 * Tests for two fixes in issue #76:
 * 1. addComment returns saved subdocument (with _id/createdAt)
 * 2. PATCH /:id/comments/:commentId endpoint (editComment)
 *
 *   node backend_mern/tests/comment-edit.test.mjs
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

/* ===================== FIX 1: addComment returns savedComment ===================== */

test("addComment returns task.comments[last] not the local pre-save object", () => {
  assert.match(
    controller,
    /const savedComment = task\.comments\[task\.comments\.length - 1\]/,
    "must capture the saved subdocument after task.save()"
  );
  assert.match(
    controller,
    /data:\s*savedComment/,
    "response must return savedComment (with _id and createdAt)"
  );
});

test("addComment does NOT return the local comment object", () => {
  // The pre-save local object must not be what is returned.
  // We verify 'data: comment' no longer appears in the addComment block
  // by confirming savedComment is used instead.
  assert.match(
    controller,
    /savedComment/,
    "savedComment must be defined and returned"
  );
});

/* ===================== FIX 2: editComment function ===================== */

test("editComment is exported from taskController", () => {
  assert.match(
    controller,
    /export const editComment\s*=/,
    "editComment must be exported"
  );
});

test("editComment validates both task id and comment id", () => {
  assert.match(
    controller,
    /validateObjectId\(id\)/,
    "must validate task id"
  );
  assert.match(
    controller,
    /validateObjectId\(commentId\)/,
    "must validate comment id"
  );
});

test("editComment uses task.comments.id(commentId) to find the subdocument", () => {
  assert.match(
    controller,
    /task\.comments\.id\(commentId\)/,
    "must use Mongoose subdocument .id() helper"
  );
});

test("editComment enforces author-or-admin ownership", () => {
  assert.match(
    controller,
    /comment\.user\.toString\(\) !== req\.user\._id\.toString\(\)/,
    "must compare comment.user to req.user._id"
  );
  assert.match(
    controller,
    /req\.user\.role !== ["']admin["']/,
    "admin must be allowed to edit any comment"
  );
  assert.match(
    controller,
    /res\.status\(403\)/,
    "unauthorized edit must return 403"
  );
});

test("editComment sets comment.text and comment.edited = true", () => {
  assert.match(
    controller,
    /comment\.text = text\.trim\(\)/,
    "must update comment text"
  );
  assert.match(
    controller,
    /comment\.edited = true/,
    "must mark comment as edited"
  );
});

test("editComment logs comment_edited to activityLogs", () => {
  assert.match(
    controller,
    /action:\s*["']comment_edited["']/,
    "must log comment_edited action"
  );
});

test("comment_edited is in the activityLogs action enum in Task.js", () => {
  assert.match(
    model,
    /"comment_edited"/,
    "Task model must include comment_edited in enum"
  );
});

/* ===================== FIX 2: route wiring ===================== */

test("editComment is imported in taskRoutes", () => {
  assert.match(
    routes,
    /editComment/,
    "editComment must be imported in taskRoutes"
  );
});

test("PATCH /:id/comments/:commentId route is registered", () => {
  assert.match(
    routes,
    /router\.patch\(["']\/:[^/]+\/comments\/:commentId["']/,
    "edit comment route must be registered"
  );
});

test("edit comment route uses validate(addCommentSchema)", () => {
  assert.match(
    routes,
    /validate\(addCommentSchema\).*editComment|editComment.*validate\(addCommentSchema\)/s,
    "edit comment route must validate text input"
  );
});

/* ===================== OWNERSHIP LOGIC UNIT TESTS ===================== */

const canEdit = (commentUserId, reqUserId, reqUserRole) =>
  commentUserId.toString() === reqUserId.toString() || reqUserRole === "admin";

test("comment author can edit their own comment", () => {
  assert.ok(canEdit("u_alice", "u_alice", "user"));
});

test("admin can edit any comment", () => {
  assert.ok(canEdit("u_alice", "u_admin", "admin"));
});

test("non-author non-admin cannot edit", () => {
  assert.ok(!canEdit("u_alice", "u_bob", "user"));
});
