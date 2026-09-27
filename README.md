# Hacker News Article Sort Checker

[![CI](https://github.com/Mosal27/Webscraping-with-Playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/Mosal27/Webscraping-with-Playwright/actions/workflows/ci.yml)

This Node.js script uses [Playwright](https://playwright.dev/) to scrape **Hacker News - Newest** articles and verify whether they are sorted from **newest to oldest** based on their timestamps.

## Description

The script launches a Chromium browser, visits [Hacker News "newest"](https://news.ycombinator.com/newest), collects the **timestamps** of the articles (up to 100), and checks if the articles are sorted **chronologically (newest first)**.

Useful for analyzing how Hacker News displays newly submitted content.

## Technologies Used

* [Node.js](https://nodejs.org/)
* [Playwright](https://playwright.dev/) (Headless browser automation)

## Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/Mosal27/Webscraping-with-Playwright.git
cd Webscraping-with-Playwright

```

### 2. Install dependencies

```bash
npm install
```

> Ensure you have Playwright installed:

```bash
npx playwright install
```

### 3. Run it

```bash
npm test        # offline unit tests for the timestamp parsing and sort logic
npm run check   # live Playwright check against Hacker News (exits 1 if unsorted)
```

Set `CI=1` to run the browser headless.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs the unit tests and then the live check on every push and pull request. A failed check exits with code 1, so the build goes red.

## Bug I found in my first version

HN's `span.age` title holds an ISO time plus a Unix timestamp (e.g. `2026-09-27T15:21:45 1790522505`). My original code passed that whole string to `new Date()`, which returns `NaN`. Every `NaN < NaN` comparison is false, so the check reported "sorted" no matter what order the articles were in: a test that could never fail.

Fix: parse the Unix part (fall back to the ISO part), throw on anything unparseable, and add unit tests (`test.js`) that feed out-of-order data and confirm the check catches it. I also stopped de-duplicating by timestamp, since two articles can share the same second.

##  How It Works

* Navigates to Hacker News "newest" page
* Scrapes timestamps from `span.age` elements
* Clicks **"More"** until at least 100 unique timestamps are collected
* Converts timestamps to milliseconds
* Checks if the list is sorted in descending order

##  Sample Output

```text
Dates count: 30
Dates count: 60
Dates count: 90
Dates count: 100
Articles are sorted from newest to oldest
```

Or if not:

```text
Articles are NOT sorted from newest to oldest
```

