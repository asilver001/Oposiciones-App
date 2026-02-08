// e2e/take-screenshots.js
// Script standalone para tomar capturas de la app.
//
// Uso:
//   node e2e/take-screenshots.js                    # Captura todas las rutas definidas
//   node e2e/take-screenshots.js /login /dashboard  # Captura rutas específicas
//
// Requisitos: El dev server debe estar corriendo (npm run dev)
//
// Las capturas se guardan en e2e/screenshots/ y Claude las puede ver con Read tool.

import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/Oposiciones-App';
const SCREENSHOT_DIR = join(import.meta.dirname, 'screenshots');

// Viewports a capturar
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 720 },
];

// Rutas a capturar (puedes añadir más)
const DEFAULT_ROUTES = [
  { path: '/', name: 'home' },
];

async function takeScreenshots(routes) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`📸 ${viewport.name} → ${url}`);

      try {
        // Capturar errores de consola
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', err => errors.push(err.message));

        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        // Esperar a que React renderice contenido visible
        await page.waitForSelector('#root > *', { timeout: 10000 }).catch(() => {});
        // Esperar un poco para animaciones y CSS
        await page.waitForTimeout(1500);

        // Debug: mostrar estado del DOM
        const rootHTML = await page.evaluate(() => {
          const root = document.getElementById('root');
          return {
            childCount: root?.children?.length || 0,
            innerHTML: root?.innerHTML?.substring(0, 500) || 'EMPTY',
            bodyBg: getComputedStyle(document.body).backgroundColor,
          };
        });
        console.log(`   DOM: ${rootHTML.childCount} children, bg: ${rootHTML.bodyBg}`);
        if (rootHTML.innerHTML === 'EMPTY' || rootHTML.childCount === 0) {
          console.log(`   ⚠️  Root vacío. HTML: ${rootHTML.innerHTML}`);
        }
        if (errors.length > 0) {
          console.log(`   ⚠️  Errores consola: ${errors.slice(0, 3).join(' | ')}`);
        }

        const filename = `${route.name}-${viewport.name}.png`;
        await page.screenshot({
          path: join(SCREENSHOT_DIR, filename),
          fullPage: true,
        });
        console.log(`   ✅ ${filename}`);
      } catch (err) {
        console.error(`   ❌ Error: ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n📁 Capturas guardadas en ${SCREENSHOT_DIR}/`);
}

// Parsear argumentos CLI o usar rutas por defecto
const args = process.argv.slice(2);
const routes = args.length > 0
  ? args.map(path => ({ path, name: path.replace(/\//g, '_').replace(/^_/, '') || 'home' }))
  : DEFAULT_ROUTES;

takeScreenshots(routes);
