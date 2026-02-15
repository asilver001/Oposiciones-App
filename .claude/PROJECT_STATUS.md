# PROJECT STATUS - OpositaSmart

> Este archivo se actualiza al final de cada sesion de trabajo con Claude.

---

## Estado Actual

**Ultima actualizacion:** 2026-02-15
**Fase del proyecto:** Beta-Ready (~90% completado) — Contenido en expansion
**Branch actual:** feature/feature-based-architecture (sincronizado con main)
**Publish readiness:** 1 CRITICAL pendiente (FK roto, inerte) — lint 0 errors, CI lint gate activo
**Trabajo paralelo:** Preguntas temas 12-28 en otra instancia de Claude

---

## Scorecard Post-Sprint (Feb 2026)

| Dimension | Antes | Despues | Cambio |
|-----------|-------|---------|--------|
| UI / Design System | 7.5/10 | 9/10 | +1.5 (tokens migrados, gradientes eliminados, dark mode) |
| UX / Flows | 6.5/10 | 8/10 | +1.5 (a11y, focus traps, semantic HTML) |
| Backend / Seguridad | 5/10 | 7.5/10 | +2.5 (admin auth, GDPR, error tracking) |
| Metodologia Educativa | 6.5/10 | 8/10 | +1.5 (FSRS-4.5, post-session analysis, adaptive) |
| Code Quality / Deploy | 6/10 | 8.5/10 | +2.5 (0 lint errors, E2E tests, bundle -60%) |
| **TOTAL** | **6.3/10** | **8.2/10** | **+1.9** |

---

## PENDIENTE - Data Integrity Audit (Feb 11, 2026)

> Assessment encontro 13 issues. 10 resueltos, 3 pendientes.

### Pendientes

| # | Issue | Severidad | Descripcion |
|---|-------|-----------|-------------|
| 2 | [ ] user_question_progress FK roto | CRITICAL | `question_id` UUID vs `questions.id` INTEGER. 0 rows. FSRS per-question inerte. Opcion C: dejar inerte hasta migration futura |
| 4 | [~] test-rapido sin tema | ~~HIGH~~ | Reclasificado: BY DESIGN — quick tests consultan todas las materias |
| 7 | [ ] Dual session recording | MEDIUM | HybridSession escribe a `test_sessions` Y `session_stats`. Duplicado pero no rompe |
| 12 | [ ] Aliases redundantes en sessions | LOW | `correctas`, `correct_answers` duplican datos. Cosmético |

### Resueltos (Feb 11)

| # | Issue | Fix |
|---|-------|-----|
| 1 | FortalezaVisual field mismatch | `nombre→name`, `progreso→progress`, `estado→status` en getFortalezaData |
| 3 | FSRS column names | `ease_factor→difficulty`, `interval→scheduled_days`, `lapses` eliminado (10+ refs) |
| 5 | Legacy no graba sesiones | FALSE POSITIVE — recording pasa dentro del session component via hook |
| 6 | recordDailyStudy .single() | Cambiado a `.maybeSingle()` |
| 8 | fetchFsrsStats semantica | Mastered ahora es per-topic (accuracy >=80%), no global |
| 9 | SW paths | Usa `self.registration.scope` para detectar base path |
| 10 | Comentarios quiz_sessions | Actualizado a `test_sessions` |
| 11 | Streak solo current | Ahora calcula `longestStreak` desde historial completo |
| 13 | Label "Mixto" | Cambiado a "General" para `topic_id=null` |

### Resueltos (Feb 15)

| # | Issue | Fix |
|---|-------|-----|
| P4 | Merge a main + deploy Vercel | feature branch sincronizado con main, auto-deploy activo |
| — | DraftFeatures no funciona en AppRouter | `onShowDraftFeatures` era `() => {}` en MainLayout. Wired correctamente |

### Para produccion (pre-existentes)

