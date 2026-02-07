/**
 * E2E Tests - Critical Flows
 *
 * Tests for the beta-critical user flows:
 * 1. Welcome/onboarding pages render correctly
 * 2. Auth pages (login, signup, forgot-password) render
 * 3. Navigation works between pages
 * 4. Protected routes redirect to login
 * 5. Legal pages are accessible
 */

import { test, expect } from '@playwright/test';

// HashRouter base - all routes are after /#
const hash = (path) => `/#${path}`;

test.describe('Welcome & Onboarding', () => {
  test('welcome page renders with CTA buttons', async ({ page }) => {
    await page.goto(hash('/welcome'));
    await page.waitForLoadState('networkidle');

    // Should show app title
    await expect(page.locator('text=Oposita Smart')).toBeVisible();

    // Should have "Empezar" button
    await expect(page.locator('text=Empezar')).toBeVisible();

    // Should have "Ya tengo cuenta" link
    await expect(page.locator('text=Ya tengo cuenta')).toBeVisible();
  });

  test('clicking Empezar navigates to onboarding', async ({ page }) => {
    await page.goto(hash('/welcome'));
    await page.waitForLoadState('networkidle');

    await page.click('text=Empezar');
    await page.waitForTimeout(1000);

    // Should navigate to onboarding oposicion page
    expect(page.url()).toContain('/onboarding/oposicion');
  });

  test('clicking Ya tengo cuenta goes to login', async ({ page }) => {
    await page.goto(hash('/welcome'));
    await page.waitForLoadState('networkidle');

    await page.click('text=Ya tengo cuenta');
    await page.waitForTimeout(1000);

    expect(page.url()).toContain('/login');
  });

  test('onboarding oposicion page renders', async ({ page }) => {
    await page.goto(hash('/onboarding/oposicion'));
    await page.waitForLoadState('networkidle');

    // Should have content (not blank)
    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });
});

test.describe('Auth Pages', () => {
  test('login page renders with form', async ({ page }) => {
    await page.goto(hash('/login'));
    await page.waitForLoadState('networkidle');

    // Should show login title (with accent: sesión)
    await expect(page.locator('text=Iniciar sesión').first()).toBeVisible();

    // Should have email and password fields
    await expect(page.locator('input[type="email"], input[placeholder*="email" i]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();

    // Should have submit button
    await expect(page.locator('button:has-text("Iniciar sesión")').first()).toBeVisible();

    // Should have link to signup
    await expect(page.locator('text=Crear cuenta')).toBeVisible();
  });

  test('signup page renders with form', async ({ page }) => {
    await page.goto(hash('/signup'));
    await page.waitForLoadState('networkidle');

    // Should have signup form elements
    await expect(page.locator('input[type="email"], input[placeholder*="email" i]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('forgot password page renders', async ({ page }) => {
    await page.goto(hash('/forgot-password'));
    await page.waitForLoadState('networkidle');

    // Should have email input for reset
    await expect(page.locator('input[type="email"], input[placeholder*="email" i]').first()).toBeVisible();
  });

  test('login page has link to forgot password', async ({ page }) => {
    await page.goto(hash('/login'));
    await page.waitForLoadState('networkidle');

    const forgotLink = page.locator('text=Olvidaste');
    await expect(forgotLink).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('/app redirects unauthenticated users to login', async ({ page }) => {
    await page.goto(hash('/app/inicio'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Should redirect to login
    expect(page.url()).toContain('/login');
  });

  test('/app/temas redirects to login', async ({ page }) => {
    await page.goto(hash('/app/temas'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    expect(page.url()).toContain('/login');
  });
});

test.describe('Legal Pages', () => {
  test('terms page is accessible', async ({ page }) => {
    await page.goto(hash('/terms'));
    await page.waitForLoadState('networkidle');

    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });

  test('privacy page is accessible', async ({ page }) => {
    await page.goto(hash('/privacy'));
    await page.waitForLoadState('networkidle');

    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });
});

test.describe('Navigation', () => {
  test('root redirects to welcome', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    expect(page.url()).toContain('/welcome');
  });

  test('unknown routes redirect to welcome', async ({ page }) => {
    await page.goto(hash('/nonexistent-page'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    expect(page.url()).toContain('/welcome');
  });

  test('no console errors on welcome page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(hash('/welcome'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Filter out known non-critical errors (service worker 404, etc.)
    const criticalErrors = errors.filter(
      (e) => !e.includes('service-worker') && !e.includes('fetch')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Visual Regression', () => {
  test('welcome page screenshot', async ({ page }) => {
    await page.goto(hash('/welcome'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: 'e2e/screenshots/e2e-welcome.png',
      fullPage: true,
    });
  });

  test('login page screenshot', async ({ page }) => {
    await page.goto(hash('/login'));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: 'e2e/screenshots/e2e-login.png',
      fullPage: true,
    });
  });
});
