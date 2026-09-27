# Hacker News Article Sort Checker

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

### 3. Run the script

```bash
node index.js
```

> The browser will launch (not headless), scrape the timestamps, and log whether the articles are sorted from newest to oldest.

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