| # | Tarea | Notas |
|---|-------|-------|
| P1 | [ ] Testing manual flujo auth → study → results | E2E scripting |
| P2 | [ ] Data export endpoint GDPR | 1 RPC + 1 boton |
| P3 | [ ] IP address hashing en admin_login_attempts | Edit puntual |
| P5 | [ ] Eliminar OpositaApp.jsx legacy del bundle | Verificar imports + borrar |

### Resueltos (Feb 15 — Codex Assessment)

| # | Issue | Fix |
|---|-------|-----|
| — | 7 lint errors (5 unused-vars + 2 memoization) | Removed unused vars, added missing deps to useCallback |
| — | CI/CD no ejecuta lint | Agregado `npx eslint src/` step en deploy.yml antes de build |
| — | README.md era boilerplate Vite | Reescrito con descripcion real del proyecto |
| — | E2E test asumia redirect para 404 | Test ahora acepta /welcome (unauth) o NotFoundPage (auth) |

### Proximas features (post-assessment estrategico)

| # | Feature | Prioridad | Estado |
|---|---------|-----------|--------|
| F1 | Completar 28 temas (preguntas) | CRITICO | En progreso (otra instancia) |
| F2 | Supuestos Practicos (modo estudio) | ALTO | Diseño pendiente |
| F3 | Explicaciones IA con Haiku | ALTO | Diseño pendiente |
| F4 | Monitoreo BOE automatico | MEDIO | Pendiente |
| F5 | Preguntas adaptativas (variantes) | ALTO | Disenado — piloto pendiente |

---

## Modos de Estudio (6 disponibles)

| Modo | Preguntas | Duracion | Estado |
|------|-----------|----------|--------|
| Test Rapido | 10 | ~5 min | Funcional |
| Practica Tema | 20 | ~15 min | Funcional |
| Repaso Errores | 20 | ~15 min | Funcional |
| Flashcards | 20 | ~10 min | Funcional |
| Simulacro | 100 | 60 min | Funcional (adaptive) |
| Lectura | 20 | Libre | Funcional |

---

## Seguridad - Estado Actual

| Aspecto | Estado | Notas |
|---------|--------|-------|
| RLS (Row Level Security) | OK | Todas las tablas sensibles |
| User Auth (Supabase) | OK | Sign up, login, reset password |
| Admin Auth | OK | Migrado a Supabase Auth (sin PINs) |
| SQL Injection | PROTEGIDO | Queries parametrizadas |
| XSS | PROTEGIDO | Sin dangerouslySetInnerHTML |
| CORS | OK | Configurado via Supabase |
| GDPR - Delete Account | OK | RPC delete_own_account + UI con confirmacion |
| GDPR - Consent Tracking | OK | consent_accepted_at + consent_version |
| GDPR - Data Export | PENDIENTE | Falta endpoint |
| Error Tracking | OK | error_logs table + client-side capture |
| Accessibility | OK | aria-labels, focus traps, semantic HTML, skip-to-content |

---

## Metricas de Codigo

- **Build:** 7.5s, compila limpio (1 chunk size warning — OpositaApp legacy 537KB)
- **Bundle principal:** 233KB gzip (antes 567KB = **-60%**)
- **Vendor chunks:** react 11KB, supabase 48KB, ui 49KB
- **Temario graph:** TemarioDendrite + TemarioHexMap en DraftFeatures
- **Lint:** 0 errors, 10 warnings (exhaustive-deps intencionales)
- **CI lint gate:** deploy.yml ejecuta eslint antes de build (max 20 warnings)
- **Tests:** 10+ E2E smoke tests (e2e/smoke.spec.js)
- **Design tokens:** 602 `purple-*` migrados a `brand-*` en 35 archivos

---

## Banco de Preguntas

**En Supabase:** 1,422 preguntas activas (301 importadas, 1,046 reformuladas, 75 AI-created)
**Temas cubiertos:** 16 temas (7 con >100 preguntas, 7 con <20 = CRITICO, 2 en progreso)
**Variantes adaptativas:** Pipeline disenado (3 niveles), piloto pendiente (10/tema)
**Tracker completo:** [QUESTION_TRACKER.md](QUESTION_TRACKER.md)
**Formato:** Multiple choice (4 opciones), con explicacion y referencia legal

