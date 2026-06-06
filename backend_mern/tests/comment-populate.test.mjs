/**
 * Comment-author population regression (zero dependency, Node built-ins only).
 *
 *   node --test backend_mern/tests/comment-populate.test.mjs
 *
 * Covers the fix for "comment authors render as 'User'" (#63):
 *  - getTask must populate comments.user and comments.mentions so the API
 *    returns real user documents instead of bare ObjectIds
 *  - the Comment subschema actually declares user and mentions as User refs
 *    (so the populate paths are valid)
 *  - structural assertions tie the test to the patched source files so it
 *    cannot pass against the un-patched code
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");

const controller = read("../controllers/taskController.js");
const taskModel = read("../models/Task.js");

test("getTask populates comments.user", () => {
  assert.match(
    controller,
    /\.populate\(\s*["']comments\.user["']/,
    "getTask must populate comments.user so comment authors resolve to real names"
  );
});

test("getTask populates comments.mentions", () => {
  assert.match(
    controller,
    /\.populate\(\s*["']comments\.mentions["']/,
    "getTask must populate comments.mentions so mentioned users resolve to real names"
  );
});

test("comment populate uses the same projection as the other populates", () => {
  // The new populate calls should request name email profilePicture, matching
  // createdBy / assignedTo / activityLogs.user so avatars and names are available.
  assert.match(
    controller,
    /\.populate\(\s*["']comments\.user["']\s*,\s*["']name email profilePicture["']\s*\)/,
    "comments.user should be projected with name email profilePicture"
  );
  assert.match(
    controller,
    /\.populate\(\s*["']comments\.mentions["']\s*,\s*["']name email profilePicture["']\s*\)/,
    "comments.mentions should be projected with name email profilePicture"
  );
});

test("Comment subschema declares user and mentions as User refs", () => {
  // Sanity: the populate paths are only valid because the schema refs exist.
  const commentBlock = taskModel.slice(
    taskModel.indexOf("commentSchema"),
    taskModel.indexOf("commentSchema") + 600
  );
  assert.match(commentBlock, /user:\s*{[\s\S]*?ref:\s*["']User["']/, "comment.user must ref User");
  assert.match(
    commentBlock,
    /mentions:\s*\[[\s\S]*?ref:\s*["']User["']/,
    "comment.mentions must ref User"
  );
});
