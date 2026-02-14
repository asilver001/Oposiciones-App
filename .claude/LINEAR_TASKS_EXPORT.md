# Linear Tasks Export - OpositaSmart MVP

Generated: 2026-01-31
Source: MVP_ROADMAP.md

---

## How to Import to Linear

### Option 1: Copy/Paste (Quick)
Copy each section below and create issues manually in Linear.

### Option 2: Linear API (Programmatic)
Provide your Linear API key and I can import via GraphQL API.

### Option 3: CSV Import
Linear supports CSV imports. Use the CSV section at the bottom.

---

## FASE 0: Críticos Pre-Deploy

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| Habilitar RLS en questions, badges, waitlist | P0 | Backlog | 1h |
| Corregir SQL injection en spacedRepetitionService.js | P0 | Backlog | 30m |
| Crear índices en base de datos | P0 | Backlog | 2h |
| Implementar bulk import questions | P1 | Backlog | 1h |
| Rate limiting admin login | P1 | Backlog | 2h |
| Testing básico de seguridad | P1 | Backlog | 3h |
| Importar temas faltantes (l39, otras-leyes, ebep) | P2 | Backlog | 2h |

**Label:** `security`, `database`, `fase-0`

---

## FASE 1: Refactor Arquitectónico (En Progreso)

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| ~~Crear estructura /pages, /layouts, /theme~~ | P1 | Done | 2h |
| ~~Crear AppRouter.jsx~~ | P1 | Done | 4h |
| ~~Extraer HomePage~~ | P1 | Done | 6h |
| ~~Extraer StudyPage~~ | P1 | Done | 8h |
| ~~Crear MainLayout con TopBar + BottomTabBar~~ | P1 | Done | 4h |
| ~~Extraer ActividadPage, RecursosPage, AdminPage~~ | P1 | Done | 12h |
| ~~Crear Design System (/theme)~~ | P1 | Done | 8h |
| ~~Mover componentes a estructura correcta~~ | P1 | Done | 6h |
| ~~Actualizar imports~~ | P1 | Done | 4h |
| Implementar Zustand - Integrar stores en páginas | P1 | In Progress | 8h |
| Eliminar prop drilling | P1 | In Progress | 8h |
| Testing de navegación | P2 | Backlog | 6h |
| Code review completo | P2 | Backlog | 4h |

**Label:** `refactor`, `architecture`, `fase-1`

---

## FASE 2: UI/UX Polish

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| Implementar Toast notifications | P1 | Backlog | 3h |
| Loading skeletons en 5 pantallas | P2 | Backlog | 4h |
| Mejorar WelcomeScreen | P2 | Backlog | 1h |
| Consistencia de micro-interactions | P2 | Backlog | 2h |
| Fix responsive en mobile | P1 | Backlog | 6h |
| Typography hierarchy | P2 | Backlog | 2h |
| Accessibility audit + fixes | P1 | Backlog | 4h |
| Confirmación de acciones destructivas | P2 | Backlog | 2h |
| Contextual help/tooltips | P3 | Backlog | 6h |
| Pull-to-refresh en mobile | P3 | Backlog | 3h |
| Testing UI completo | P1 | Backlog | 6h |
| Plan diario en Home con countdown a examen | P1 | Backlog | 3h |
| Feedback post-test con temas débiles + CTAs | P1 | Backlog | 4h |

**Label:** `ui`, `ux`, `fase-2`

---

## FASE 3: Features MVP

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| Simulacros - Crear tablas BD | P1 | Backlog | 4h |
| Simulacros - UI página simulacros | P1 | Backlog | 8h |
| Simulacros - Timer + scoring con penalización | P1 | Backlog | 6h |
| Simulacros - Resultados detallados | P1 | Backlog | 4h |
| Sistema de reportes UI (modal) | P2 | Backlog | 4h |
| Filtros avanzados en ReviewContainer | P2 | Backlog | 6h |
| Export de progreso (PDF/CSV) | P2 | Backlog | 6h |
| Notificaciones push (setup) | P3 | Backlog | 4h |
| Onboarding mejorado (tour guiado) | P2 | Backlog | 8h |
| Sistema de badges visual | P2 | Backlog | 4h |
| Dashboard de admin mejorado | P2 | Backlog | 6h |
| Testing E2E completo | P1 | Backlog | 8h |

