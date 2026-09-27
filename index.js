const { chromium } = require("playwright");

// HN's span.age title looks like "2026-09-27T15:21:45 1790522505" (ISO + unix seconds).
// new Date() on that full string is Invalid Date (NaN), and NaN comparisons are always false,
// so a naive check would report "sorted" no matter what. Prefer the unix part, fall back to ISO.
function toMillis(title) {
  const [iso, unix] = String(title).trim().split(/\s+/);
  const ms = unix ? Number(unix) * 1000 : Date.parse(iso.endsWith("Z") ? iso : iso + "Z");
  if (!Number.isFinite(ms)) throw new Error(`Unparseable timestamp: "${title}"`);
  return ms;
}

// Returns the index of the first article that is newer than the one before it, or -1 if sorted.
function firstUnsorted(titles) {
  const ms = titles.map(toMillis);
  for (let i = 0; i < ms.length - 1; i++) {
    if (ms[i] < ms[i + 1]) return i;
  }
  return -1;
}

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: !!process.env.CI });
  const page = await browser.newPage();
  await page.goto("https://news.ycombinator.com/newest");

  // One entry per article (not per unique timestamp: two posts can share the same second).
  const titles = [];
  while (titles.length < 100) {
    const pageTitles = await page
      .locator("span.age")
      .evaluateAll((spans) => spans.map((s) => s.getAttribute("title")));
    if (pageTitles.length === 0) throw new Error("No articles found on page");
    titles.push(...pageTitles);
    console.log("Articles collected:", titles.length);
    if (titles.length >= 100) break;
    await page.click("a.morelink");
    await page.waitForLoadState("networkidle");
  }
  await browser.close();

  const first100 = titles.slice(0, 100);
  const i = firstUnsorted(first100);
  if (i === -1) {
    console.log("PASS: first 100 articles are sorted newest to oldest");
  } else {
    console.error(`FAIL: article ${i + 1} (${first100[i]}) is older than article ${i + 2} (${first100[i + 1]})`);
    process.exitCode = 1;
  }
}

module.exports = { toMillis, firstUnsorted };

if (require.main === module) {
  sortHackerNewsArticles().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
