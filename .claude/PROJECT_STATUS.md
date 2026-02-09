# PROJECT STATUS - OpositaSmart

> Este archivo se actualiza al final de cada sesion de trabajo con Claude.

---

## Estado Actual

**Ultima actualizacion:** 2026-02-09
**Fase del proyecto:** Beta-Ready (~88% completado)
**Branch actual:** feature/feature-based-architecture
**Publish readiness:** SI beta cerrada / Produccion tras testing manual

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

## PENDIENTE - Remaining Items

> **Modelo por defecto: Sonnet 4.5.** Ver CLAUDE.md para regla de escalado.

### Para produccion publica

| # | Tarea | Modelo | Notas |
|---|-------|--------|-------|
| 1 | [ ] Testing manual flujo auth → study → results | Sonnet | E2E scripting + verificacion |
| 2 | [ ] Auditar 50 preguntas random (calidad) | Sonnet | Lectura + SQL queries |
| 3 | [ ] Data export endpoint GDPR | Sonnet | 1 RPC function + 1 boton UI |
| 4 | [ ] IP address hashing en admin_login_attempts | Haiku | Edit puntual en 1 archivo |
| 5 | [ ] Merge a `main` y deploy a Vercel | Haiku | Comandos git |
| 6 | [ ] Eliminar OpositaApp.jsx legacy del bundle | Sonnet | Verificar imports + borrar |

### Nice to have (post-launch)

| # | Tarea | Modelo | Notas |
|---|-------|--------|-------|
| 7 | [x] Analytics avanzados (learning velocity, readiness prediction) | Sonnet | useAnalytics hook + AnalyticsWidgets + 3rd tab en ActividadPage |
| 8 | [ ] Native mobile wrapper (Capacitor) | Opus | Config compleja, multi-plataforma |
| 9 | [x] Loading timeouts + retry buttons en sesiones | Sonnet | 15s timeout + 3 retries en 3 sesiones |
| 10 | [x] Estados vacios consistentes en todas las paginas | Sonnet | EmptyState en RecursosPage + 3 study sessions |
| 11 | [x] Topic prerequisite mapping | Sonnet | topicPrerequisites.js + locked cards en TemasListView |
| 12 | [x] Temas UI mejorada con sub-agrupaciones | Opus | TemasListView rewrite, bloques tematicos, cards mejoradas |
| 13 | [x] Roadmap interactivo de temas | Opus | TopicRoadmap canvas-based, layout top-to-bottom con bezier curves |
| 14 | [x] Metas semanales configurables | Opus | WeeklyGoalCard en home, GoalsConfig en settings, zustand store |
| 15 | [x] Nivel/Ranking con progreso | Opus | LevelCard mejorada con progress-to-next-level bar |
| 16 | [x] Fix tracking progreso por tema | Opus | Schema mismatch test_sessions, column names, temaFilter wiring |

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

- **Build:** 7.2s, compila limpio, 0 warnings de chunk size
- **Bundle principal:** 233KB gzip (antes 567KB = **-60%**)
- **Vendor chunks:** react 11KB, supabase 48KB, ui 49KB
- **Lint:** 0 errors, 8 warnings (exhaustive-deps intencionales)
- **Tests:** 10+ E2E smoke tests (e2e/smoke.spec.js)
- **Design tokens:** 602 `purple-*` migrados a `brand-*` en 35 archivos

---

## Banco de Preguntas

**En Supabase:** 1,368 preguntas activas
**Temas cubiertos:** 1-11 (de 28 total para C2 Auxiliar)
**Formato:** Multiple choice (4 opciones), con explicacion y referencia legal

### Pipeline de Preguntas
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