### Pipeline de Calidad (Rev. 3) — COMPLETADO Feb 10, 2026

#### Pipeline ejecutado:
- [x] **Agente 1 (Reformulador - Sonnet):** 994+54 preguntas reformuladas (100%)
- [x] **Agente 2 (Verificador Lógico - Sonnet):** 994 verificadas, 143 flags corregidos
- [x] **Agente 3 (Cazador de Discrepancias - Sonnet):** 204 flags encontrados, todos resueltos
- [x] **Validación:** 1,363 `auto_validated` + 2 `human_approved`

### Re-Assessment Opus 4.6 — COMPLETADO (parcial) Feb 15, 2026

> Pipeline Rev.3 (Sonnet) tenia 3 problemas: calificadores perdidos, explicaciones sin cita textual,
> verificador no comparaba original vs reformulada. Re-assessment con Opus 4.6.

#### Resultados Pase 1 (verificacion):
- **1,002/1,120 procesadas (89.5%)** — 118 pendientes (T4: 94 con review_comment viejo)
- 540 `[VERIFIED]` con fuente legal | 460 `[VERIFIED_NO_SOURCE]` (T8/T9/T11)
- 3 respuestas incorrectas corregidas (IDs 1214, 1261, 559)
- 19+ tema mismatches, 12+ near-duplicates, 56 `needs_refresh`
- **Backup:** `questions_pre_reassessment_backup` (1,120 rows)

### Pipeline «Citas Textuales» — COMPLETADO (parcial) Feb 15, 2026

> Solo 34% de explicaciones tienen «citas textuales» del articulo legal.
> Pipeline optimizado: Sonnet agrega citas (mecanico) → Opus verifica (logica juridica).
> Agentes organizados por LEY (no tema) para evitar lecturas redundantes.

#### Paso 1 — Sonnet agrega «citas» (COMPLETADO):
- [x] S-CE: 531 procesadas, 442 con «citas» nuevas (~130K tok)
- [x] S-LOPJ: 65/65 procesadas, 100% con «citas» (~104K tok)
- [x] S-L50: 8/8 procesadas, 100% con «citas» (~57K tok)
- [~] S-LOTC: BLOQUEADO — archivo LOTC.md contiene CE, no LOTC real

**Resultado Paso 1:** 590/1,120 con «citas» (52.7%, subio de 34%)
**LOPJ y Ley 50/1997 al 100%. CE al 82%.**

#### Paso 2 — Verificacion sample (COMPLETADO):
- [x] O-CE: sample 30 qs → 6/6 verificables = 100% EXACT MATCH, 0 errores
- [x] O-LOPJ+L50: sample 20 qs → 20/20 verificadas, 100% correctas, 0 errores
- **Resultado:** 26 preguntas con tag [VERIFIED_QUOTE] en DB
- **Reporte:** `.claude/questions/CE_QUOTE_VERIFICATION_REPORT.md`

#### Archivos de ley — DESBLOQUEADOS (Feb 15, re-extraccion v2):
- [x] LOTC: re-extraida correctamente (106 arts, 91KB) — desbloquea 76 preguntas
- [x] Ley 40/2015 (LRJSP): extraida (158 arts, 379KB) — desbloquea 218 preguntas
- [x] Ley 39/2015 (LPAC): extraida (133 arts, 220KB) — desbloquea 7 preguntas
- [x] LBRL: extraida (15 arts, 20KB) — desbloquea 22 preguntas
- [x] CE: ampliada 61→131 arts (81KB) — desbloquea ~89 preguntas CE sin cita
- Sin referencia legal: 136 preguntas (skip)

**Siguiente:** Ejecutar Ronda 2 de «citas» para LOTC, Ley 40/2015, LBRL, Ley 39/2015, CE restantes (~412 qs)

#### Tokens reales consumidos: ~354K Sonnet (Paso 1) + ~250K Sonnet (Paso 2 verificacion) ≈ 604K total

