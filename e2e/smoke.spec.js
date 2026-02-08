// @ts-check
import { test, expect } from '@playwright/test';

const BASE = '/Oposiciones-App';

test.describe('Smoke Tests - Critical User Paths', () => {

  test('welcome page loads correctly', async ({ page }) => {
    await page.goto(`${BASE}/welcome`);
    await page.waitForLoadState('networkidle');

    // Should show the welcome/landing content
    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();

    // Page should have visible content (not blank)
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('login page accessible from welcome', async ({ page }) => {
    await page.goto(`${BASE}/welcome`);
    await page.waitForLoadState('networkidle');

    // Look for a login link/button and click it
    const loginLink = page.locator('a[href*="login"], button:has-text("Iniciar"), a:has-text("Iniciar"), a:has-text("Login"), button:has-text("Login")').first();

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      // Should navigate to login page
      await expect(page).toHaveURL(/login/);
    } else {
      // Navigate directly to login
      await page.goto(`${BASE}/login`);
      await page.waitForLoadState('networkidle');
    }

    // Login page should have email/password inputs
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="correo" i]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });

  test('onboarding flow navigates through all steps', async ({ page }) => {
    await page.goto(`${BASE}/welcome`);
    await page.waitForLoadState('networkidle');

    // Step 1: Welcome page should have a CTA button to start
    const startButton = page.locator('button:has-text("Empezar"), button:has-text("Comenzar"), button:has-text("Start"), a:has-text("Empezar"), a:has-text("Comenzar")').first();
    if (await startButton.isVisible({ timeout: 3000 })) {
      await startButton.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to one of the onboarding steps
      const url = page.url();
      expect(url).toMatch(/onboarding|oposicion/);
    }

    // Navigate through onboarding steps directly
    const onboardingSteps = [
      '/onboarding/oposicion',
      '/onboarding/tiempo',
      '/onboarding/fecha',
      '/onboarding/intro',
    ];

    for (const step of onboardingSteps) {
      await page.goto(`${BASE}${step}`);
      await page.waitForLoadState('networkidle');
      const root = page.locator('#root');
      await expect(root).not.toBeEmpty();
    }
  });

  test('login page renders with form fields', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');

    // Should have email and password inputs
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="correo" i]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto(`${BASE}/this-route-does-not-exist-12345`);
    await page.waitForLoadState('networkidle');

    // Should show some kind of 404 or not found content
    const bodyText = await page.textContent('body');
    const has404 = /404|not found|no encontr|p.gina no/i.test(bodyText);
    expect(has404).toBeTruthy();
  });

  test('signup page accessible', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await page.waitForLoadState('networkidle');

    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();

    // Should have at least email and password fields
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="correo" i]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });

  test('forgot password page accessible', async ({ page }) => {
    await page.goto(`${BASE}/forgot-password`);
    await page.waitForLoadState('networkidle');

    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });

  test('root redirects to welcome', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState('networkidle');

    // Should redirect to /welcome
    await expect(page).toHaveURL(/welcome/);
  });

  test('protected routes redirect unauthenticated users', async ({ page }) => {
    // Trying to access /app/* without auth should redirect to login or welcome
    await page.goto(`${BASE}/app/inicio`);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    // Should not be on the home page (redirected to login/welcome)
    expect(url).toMatch(/login|welcome/);
  });

  test('legal pages are accessible', async ({ page }) => {
    // Terms page
    await page.goto(`${BASE}/terms`);
    await page.waitForLoadState('networkidle');
    let root = page.locator('#root');
    await expect(root).not.toBeEmpty();

    // Privacy page
    await page.goto(`${BASE}/privacy`);
    await page.waitForLoadState('networkidle');
    root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });

  test('app does not show console errors on welcome page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(`${BASE}/welcome`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Filter out known acceptable errors (e.g., Supabase auth warnings)
    const criticalErrors = errors.filter(
      (e) => !e.includes('supabase') && !e.includes('fetch') && !e.includes('network')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
