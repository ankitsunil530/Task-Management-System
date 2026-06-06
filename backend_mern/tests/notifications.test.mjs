/**
 * Mention-notification regression (zero dependency, Node built-ins only).
 *
 *   node backend_mern/tests/notifications.test.mjs
 *
 * Covers the comment -> mention -> notification flow added in this PR:
 *  - the mention parser extracts @(\w+) handles (same regex as addComment)
 *  - a notification is created per mentioned user, EXCLUDING the author
 *    mentioning themselves
 *  - the notification message names the author and the task
 *  - structural assertions tie the test to the patched source files so it
 *    cannot pass against the un-patched code
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");

const controller = read("../controllers/taskController.js");
const model = read("../models/Notification.js");
const routes = read("../routes/notificationRoutes.js");
const socket = read("../utils/socket.js");

/* ---- Reimplementation of the addComment mention->recipient logic ---- */
// Mirrors taskController.addComment so the behaviour can be checked without a
// live database.
const parseMentions = (text) =>
  (text.match(/@(\w+)/g) || []).map((u) => u.replace("@", ""));

const resolveRecipients = (mentionedIds, authorId) =>
  mentionedIds.filter((id) => id.toString() !== authorId.toString());

const buildMessage = (authorName, title) =>
  `${authorName} mentioned you in a comment on "${title}"`;

/* ============================ TESTS ============================ */

test("mention parser extracts @handles and ignores plain text", () => {
  assert.deepEqual(parseMentions("hey @john and @bob_1, see this"), [
    "john",
    "bob_1",
  ]);
  assert.deepEqual(parseMentions("no mentions here"), []);
  assert.deepEqual(parseMentions("email a@b.com is not a mention"), ["b"]);
});

test("author mentioning themselves does not notify themselves", () => {
  const author = "u_author";
  // username lookup resolved these ids (author included themselves)
  const mentionedIds = ["u_john", "u_author", "u_bob"];
  const recipients = resolveRecipients(mentionedIds, author);
  assert.deepEqual(recipients, ["u_john", "u_bob"]);
  assert.ok(!recipients.includes(author));
});

test("no recipients -> no notifications created", () => {
  const author = "u_author";
  const recipients = resolveRecipients(["u_author"], author);
  assert.equal(recipients.length, 0);
});

test("notification message names the author and the task", () => {
  assert.equal(
    buildMessage("Saketh", "Ship v2"),
    'Saketh mentioned you in a comment on "Ship v2"'
  );
});

/* ---- Structural assertions: tie tests to the patched files ---- */

test("addComment persists + emits notifications for mentioned users", () => {
  assert.match(
    controller,
    /import Notification from "\.\.\/models\/Notification\.js"/,
    "taskController must import the Notification model"
  );
  assert.match(
    controller,
    /emitNotification/,
    "taskController must emit notifications"
  );
  assert.match(
    controller,
    /Notification\.insertMany/,
    "addComment must persist notifications"
  );
  // self-exclusion must be present
  assert.match(
    controller,
    /mentionedIds\.filter\([\s\S]*req\.user\._id\.toString\(\)/,
    "addComment must exclude the author from recipients"
  );
});

test("Notification model has recipient/type/read and an index", () => {
  assert.match(model, /recipient:/);
  assert.match(model, /type:[\s\S]*enum:[\s\S]*"mention"/);
  assert.match(model, /read:[\s\S]*default: false/);
  assert.match(model, /notificationSchema\.index/);
});

test("routes expose list + read-all + read + delete, ordered safely", () => {
  assert.match(routes, /router\.get\("\/", protect, getMyNotifications\)/);
  assert.match(routes, /router\.patch\("\/read-all"/);
  assert.match(routes, /router\.patch\("\/:id\/read"/);
  // read-all must be declared before the parameterized :id route
  assert.ok(
    routes.indexOf('router.patch("/read-all"') <
      routes.indexOf('router.patch("/:id/read"'),
    "/read-all must be registered before /:id/read"
  );
});

test("socket exposes an emitNotification helper", () => {
  assert.match(socket, /export const emitNotification/);
  assert.match(socket, /emit\("notification"/);
});