#### Snapshot actual:
```
total_active: 1,422 (post-migracion 16 temas + 75 AI-created)
OK (>100): T1:241, T2:211, T3:136, T4:126, T5:118, T8:208, T9:211
BAJO: T11:88, T13:16
CRITICO (<20): T6:10, T7:10, T10:10, T12:10, T14:10, T15:7, T16:10
```

#### Pipeline de Variantes Adaptativas (disenado Feb 15):
- **3 niveles:** L1 cosmetico (Haiku), L2 inversion (Sonnet), L3 desde articulo (Sonnet)
- **Verificacion:** SIEMPRE Opus 4.6 (sin excepciones)
- **Cascading review:** Si una variante falla → todas las siblings se re-verifican con Opus
- **Piloto:** 10 semillas/tema × 3 variantes = 480 variantes → Opus → confirmar Tier S
- **Proyeccion total:** 1,422 semillas + 4,266 variantes = ~5,688 preguntas
- **Coste total estimado:** ~$60 (generacion + verificacion Opus)

### Archivos de referencia
- 263 preguntas adicionales en `draft/` (extraidas de examenes Word)
- 4 archivos .doc pendientes de conversion
- Sistema de reportes en Supabase (`question_reports` table)

---

## Deploy

| Plataforma | Branch | Estado |
|------------|--------|--------|
| Vercel | main | Auto-deploy (necesita merge) |
| GitHub Pages | main | Via workflow deploy.yml |
| Branch actual | feature/feature-based-architecture | Desarrollo activo |

---

## COMPLETADO

### Temas Sprint Feb 9, 2026 (Opus)

**Tracking Fix:**
- [x] Fix schema mismatch: `correct_count`→`correct_answers`, `time_seconds`→`time_spent_seconds`, etc. en `recordTestSession`
- [x] Fix `topicId: null` → `temaFilter` ahora se pasa correctamente desde `completeSession`
- [x] Fix `useActivityData` consultaba `quiz_sessions` (no existe) → `test_sessions`
- [x] Fix `useAnalytics` usaba `topic_id` (single) → `tema_filter` (array)
- [x] Fix `useTopics` ahora tambien fetch session-based stats per tema

**Temas UI Mejorada:**
- [x] TemasListView rewrite: sub-agrupaciones por bloque tematico (Constitucion, Organizacion, Empleo)
- [x] Cards mejoradas con: badge de accuracy, sessions completadas, CTA contextual
- [x] Progress header con 4-column stats (Temas, Dominados, Repasar, Practicadas)
- [x] Busqueda mejorada (soporta "tema N" y "tN" patterns)
- [x] Filtro por bloque tematico (Todos, Org. Publica, Act. Administrativa)

**Roadmap Interactivo:**
- [x] TopicRoadmap.jsx: canvas-based dependency graph
- [x] Layout top-to-bottom (Sugiyama BFS) con bezier curves
- [x] Progress arcs, status colors, lock icons, hover tooltips
- [x] Touch support para mobile
- [x] View toggle (List/Network) en TemasPage
- [x] Fix node duplication bug (dedup por topic.number)

**Metas Semanales:**
- [x] `weeklyGoalQuestions` en useUserStore (default: 75)
- [x] WeeklyGoalCard en SoftFortHome: progress bar + day-of-week bar chart
- [x] GoalsConfig panel en SettingsModal: daily (10/15/20/30) + weekly (50/75/100/150)
- [x] Filosofia "sin presion" con mensaje orientativo

**Nivel/Ranking:**
- [x] LevelCard mejorada con progress-to-next-level bar
- [x] 10 niveles con nombres y emojis (Principiante → Leyenda)
- [x] Muestra preguntas restantes para siguiente nivel

### Nice-to-Have Sprint Feb 8, 2026 (Swarm Team - 4 agentes Sonnet)

**Loading Agent:**
- [x] Loading timeout (15s) + retry button en HybridSession, SimulacroSession, FlashcardSession
- [x] Contador de intentos (X de 3) con mensaje final tras 3 fallos
- [x] Timeout (amber Clock) vs Error (red XCircle) UI diferenciada

