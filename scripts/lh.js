const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results.lhr)
      })
    })
}

const opts = {
  // chromeFlags: ['--show-paint-rects']
}

const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    skipAudits: ['uses-http2'],
  },
  audits: ['metrics/first-contentful-paint-3g'],
  // @ts-ignore TODO(bckenny): type extended Config where e.g. category.title isn't required
  categories: {
    performance: {
      auditRefs: [{ id: 'first-contentful-paint-3g', weight: 0 }],
    },
  },
}

const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    emulatedFormFactor: 'desktop',
    throttling: {
      // Using a "broadband" connection type
      // Corresponds to "Dense 4G 25th percentile" in https://docs.google.com/document/d/1Ft1Bnq9-t4jK5egLSOc28IL4TvR-Tt0se_1faTA4KTY/edit#heading=h.bb7nfy2x9e5v
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    skipAudits: ['uses-http2'],
  },
  audits: [
    // 75th and 95th percentiles -> median and PODR
    // SELECT QUANTILES(renderStart, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
    {
      path: 'metrics/first-contentful-paint',
      options: { scorePODR: 800, scoreMedian: 1600 },
    },
    {
      path: 'metrics/first-meaningful-paint',
      options: { scorePODR: 800, scoreMedian: 1600 },
    },
    // 75th and 95th percentiles -> median and PODR
    // SELECT QUANTILES(SpeedIndex, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
    {
      path: 'metrics/speed-index',
      options: { scorePODR: 1100, scoreMedian: 2300 },
    },
    // 75th and 95th percentiles -> median and PODR
    // SELECT QUANTILES(fullyLoaded, 21) FROM [httparchive:summary_pages.2018_12_15_desktop] LIMIT 1000
    {
      path: 'metrics/interactive',
      options: { scorePODR: 2000, scoreMedian: 4500 },
    },
    {
      path: 'metrics/first-cpu-idle',
      options: { scorePODR: 2000, scoreMedian: 4500 },
    },
  ],
}

// Usage:
launchChromeAndRunLighthouse('https://versoly.com', opts, mobileConfig).then(
  results => {
    let data = JSON.stringify(results['categories'], null, 2)
    fs.writeFileSync('report.json', data)

    // Use results!
  }
)

// launchChromeAndRunLighthouse('https://versoly.com', opts, mobileConfig).then(results => {
//   let data = JSON.stringify(results['categories']['performance']['score'], null, 2);
//   fs.writeFileSync('report_obile.json', data);

//   // Use results!
// });
