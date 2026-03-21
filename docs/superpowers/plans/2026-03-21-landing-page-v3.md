# Landing Page V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current simple WelcomeScreen with a full landing page featuring hero, convocatorias dashboard, academy comparison, features, how-it-works, readiness radar, resource download, and final CTA — matching the V3 mockup approved in the visual companion.

**Architecture:** The landing is a single-page scroll built from 10 React section components. WelcomePage.jsx keeps its auth guard logic unchanged and renders the new `LandingPage` component instead of `WelcomeScreen`. All styles use inline `style={{}}` props (consistent with Editorial Calm pattern used elsewhere in the app). Fonts loaded via `<link>` in `index.html`.

**Tech Stack:** React 19, inline styles (no new Tailwind classes), DM Serif Display + Instrument Sans (Google Fonts), Lucide icons where applicable, SVG radar chart.

**Design reference:** `.superpowers/brainstorm/694-1774129775/landing-v3.html`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/components/landing/LandingNav.jsx` | Sticky nav with logo + links + CTA |
| Create | `src/components/landing/LandingHero.jsx` | Hero section (headline, sub, CTAs, phone mockup) |
| Create | `src/components/landing/InsightBanner.jsx` | Dark green banner with "68% olvido" stat |
| Create | `src/components/landing/SocialStrip.jsx` | 4-stat strip (5 min, 1.414, 14 temas, 0€) |
| Create | `src/components/landing/ConvocatoriasDashboard.jsx` | Stats row + filter chips + 3 convocatoria cards |
| Create | `src/components/landing/AcademyCompare.jsx` | Side-by-side academia vs OpositaSmart |
| Create | `src/components/landing/FeaturesGrid.jsx` | 6 feature cards with benefit titles |
| Create | `src/components/landing/HowItWorks.jsx` | 4-step dark section |
| Create | `src/components/landing/ReadinessRadar.jsx` | Radar SVG chart + breakdown explanation |
| Create | `src/components/landing/ResourceDownload.jsx` | PDF download CTA section |
| Create | `src/components/landing/FinalCTA.jsx` | Final conversion section + footer |
| Create | `src/components/landing/LandingPage.jsx` | Orchestrator: composes all sections + mobile sticky CTA |
| Modify | `src/components/onboarding/WelcomeScreen.jsx` | Keep file but it becomes unused (LandingPage replaces it) |
| Modify | `src/pages/onboarding/WelcomePage.jsx` | Import LandingPage instead of WelcomeScreen |
| Modify | `index.html` | Update OG tags, meta description, font preload, structured data, theme-color |

---

## Task 1: Update index.html — OG tags, fonts, structured data

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update meta tags and OG tags**

Replace the current `<head>` content with updated SEO, OG, and font preload tags. Key changes:
- Title: `Preparar Auxiliar Administrativo del Estado | Oposita Smart — Gratis`
- OG title: `Prepara el Auxiliar AGE gratis — 1.414 preguntas con algoritmo inteligente`
- OG description: `Sin academia, sin presión. 1.414 preguntas + simulacros reales. Beta gratuita.`
- OG image: `https://www.opositasmart.com/og-image.jpg?v=1`
- OG url: `https://www.opositasmart.com/`
- Canonical: `https://www.opositasmart.com/`
- Theme-color: `#1B4332` (was `#7C3AED`)
- Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- Add `<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">`
- Update structured data to `SoftwareApplication` with `"price": "0"` and `"description"` mentioning the specific exam

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update OG tags, fonts, and structured data for landing V3"
```

---

## Task 2: Create section components (LandingNav, LandingHero, InsightBanner, SocialStrip)

**Files:**
- Create: `src/components/landing/LandingNav.jsx`
- Create: `src/components/landing/LandingHero.jsx`
- Create: `src/components/landing/InsightBanner.jsx`
- Create: `src/components/landing/SocialStrip.jsx`

- [ ] **Step 1: Create `LandingNav.jsx`**

Sticky nav bar with:
- Logo icon (green gradient square with layers SVG) + "Oposita Smart" in DM Serif Display
- Nav links: Convocatorias, Funciones, Método (hidden on mobile)
- CTA button "Beta gratuita" with pulsing green dot
- `onStart` prop wired to nav CTA
- Mobile: hide text links, show only logo + CTA

- [ ] **Step 2: Create `LandingHero.jsx`**

Two-column grid (single column on mobile):
- Left: eyebrow "Para quienes llevan demasiado tiempo esperando su plaza", H1 "La academia no te va a dar *esto gratis*", subtitle, CTA "Ver mi nivel ahora" with micro-copy, secondary "Ver cómo funciona"
- Right (desktop only): phone mockup with question card, floating readiness card (73%), floating streak card
- Props: `onStart`, `onLogin`
- Mobile: hide `.hero-visual` entirely, stack CTAs full-width

- [ ] **Step 3: Create `InsightBanner.jsx`**

Dark green (#1B4332) full-width banner:
- DM Serif Display text: "El **68% de los opositores que suspenden** ya habían estudiado el temario completo al menos una vez. El problema no es el temario. **Es el olvido.**"
- Source line in small muted text

- [ ] **Step 4: Create `SocialStrip.jsx`**

4-item strip: "5 min" / "1.414 preguntas" / "14 temas" / "0€ acceso fundador"
- Dividers between items on desktop
- 2x2 grid on mobile

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: No errors (components not imported yet, tree-shaken)

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add landing nav, hero, insight banner, social strip components"
```