**Empty State Agent:**
- [x] RecursosPage: EmptyState para busqueda sin resultados (variant blue)
- [x] HybridSession, SimulacroSession, FlashcardSession: EmptyState para "no hay preguntas" (BookOpen icon)
- [x] Separacion de "no questions" (empty state) vs "network error" (error state)

**Prerequisites Agent:**
- [x] `src/data/topicPrerequisites.js`: mapa de prerequisitos para 11 temas AGE
- [x] Helpers: isTopicUnlocked, getUnlockMessage, getRecommendedOrder
- [x] TemasListView: cards bloqueadas con Lock icon + mensaje de prerequisitos
- [x] Seccion "Orden recomendado" con proximos temas sugeridos

**Analytics Agent:**
- [x] `src/hooks/useAnalytics.js`: learning velocity, readiness score, topic strength, days prediction
- [x] `src/components/activity/AnalyticsWidgets.jsx`: ReadinessGauge, VelocityCard, TopicStrengthBars, ReadinessPrediction
- [x] ActividadPage: 3er tab "Analytics" con widgets integrados
- [x] AnalyticsEmptyState para usuarios con <2 sesiones

### Sprint Feb 8, 2026 (Swarm Team - 4 agentes paralelos)

**Security Agent:**
- [x] Admin auth migrado de PINs a Supabase Auth
- [x] Eliminado localStorage session para admin
- [x] AdminLoginModal simplificado (verifica usuario autenticado)
- [x] GDPR: delete_own_account RPC + UI con confirmacion "ELIMINAR"
- [x] GDPR: consent_accepted_at + consent_version en user_profiles
- [x] Migration 012 aplicada a Supabase

**Study Agent:**
- [x] FlashcardSession arreglado (option_a/b/c/d en vez de q.options)
- [x] QuestionCard soporta ambos formatos (JSONB + individual columns)
- [x] Dificultad adaptativa activada en Simulacro
- [x] SessionSummary: analisis post-sesion con breakdown por tema
- [x] FSRS-4.5 implementado (reemplaza SM-2): stability, difficulty, retention target
- [x] Backward compatible con datos existentes

**Quality Agent:**
- [x] 10+ E2E smoke tests (e2e/smoke.spec.js)
- [x] 186 lint errors → 0 errors (8 warnings intencionales)
- [x] Bundle 567KB → 233KB (-60%) via manualChunks
- [x] Error tracking: errorTracking.js + error_logs table en Supabase
- [x] Migration 013 aplicada a Supabase
- [x] ESLint config actualizado (node globals, varsIgnorePattern)

**UI/UX Agent:**
- [x] 602 ocurrencias purple-* → brand-* en 35 archivos
- [x] Gradientes decorativos eliminados (mantenidos solo funcionales)
- [x] Accessibility: aria-labels, role=tab/dialog, focus traps, skip-to-content
- [x] Semantic HTML: nav, header, main elements
- [x] Dark mode: 3-way toggle (Light/System/Dark) + useDarkMode hook
- [x] RecursosPage ya tenia contenido real (BOE links, tips, glossary)
- [x] PWA ya estaba configurado (manifest.json + sw.js)

### Pre-Sprint Completados

#### Arquitectura y Infraestructura
- [x] React Router v6 con navegacion declarativa
- [x] Zustand stores (Navigation, User, Study) - eliminados 40+ useState hooks
- [x] 4 Layouts reutilizables (Main, Auth, Onboarding, Minimal)
- [x] Path aliases (@, @pages, @layouts, @stores, @theme)
- [x] Lazy loading con ErrorBoundary en todas las rutas
- [x] Route guards (RequireAuth, RequireOnboarding, RequireAdmin, RequireReviewer)
- [x] Modo anonimo soportado (try before signup)

#### Design System
- [x] Design tokens definidos en index.css (brand, success, warning, danger)
- [x] Inter Variable font instalada y aplicada
- [x] Sombras coloreadas eliminadas
- [x] Tipografia consistente (peso, tamano, jerarquia)
- [x] Dark mode con CSS custom variant

