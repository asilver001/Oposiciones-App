// e2e/draft-screenshots.js
// Takes screenshots of DraftFeatures proposals.
// Injects localStorage to bypass onboarding, uses anonymous mode + DEV panel.
//
// Usage: node e2e/draft-screenshots.js

import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:5173/Oposiciones-App/';
const SCREENSHOT_DIR = join(import.meta.dirname, 'screenshots');

async function run() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  // 1) Navigate to base URL to set origin for localStorage
  console.log('1️⃣ Setting up localStorage...');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(500);

  // Inject localStorage to bypass onboarding + enable anonymous mode
  await page.evaluate(() => {
    // user-storage (zustand persist store)
    const store = {
      state: {
        onboardingComplete: true,
        selectedOposicion: 'auxiliar-age',
        userData: {
          dailyGoal: 15,
          weeklyGoalQuestions: 75,
          targetExamDate: '2026-06-15',
        },
        darkMode: 'light',
      },
      version: 0,
    };
    localStorage.setItem('user-storage', JSON.stringify(store));
    // Anonymous mode flag
    localStorage.setItem('oposita-anonymous-mode', 'true');
  });

  // 2) Navigate to home
  console.log('2️⃣ Navigating to home...');
  await page.goto(`${BASE}app/inicio`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  console.log(`   URL: ${currentUrl}`);
  await page.screenshot({ path: join(SCREENSHOT_DIR, 'draft-01-home.png') });

  // 3) Find DEV button
  console.log('3️⃣ Looking for DEV button...');
  const devBtn = page.locator('button').filter({ hasText: /^DEV$/ }).first();

  if (!(await devBtn.isVisible().catch(() => false))) {
    // Debug: list visible buttons
    const btns = await page.locator('button:visible').all();
    console.log(`   ${btns.length} visible buttons:`);
    for (const btn of btns.slice(0, 15)) {
      const t = (await btn.textContent().catch(() => '')).trim();
      if (t) console.log(`     "${t.substring(0, 50)}"`);
    }
    console.log('❌ DEV button not found');
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'draft-02-debug.png'), fullPage: true });
    await browser.close();
    return;
  }

  console.log('   Clicking DEV...');
  await devBtn.click();
  await page.waitForTimeout(800);

  // 4) Click "Draft Features"
  await page.screenshot({ path: join(SCREENSHOT_DIR, 'draft-02-devpanel.png') });
  const draftBtn = page.locator('button').filter({ hasText: /Draft/ }).first();
  if (await draftBtn.isVisible().catch(() => false)) {
    console.log('4️⃣ Opening Draft Features...');
    await draftBtn.click();
    await page.waitForTimeout(1500);
  }

  // 5) Verify DraftFeatures is open
  const draftTitle = page.locator('h1').filter({ hasText: 'Draft Features' });
  if (!(await draftTitle.isVisible().catch(() => false))) {
    console.log('❌ DraftFeatures did not open');
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'draft-03-debug.png'), fullPage: true });
    await browser.close();
    return;
  }

  console.log('✅ DraftFeatures open!');
  await page.waitForTimeout(800);

  // ── PROPOSAL A: Focus Mode ───────────────────────
  console.log('\n📸 Home A — Focus Mode (collapsed)');
  await page.screenshot({
    path: join(SCREENSHOT_DIR, 'draft-home-a-focus.png'),
    fullPage: true,
  });

  // Expand details
  const expandBtn = page.locator('button').filter({ hasText: 'Ver detalles' }).first();
  if (await expandBtn.isVisible().catch(() => false)) {
    await expandBtn.click();
    await page.waitForTimeout(800);
    console.log('📸 Home A — Focus Mode (expanded)');
    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'draft-home-a-expanded.png'),
      fullPage: true,
    });
  }

  // ── PROPOSAL C: Dashboard + Drawer ────────────────
  const tabC = page.locator('button').filter({ hasText: 'Home C' }).first();
  if (await tabC.isVisible().catch(() => false)) {
    await tabC.click();
    await page.waitForTimeout(1000);

    console.log('📸 Home C — Drawer (collapsed)');
    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'draft-home-c-drawer.png'),
      fullPage: true,
    });

    const progressBtn = page.locator('button').filter({ hasText: 'Mi progreso' }).first();
    if (await progressBtn.isVisible().catch(() => false)) {
      await progressBtn.click();
      await page.waitForTimeout(800);

      console.log('📸 Home C — Drawer (open)');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'draft-home-c-open.png'),
        fullPage: true,
      });
    }
  }

  console.log('\n✅ All done! Screenshots in e2e/screenshots/');
  await browser.close();
}

run().catch(console.error);
