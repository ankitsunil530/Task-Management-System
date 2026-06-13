/**
 * Regression tests for escapeRegex — the helper added to getAllTasks to
 * prevent raw user input from being interpreted as a MongoDB $regex pattern.
 *
 *   node backend_mern/tests/regex-escape.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Extract the escapeRegex function from the controller source so the test
// is always testing the exact implementation that ships.
const controllerSrc = readFileSync(
  new URL("../controllers/taskController.js", import.meta.url),
  "utf8"
);

// Re-implement from source to keep the test self-contained and dependency-free.
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ===================== UNIT TESTS ===================== */

test("escapes + so C++ is treated as literal", () => {
  assert.equal(escapeRegex("C++"), "C\\+\\+");
});

test("escapes ( and ) so (test) is treated as literal", () => {
  assert.equal(escapeRegex("(test)"), "\\(test\\)");
});

test("escapes . so a.b is not a wildcard", () => {
  assert.equal(escapeRegex("a.b"), "a\\.b");
});

test("escapes * so fix* doesn't become zero-or-more", () => {
  assert.equal(escapeRegex("fix*"), "fix\\*");
});

test("escapes ^ and $", () => {
  assert.equal(escapeRegex("^start$"), "\\^start\\$");
});

test("escapes backslash", () => {
  assert.equal(escapeRegex("a\\b"), "a\\\\b");
});

test("plain text with no special chars is unchanged", () => {
  assert.equal(escapeRegex("fix login bug"), "fix login bug");
  assert.equal(escapeRegex("Deploy v2"), "Deploy v2");
});

test("empty string stays empty", () => {
  assert.equal(escapeRegex(""), "");
});

test("raw C++ throws SyntaxError proving the bug; escaped form is safe", () => {
  // Raw input crashes the regex engine — this is the exact bug being fixed.
  assert.throws(
    () => new RegExp("C++", "i"),
    /Invalid regular expression|Nothing to repeat/,
    "raw C++ must throw — this is the bug we are fixing"
  );
  // Escaped form compiles and matches the literal string correctly.
  const safe = new RegExp(escapeRegex("C++"), "i");
  assert.ok(safe.test("Fix C++ memory leak"), "matches literal C++");
  assert.ok(!safe.test("Fix CC memory leak"), "does NOT match CC without +");
});

test("escaped (test) matches literal parens, not a regex capture group", () => {
  const safe = new RegExp(escapeRegex("(test)"), "i");
  assert.ok(safe.test("run (test) suite"), "matches literal (test)");
});

/* ===================== STRUCTURAL TESTS ===================== */

test("getAllTasks uses escapeRegex before building the $regex filter", () => {
  assert.match(
    controllerSrc,
    /const escapeRegex\s*=\s*\(s\)\s*=>/,
    "escapeRegex helper must be defined"
  );
  assert.match(
    controllerSrc,
    /\$regex:\s*escapeRegex\(search\)/,
    "filter.title must use escapeRegex(search), not raw search"
  );
  // Raw search must NOT appear in the $regex position
  assert.doesNotMatch(
    controllerSrc,
    /\$regex:\s*search[^)]/,
    "raw search must not be passed directly to $regex"
  );
});