#### Backend
- [x] RLS comprehensivo en todas las tablas sensibles
- [x] User Auth via Supabase (signup, login, reset password)
- [x] Admin Auth via Supabase (role-based, sin PINs)
- [x] Queries parametrizadas (sin SQL injection)
- [x] 1,368 preguntas importadas en Supabase (temas 1-11)
- [x] Error tracking (error_logs table)
- [x] GDPR compliance (delete account, consent tracking)

#### Paginas y Componentes
- [x] Onboarding completo (6 pasos)
- [x] Auth pages (Login, Signup, ForgotPassword)
- [x] HomePage con SoftFortHome
- [x] TemasPage, ActividadPage, RecursosPage
- [x] StudyPage con preview pre-sesion
- [x] HybridSession, SimulacroSession, FlashcardSession (todos funcionales)
- [x] SessionSummary (post-session analysis)
- [x] MainLayout con TopBar + BottomTabBar
- [x] SettingsModal (con delete account + dark mode toggle)
- [x] ProgressModal, NotFoundPage, AdminPanel, ReviewerPanel

#### Metodologia Educativa
- [x] FSRS-4.5 implementado (stability, difficulty, retention targeting)
- [x] 6 modos de estudio funcionales
- [x] Scoring real en Simulacro con dificultad adaptativa
- [x] Post-session analysis por tema
- [x] Gamificacion saludable

---

## Historial de Sesiones

| Fecha | Resumen |
|-------|---------|
| 2026-02-15 | RE-ASSESSMENT OPUS 4.6: 10 agentes Opus paralelos, 1,002/1,120 procesadas (89.5%). Explicaciones enriquecidas con «citas textuales». 540 verified con fuente, 460 no-source. 3 wrong answers corregidas, 19+ tema mismatches, 12+ near-duplicates. Buscador agregado a ReviewerPanel. Recuadro "Verificada BOE" eliminado de UI. CODEX ASSESSMENT FIX: lint, CI gate, README, E2E fix. Temario viz (Dendrite + HexMap). Pipeline variantes disenado. QUESTION_TRACKER.md creado |
| 2026-02-11 | DATA INTEGRITY AUDIT: Full assessment 2-pass. 13 issues encontrados (3 CRITICAL, 3 HIGH, 3 MEDIUM, 4 LOW). FortalezaVisual field mismatch, FSRS FK roto, column names incorrectos. Nav/auth/guards sin issues. Plan de implementacion creado |
| 2026-02-10 | PIPELINE CALIDAD: Agente 1 (Sonnet) reformuló 994 preguntas, Agente 2 (Opus) verificó lógica y corrigió 143 flags, Agente 3 (Sonnet) cazó 204 discrepancias — pendiente resolver |
| 2026-02-09 | TEMAS SPRINT: Fix tracking progreso (schema mismatch), TemasListView rewrite con sub-agrupaciones, TopicRoadmap canvas interactivo, metas semanales configurables, nivel/ranking con progress bar |
| 2026-02-08 | NICE-TO-HAVE SPRINT: 4-agent Sonnet swarm. Analytics, timeouts, empty states, prerequisites |
| 2026-02-08 | MEGA SPRINT: 4-agent swarm team. 16 items P0/P1/P2 completados. Score 6.3→8.2/10 |
| 2026-02-08 | Full assessment (UI, UX, Backend, Edu, Code). Score 6.3/10. Roadmap definido |
| 2026-02-07 | Design system migration - Inter font, brand tokens, gradient removal |
| 2026-02-06 | Temas session launch, admin guard, 404 page, DevModeRandomizer |
| 2026-02-05 | MainLayout wiring, ProgressModal, DevPanel, daily progress |
| 2026-02-04 | AppRouter activation, MainLayout, security migration, E2E tests |
| 2026-01-25 | Feature-based architecture milestones 3-5 |
| 2026-01-15 | Extraccion de 263 preguntas de examenes Word |
| 2026-01-14 | Sistema gobernanza + migracion 006 + MASTER_OPOSICIONES |
