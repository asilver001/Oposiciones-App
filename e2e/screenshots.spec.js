// e2e/screenshots.spec.js
// Script para tomar capturas de pantalla de la app
// Uso: npx playwright test e2e/screenshots.spec.js
//
// Las capturas se guardan en e2e/screenshots/
// Claude puede leerlas con el Read tool para verificar cambios visuales.

import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const SCREENSHOT_DIR = 'e2e/screenshots';

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

test('captura - página de login', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/login-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

// Puedes añadir más capturas según necesites:
//
// test('captura - dashboard', async ({ page }, testInfo) => {
//   // Primero hacer login si es necesario
//   await page.goto('/');
//   await page.waitForLoadState('networkidle');
//   // ... interactuar para navegar al dashboard
//   await page.screenshot({
//     path: `${SCREENSHOT_DIR}/dashboard-${testInfo.project.name}.png`,
//     fullPage: true,
//   });
// });
