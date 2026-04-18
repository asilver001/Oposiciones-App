// e2e/audit-editorial.js
// Audit screenshot script for the "Calma Editorial" redesign.
// Captures mobile + desktop for every relevant route and saves under e2e/screenshots/.

import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5175/Oposiciones-App';
const SCREENSHOT_DIR = join(import.meta.dirname, 'screenshots');

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 800 },
];

// Routes to audit. Using hash routing (#/path)
const ROUTES = [
  // Landing / onboarding
  { path: '#/welcome', name: 'welcome' },
  { path: '#/onboarding/oposicion', name: 'onboarding-oposicion' },
  { path: '#/onboarding/tiempo', name: 'onboarding-tiempo' },
  { path: '#/onboarding/fecha', name: 'onboarding-fecha' },
  { path: '#/onboarding/intro', name: 'onboarding-intro' },
  { path: '#/onboarding/results', name: 'onboarding-results' },

  // Guest mode
  { path: '#/welcome2', name: 'welcome2' },
  { path: '#/guest/session', name: 'guest-session' },
  { path: '#/guest/results', name: 'guest-results' },
  { path: '#/guest/signup', name: 'guest-signup' },

  // Auth
  { path: '#/login', name: 'login' },
  { path: '#/signup', name: 'signup' },
  { path: '#/forgot-password', name: 'forgot-password' },

  // Main app (unauthenticated users allowed through RequireAuth for /app)
  { path: '#/app/inicio', name: 'app-inicio' },
  { path: '#/app/temas', name: 'app-temas' },
  { path: '#/app/actividad', name: 'app-actividad' },
  { path: '#/app/recursos', name: 'app-recursos' },

  // Legal
  { path: '#/terms', name: 'terms' },
  { path: '#/privacy', name: 'privacy' },
];

async function run() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}/${route.path}`;
      const errors = [];
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', err => errors.push(err.message));

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForSelector('#root > *', { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(1500);

        const filename = `audit-${viewport.name}-${route.name}.png`;
        await page.screenshot({
          path: join(SCREENSHOT_DIR, filename),
          fullPage: true,
        });

        const domInfo = await page.evaluate(() => {
          const body = document.body;
          const root = document.getElementById('root');
          const bg = getComputedStyle(body).backgroundColor;
          const firstChild = root?.firstElementChild;
          return {
            bg,
            childCount: root?.children?.length || 0,
            firstTag: firstChild?.tagName,
            firstClass: firstChild?.className?.toString?.().substring(0, 120),
            title: document.title,
            bodyTextSample: body.innerText?.substring(0, 80),
          };
        });

        results.push({
          viewport: viewport.name,
          route: route.name,
          url,
          file: filename,
          dom: domInfo,
          errors: errors.slice(0, 3),
        });
        console.log(`OK  ${viewport.name} ${route.name} bg=${domInfo.bg} err=${errors.length}`);
      } catch (err) {
        console.log(`ERR ${viewport.name} ${route.name} ${err.message}`);
        results.push({
          viewport: viewport.name,
          route: route.name,
          url,
          error: err.message,
        });
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\nDone. Screenshots in', SCREENSHOT_DIR);
  console.log('\n=== SUMMARY ===');
  for (const r of results) {
    console.log(JSON.stringify(r));
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
