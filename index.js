// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  //collect 100 dates
  const allDates = new Set(); // only add unique dates
  let isSorted = true;
  // loop until 100 dates are collected
  // collect 100 dates from span(age)->title
    while (allDates.size <= 100) {
      const newDates = await page
        .locator("span.age")
        .evaluateAll((spans) =>
          spans.map((span) => span.getAttribute("title"))
        );

      if (newDates.length === 0)  // if no new dates are found
        console.error("No new dates found");
        
      newDates.forEach((date) => allDates.add(date)); // appends unique dates to allDates

      if (newDates.length === 0) break;

      await page.click("a.morelink"); // click on "More" if there we are not at 100
      await page.waitForLoadState("networkidle");
      console.log("Dates count:", allDates.size);
    }
    // console.log("Final Dates count before slicing:", allDates.size);
    const first100Dates = Array.from(allDates).slice(0, 100); // only 100 dates are needed (NEEDED TO CHANGE TO ARRAY FROM SET)
    console.log("Final Dates count:", first100Dates.length);

    // sort Dates and print them
    const sortedDates = first100Dates.map((date) => new Date(date).getTime()); //dates are chaged to milliseconds 


    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (sortedDates[i] < sortedDates[i + 1]) {
        //miliseconds are compared to check if they are sorted
        isSorted = false;
        console.log(
          "Articles are not sorted from newest to oldest sortedDates[i]",sortedDates[i],"sortedDates[i + 1]",sortedDates[i + 1]
        );
      }
    }

    if (isSorted) {
      console.log("Articles are sorted from newest to oldest");
    }else {
      console.error("Articles are NOT sorted from newest to oldest");
    }

    await browser.close();
  }


(async () => {
  await sortHackerNewsArticles();
})();
