# PROJECT STATUS - OpositaSmart

> Este archivo se actualiza al final de cada sesion de trabajo con Claude.

---

## Estado Actual

**Ultima actualizacion:** 2026-02-11
**Fase del proyecto:** Beta-Ready (~88% completado) — Data integrity audit in progress
**Branch actual:** feature/feature-based-architecture
**Publish readiness:** 1 CRITICAL pendiente (FK roto, inerte) — resto resuelto

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

### Para produccion (pre-existentes)

| # | Tarea | Notas |
|---|-------|-------|
| P1 | [ ] Testing manual flujo auth → study → results | E2E scripting |
| P2 | [ ] Data export endpoint GDPR | 1 RPC + 1 boton |
| P3 | [ ] IP address hashing en admin_login_attempts | Edit puntual |
| P4 | [ ] Merge a `main` y deploy a Vercel | git commands |
| P5 | [ ] Eliminar OpositaApp.jsx legacy del bundle | Verificar imports + borrar |

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

### Pipeline de Calidad (Rev. 3) — COMPLETADO Feb 10, 2026

#### Pipeline ejecutado:
- [x] **Agente 1 (Reformulador - Sonnet):** 994+54 preguntas reformuladas (100%)
- [x] **Agente 2 (Verificador Lógico - Opus):** 994 verificadas, 143 flags corregidos
- [x] **Agente 3 (Cazador de Discrepancias - Sonnet):** 204 flags encontrados, todos resueltos:
  - 199 tema misassignment → reasignados al tema correcto
  - 91 falsos positivos descartados
  - 3 duplicados desactivados (IDs 107, 668, 1323)
  - 1 legal_reference corregida (ID 676)
  - 1 distractores corregidos (ID 1188)
- [x] **Validación:** 1,363 `auto_validated` + 2 `human_approved` = 0 flags pendientes

#### Reasignaciones de tema importantes:
- Tema 9 vaciado (89 preguntas): 63 LRJSP → Tema 11, 18 CE Título VIII → Tema 2, 2 CE TC → Tema 3, 4 LRJSP → Tema 11, 1 CE → Tema 1, 1 RD → Tema 11
- Tema 1 reducido (75 preguntas): 51 → Tema 3, 15 → Tema 2, 9 → Tema 4
- Tema 4 reducido (28 preguntas): → Tema 3
- Tema 11 (5 preguntas): → Tema 9

#### Snapshot final (Feb 10):
```
total_active: 1,365 (3 duplicados desactivados)
auto_validated: 1,363
human_approved: 2
needs_refresh: 0
Distribución: T1:257, T2:98, T3:234, T4:23, T5:146, T6:44, T7:190, T8:142, T9:5, T10:75, T11:151
```

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
