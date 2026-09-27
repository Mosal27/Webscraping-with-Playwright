// Offline unit tests for the sort check. Run: npm test
const assert = require("node:assert/strict");
const { toMillis, firstUnsorted } = require("./index");

// Current HN format (ISO + unix seconds) and the older ISO-only format
assert.equal(toMillis("2026-09-27T15:21:45 1790522505"), 1790522505000);
assert.equal(toMillis("2026-09-27T15:21:45"), Date.UTC(2026, 8, 27, 15, 21, 45));

// Garbage must fail loudly, not silently pass as NaN
assert.throws(() => toMillis("yesterday"));
assert.throws(() => toMillis(null));

// Sorted, ties allowed
assert.equal(firstUnsorted(["2026-01-01T10:00:02", "2026-01-01T10:00:01", "2026-01-01T10:00:01"]), -1);

// Out of order is caught at the right position
assert.equal(firstUnsorted(["2026-01-01T10:00:03", "2026-01-01T10:00:01", "2026-01-01T10:00:02"]), 1);

// The original bug: full HN titles out of order must NOT pass
assert.equal(firstUnsorted(["2026-01-01T10:00:01 1767261601", "2026-01-01T10:00:02 1767261602"]), 0);

console.log("All unit tests passed");