---

## Task 3: Create ConvocatoriasDashboard + AcademyCompare

**Files:**
- Create: `src/components/landing/ConvocatoriasDashboard.jsx`
- Create: `src/components/landing/AcademyCompare.jsx`

- [ ] **Step 1: Create `ConvocatoriasDashboard.jsx`**

"Engineering as marketing" section with:
- Header: eyebrow "Convocatorias 2025–2026", H2 "Panel de oposiciones en tiempo real"
- 4 stat cards in a row: 47.382 plazas OEP, 12.456 convocadas, 8 abiertas, 127d próximo examen — each with progress bar
- Filter chips row: Todos (active), C1, C2, A1/A2, Estado, CCAA, Local — chips are decorative (no JS filtering needed)
- 3 convocatoria cards with: title, badge (Convocada/Prevista/En plazo), plazas number + bar, group + countdown
- Mobile: stats 2x2, cards single column

- [ ] **Step 2: Create `AcademyCompare.jsx`**

Side-by-side comparison:
- Left card (white): "Academia tradicional" with 5 rows (💸 6000€, 🕐 3h, 📖 estático, ❓ no sabes, 😰 presión)
- Right card (green gradient): "Oposita Smart" with 5 rows (✅ gratis, ✅ 10min, ✅ adapta, ✅ índice, ✅ tu ritmo)
- Mobile: stack vertically

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add convocatorias dashboard and academy comparison sections"
```

---

## Task 4: Create FeaturesGrid, HowItWorks, ReadinessRadar

**Files:**
- Create: `src/components/landing/FeaturesGrid.jsx`
- Create: `src/components/landing/HowItWorks.jsx`
- Create: `src/components/landing/ReadinessRadar.jsx`

- [ ] **Step 1: Create `FeaturesGrid.jsx`**

6 feature cards in 3-column grid (1 col mobile):
- Titles are benefits: "El sistema que estudia por ti", "Sabes exactamente cuánto te falta", "5 minutos al día sin excusas", "El día del examen, sin sorpresas", "Lo que se te olvida, vuelve", "Deja de estudiar lo que ya sabes"
- Each card: emoji icon in green-tinted square, DM Serif title, body text
- Hover: translateY(-4px) + shadow (disabled on mobile/touch)

- [ ] **Step 2: Create `HowItWorks.jsx`**

Dark green (#1B4332) full-width section:
- 4 steps in grid (single col on mobile with flex layout)
- Large step numbers (01-04) in muted green
- Titles + descriptions in white/semi-transparent

- [ ] **Step 3: Create `ReadinessRadar.jsx`**

Two-column layout:
- Left: text explanation with 3 dimension rows (📚 Cobertura 30%, 🎯 Precisión 40%, 📝 Simulacros 30%)
- Right: SVG radar chart with 5 axes (Cobertura, Precisión, Simulacros, Velocidad, Regularidad), data polygon, score "73/100", "Avanzado" badge
- Mobile: radar first (order: -1)

- [ ] **Step 4: Verify build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add features grid, how-it-works, and readiness radar sections"
```

