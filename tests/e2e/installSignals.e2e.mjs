// Cross-browser (Chromium + WebKit/Safari + Firefox) verification that install
// signals only appear under /admin. Run against a running dev/preview server:
//
//   node tests/e2e/installSignals.e2e.mjs                    # localhost:8080
//   BASE_URL=https://svrm.group node tests/e2e/installSignals.e2e.mjs
//
// Exits non-zero on any assertion failure.

import { chromium, webkit, firefox } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

const SELECTORS = [
  'link[rel="manifest"]',
  'link[rel="apple-touch-icon"]',
  'meta[name="apple-mobile-web-app-capable"]',
  'meta[name="mobile-web-app-capable"]',
  'meta[name="apple-mobile-web-app-status-bar-style"]',
  'meta[name="apple-mobile-web-app-title"]',
];

async function audit(page, path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400); // let main.tsx run its injector
  return page.evaluate(
    (sels) =>
      Object.fromEntries(
        sels.map((s) => [s, !!document.head.querySelector(s)]),
      ),
    SELECTORS,
  );
}

const engines = [
  ["chromium", chromium],
  ["webkit", webkit], // Safari's rendering engine
  ["firefox", firefox],
];

let failures = 0;

for (const [name, engine] of engines) {
  let browser;
  try {
    browser = await engine.launch({ headless: true });
  } catch (err) {
    console.warn(`⚠️  Skipping ${name}: ${err.message}`);
    continue;
  }
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const publicResult = await audit(page, "/");
  const adminResult = await audit(page, "/admin");

  for (const sel of SELECTORS) {
    if (publicResult[sel]) {
      console.error(`❌ [${name}] install signal leaked onto public /: ${sel}`);
      failures++;
    }
    if (!adminResult[sel]) {
      console.error(`❌ [${name}] missing install signal on /admin: ${sel}`);
      failures++;
    }
  }
  console.log(`✅ [${name}] public=${Object.values(publicResult).filter(Boolean).length}/6 signals · admin=${Object.values(adminResult).filter(Boolean).length}/6 signals`);

  await browser.close();
}

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll browsers verified: install prompt is /admin-only.");