**Label:** `feature`, `mvp`, `fase-3`

---

## FASE 4: Testing & QA

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| Tests unitarios servicios (70% coverage) | P1 | Backlog | 12h |
| Tests integración hooks (40% coverage) | P1 | Backlog | 8h |
| Tests E2E flujos principales | P1 | Backlog | 6h |
| Performance testing (Lighthouse) | P2 | Backlog | 4h |
| Security audit externo | P1 | Backlog | 8h |
| Load testing (100 usuarios) | P2 | Backlog | 4h |
| Bug bash interno | P2 | Backlog | 8h |

**Label:** `testing`, `qa`, `fase-4`

---

## FASE 5: Pre-Launch

| Title | Priority | Status | Estimate |
|-------|----------|--------|----------|
| Migración datos draft → producción | P1 | Backlog | 4h |
| Setup analytics (GA/Mixpanel) | P1 | Backlog | 3h |
| Error tracking (Sentry) | P1 | Backlog | 2h |
| Documentación usuario final | P2 | Backlog | 6h |
| Landing page | P1 | Backlog | 8h |
| Beta testing con 10 usuarios | P1 | Backlog | 12h |
| Incorporar feedback beta | P1 | Backlog | 8h |
| Deploy a staging + smoke tests | P1 | Backlog | 4h |
| Deploy a producción | P0 | Backlog | 2h |

**Label:** `launch`, `fase-5`

---

## CSV Format (for Linear Import)

```csv
Title,Priority,Status,Estimate,Labels
Habilitar RLS en questions badges waitlist,Urgent,Backlog,1h,"security,fase-0"
Corregir SQL injection spacedRepetitionService,Urgent,Backlog,30m,"security,fase-0"
Crear índices en base de datos,Urgent,Backlog,2h,"database,fase-0"
Implementar bulk import questions,High,Backlog,1h,"performance,fase-0"
Rate limiting admin login,High,Backlog,2h,"security,fase-0"
Testing básico de seguridad,High,Backlog,3h,"security,fase-0"
Importar temas faltantes banco preguntas,Medium,Backlog,2h,"content,fase-0"
Integrar Zustand stores en páginas,High,In Progress,8h,"refactor,fase-1"
Eliminar prop drilling,High,In Progress,8h,"refactor,fase-1"
Testing de navegación,Medium,Backlog,6h,"testing,fase-1"
Code review completo,Medium,Backlog,4h,"review,fase-1"
Implementar Toast notifications,High,Backlog,3h,"ui,fase-2"
Plan diario en Home con countdown,High,Backlog,3h,"feature,fase-2"
Feedback post-test con temas débiles,High,Backlog,4h,"feature,fase-2"
Simulacros - Crear tablas BD,High,Backlog,4h,"feature,fase-3"
Simulacros - UI página,High,Backlog,8h,"feature,fase-3"
Simulacros - Timer + scoring,High,Backlog,6h,"feature,fase-3"
```

---

## Summary Stats

| Fase | Total Tasks | Done | In Progress | Backlog |
|------|------------|------|-------------|---------|
| Fase 0 | 7 | 1 | 0 | 6 |
| Fase 1 | 13 | 9 | 2 | 2 |
| Fase 2 | 13 | 0 | 0 | 13 |
| Fase 3 | 12 | 0 | 0 | 12 |
| Fase 4 | 7 | 0 | 0 | 7 |
| Fase 5 | 9 | 0 | 0 | 9 |
| **Total** | **61** | **10** | **2** | **49** |

**Progress:** 16% complete (10/61 tasks done)

---

## Quick Actions

### To use Linear API:
1. Go to Linear Settings → API → Create API Key
2. Share the key with me
3. I'll import all tasks programmatically

### To import CSV:
1. Go to Linear → Team → Settings → Import
2. Select CSV import
3. Paste the CSV content above