---

## Task 5: Create ResourceDownload, FinalCTA, LandingPage orchestrator

**Files:**
- Create: `src/components/landing/ResourceDownload.jsx`
- Create: `src/components/landing/FinalCTA.jsx`
- Create: `src/components/landing/LandingPage.jsx`

- [ ] **Step 1: Create `ResourceDownload.jsx`**

Centered section with warm gradient background:
- H3: "Las 50 preguntas más repetidas en oposiciones AGE"
- Body text: "Descarga gratis... Sin registro."
- Download button with SVG download icon
- Button is decorative for now (no actual PDF attached)

- [ ] **Step 2: Create `FinalCTA.jsx`**

Centered section + footer:
- H2: "La oposición no la gana quien más estudia en junio. *La gana quien no olvida lo de enero.*"
- Body, CTA "Descubrir mi nivel de preparación", fine print
- Footer: dark background, logo + links (Términos, Privacidad, Contacto, opositasmart.com)
- Props: `onStart`

- [ ] **Step 3: Create `LandingPage.jsx`**

Orchestrator component that:
- Accepts `onStart` and `onLogin` props
- Renders all 10 sections in order
- Adds mobile sticky CTA at bottom (fixed, only on <768px)
- Sets `document.body.style` for font-family and background on mount (cleanup on unmount)

```jsx
export default function LandingPage({ onStart, onLogin }) {
  return (
    <div style={{ fontFamily: "'Instrument Sans', sans-serif", background: '#F5F1EB' }}>
      <LandingNav onStart={onStart} />
      <LandingHero onStart={onStart} onLogin={onLogin} />
      <InsightBanner />
      <SocialStrip />
      <ConvocatoriasDashboard />
      <AcademyCompare />
      <FeaturesGrid />
      <HowItWorks />
      <ReadinessRadar />
      <ResourceDownload />
      <FinalCTA onStart={onStart} />
      <MobileStickyBar onStart={onStart} />
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/
git commit -m "feat: add resource download, final CTA, and landing page orchestrator"
```

---

## Task 6: Wire LandingPage into WelcomePage + final verification

**Files:**
- Modify: `src/pages/onboarding/WelcomePage.jsx`

- [ ] **Step 1: Update WelcomePage to use LandingPage**

Replace the `WelcomeScreen` import with `LandingPage`:

```jsx
import LandingPage from '../../components/landing/LandingPage';
// Remove: import WelcomeScreen from '../../components/onboarding/WelcomeScreen';

// In the return:
return (
  <LandingPage
    onStart={handleStart}
    onLogin={handleLogin}
  />
);
```

Keep ALL auth guard logic unchanged (loading state, user redirect, devOverride).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS with no errors

- [ ] **Step 3: Take Playwright screenshots**

Run: `node e2e/take-screenshots.js` (dev server must be running)
Verify: welcome page shows full landing in both mobile and desktop

- [ ] **Step 4: Test auth flow**

Manually verify:
- Click "Ver mi nivel ahora" → navigates to `/#/onboarding/oposicion`
- Click "Ya tengo cuenta" (secondary in hero) → navigates to `/#/login`
- Authenticated user visiting `/#/welcome` → redirected to `/#/app/inicio`

- [ ] **Step 5: Commit and push**

```bash
git add src/pages/onboarding/WelcomePage.jsx src/components/landing/
git commit -m "feat: wire landing page V3 into welcome route"
git push origin main
```

---

## Notes

- **No new npm packages** — all inline styles + native SVG
- **WelcomeScreen.jsx is NOT deleted** — kept as fallback reference but no longer imported
- **Fonts** — DM Serif Display + Instrument Sans loaded via `<link>` in `index.html` (already added in Task 1)
- **Mobile sticky CTA** — uses `position: fixed` with `env(safe-area-inset-bottom)` for iPhone home bar
- **Convocatorias data** — hardcoded in the component for now; can be wired to Supabase later
- **Filter chips** — decorative only (visual, no JS state), clickable feel but no actual filtering
- **Resource PDF** — download button is decorative; wire to actual PDF when created
