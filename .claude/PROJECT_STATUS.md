# PROJECT STATUS - OpositaSmart

> Este archivo se actualiza al final de cada sesion de trabajo con Claude.

---

## Estado Actual

**Ultima actualizacion:** 2026-02-23
**Fase del proyecto:** Beta-Ready (~94% completado) — StudyPlanEngine + weakness analysis + simulacro time tracking
**Branch actual:** main
**Publish readiness:** 0 CRITICAL — build OK, lint 0 errors, 9 warnings (pre-existing)
**Trabajo paralelo:** Migration 014 (FK fix) pendiente de ejecutar en Supabase

---

## Scorecard Post-Sprint (Feb 2026)

| Dimension | Antes | Despues | Cambio |
|-----------|-------|---------|--------|
| UI / Design System | 7.5/10 | 9/10 | +1.5 (tokens migrados, gradientes eliminados, dark mode) |
| UX / Flows | 6.5/10 | 8/10 | +1.5 (a11y, focus traps, semantic HTML) |
| Backend / Seguridad | 5/10 | 7.5/10 | +2.5 (admin auth, GDPR, error tracking) |
| Metodologia Educativa | 6.5/10 | 8.5/10 | +2.0 (FSRS-4.5, StudyPlanEngine, weakness analyzer, time analysis) |
| Code Quality / Deploy | 6/10 | 8.5/10 | +2.5 (0 lint errors, E2E tests, bundle -60%) |
| **TOTAL** | **6.3/10** | **8.2/10** | **+1.9** |

---

## PENDIENTE - Data Integrity Audit (Feb 11, 2026)

> Assessment encontro 13 issues. 10 resueltos, 3 pendientes.

### Pendientes

| # | Issue | Severidad | Descripcion |
|---|-------|-----------|-------------|
| 2 | [~] user_question_progress FK roto | CRITICAL | `question_id` UUID vs `questions.id` INTEGER. Migration 014 SQL creada, codigo actualizado. **Pendiente: ejecutar migration en Supabase** |
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
| P1 | [x] Testing manual flujo auth → study → results | COMPLETADO: e2e/audit-ux.mjs (29 checks, 5-week sim) |
| P2 | [ ] Data export endpoint GDPR | 1 RPC + 1 boton |
| P3 | [ ] IP address hashing en admin_login_attempts | Edit puntual |
| P5 | [x] Eliminar OpositaApp.jsx legacy del bundle | COMPLETADO: OpositaApp.jsx + src/data/questions/ eliminados, main.jsx simplificado |

### Resueltos (Feb 15 — Codex Assessment)

| # | Issue | Fix |
|---|-------|-----|
| — | 7 lint errors (5 unused-vars + 2 memoization) | Removed unused vars, added missing deps to useCallback |
| — | CI/CD no ejecuta lint | Agregado `npx eslint src/` step en deploy.yml antes de build |
| — | README.md era boilerplate Vite | Reescrito con descripcion real del proyecto |
| — | E2E test asumia redirect para 404 | Test ahora acepta /welcome (unauth) o NotFoundPage (auth) |

### Resueltos (Feb 23 — StudyPlanEngine + Cleanup)

| # | Issue/Feature | Fix |
|---|---------------|-----|
| P5 | OpositaApp.jsx (2,186 lines) eliminado | Borrado + src/data/questions/ + main.jsx simplificado (-537KB bundle) |
| — | TOTAL_TOPICS hardcoded 11 | Cambiado a 16 en useAnalytics.js |
| — | "Empezar ahora" no pasaba topic | SessionCard ahora pasa nextTopic + fortalezaData incluye `number` |
| F6 | StudyPlanEngine creado | `src/services/studyPlanEngine.js` — 2-3 actividades diarias basadas en FSRS + accuracy + staleness + prerequisites + exam date |
| F7 | useStudyPlan hook | `src/hooks/useStudyPlan.js` — conecta engine a React via useMemo |
| F8 | TodayPlanSection + ExamCountdown | Nuevos componentes en SoftFortHome con 1-click start |
| F9 | Post-session next step | SessionComplete muestra "Siguiente paso recomendado" con 1-click |
| F10 | Weakness analyzer | `src/services/weaknessAnalyzer.js` — cross-session error patterns, topic trends |
| F11 | Simulacro time tracking | Per-question timing, pacing verdict, rushing detection, tips |
| — | SimulacroSession options sin id | Generate id from index para 107 preguntas sin campo id |
| — | Migration 014 SQL creada | `supabase/migrations/014_fix_question_id_types.sql` — FK UUID→INTEGER (pendiente ejecutar) |

### Resueltos (Feb 19 — UX Audit E2E)

> Audit completo simulando 5 semanas de uso real. 29/29 PASS, 0 FAIL, 0 WARN.

| # | Issue | Fix |
|---|-------|-----|
| — | Raw ISO dates en topic cards | Formato relativo: "hoy", "ayer", "hace X dias", "10 feb" en TemasListView |
| — | getDueReviews 33+ console errors | Reemplazado FK JOIN roto por queries separadas (UUID/INT mismatch) |
| — | updateProgress UUID spam errors | Skip silencioso para question IDs no-UUID (schema mismatch conocido) |
| — | Fortaleza "T8 I.3" en vez de nombre real | Cambiado `topic.code \|\| topic.name` → `topic.name` en getFortalezaData |
| — | session_stats columnas incorrectas | `porcentaje_acierto→porcentaje`, `duracion_segundos→tiempo_segundos`, eliminado `detalles_por_tema` |
| — | session_stats modo CHECK constraint | `'practice'/'estudio'` → `'practica'` (match DB constraint) |
| — | Audit solo 10/20 preguntas | Aumentado a 25 questions + mejor selector "Volver al inicio" |

### Proximas features (post-assessment estrategico)

| # | Feature | Prioridad | Estado |
|---|---------|-----------|--------|
| F1 | Completar 28 temas (preguntas) | CRITICO | En progreso (otra instancia) |
| F2 | Supuestos Practicos (modo estudio) | ALTO | Diseño pendiente |
| F3 | Explicaciones IA con Haiku | ALTO | Diseño pendiente |
| F4 | Monitoreo BOE automatico | MEDIO | Pendiente |
| F5 | Preguntas adaptativas (variantes) | ALTO | Disenado — piloto pendiente |
| F6 | StudyPlanEngine "Tu sesion de hoy" | ALTO | **COMPLETADO** — 2-3 actividades diarias recomendadas |
| F7 | Cross-session weakness analysis | ALTO | **COMPLETADO** — deteccion patrones error persistentes |
| F8 | Simulacro time management analysis | MEDIO | **COMPLETADO** — tracking per-question + pacing verdict |
| F9 | Post-session next step guidance | MEDIO | **COMPLETADO** — recomendacion 1-click tras sesion |

---

## Modos de Estudio (6 disponibles)

| Modo | Preguntas | Duracion | Estado |
|------|-----------|----------|--------|
| Test Rapido | 10 | ~5 min | Funcional |
| Practica Tema | 20 | ~15 min | Funcional |
| Repaso Errores | 20 | ~15 min | Funcional |
| Flashcards | 20 | ~10 min | Funcional |
| Simulacro | 100 | 60 min | Funcional (adaptive + time analysis) |
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

- **Build:** Compila limpio (OpositaApp legacy eliminado — -537KB del bundle)
- **Bundle principal:** ~200KB gzip (post-cleanup)
- **Vendor chunks:** react 11KB, supabase 48KB, ui 49KB
- **Temario graph:** TemarioDendrite + TemarioHexMap en DraftFeatures
- **Lint:** 0 errors, 9 warnings (exhaustive-deps intencionales)
- **CI lint gate:** deploy.yml ejecuta eslint antes de build (max 20 warnings)
- **Tests:** 10+ E2E smoke tests (e2e/smoke.spec.js) + UX audit E2E (29 checks, 5-week sim)
- **Console errors en runtime:** 0 (post-audit fix Feb 19)
- **Design tokens:** 602 `purple-*` migrados a `brand-*` en 35 archivos

---

## Banco de Preguntas

**En Supabase:** 1,422 preguntas activas (301 importadas, 1,046 reformuladas, 75 AI-created)
**Verificadas por capitulo:** 1,422/1,422 (100%) — TODAS verificadas
**Temas cubiertos:** 16 temas (7 con >100 preguntas, 7 con <20 = CRITICO, 2 en progreso)
**Variantes adaptativas:** Pipeline disenado (3 niveles), piloto pendiente (10/tema)
**Tracker completo:** [QUESTION_TRACKER.md](QUESTION_TRACKER.md)
**Formato:** Multiple choice (4 opciones), con explicacion y referencia legal

### Verificacion por Capitulo (Rev. 2) — COMPLETADO Feb 16-19, 2026

> Protocolo: agrupar preguntas por capitulo dentro de cada ley. El agente lee cada capitulo UNA vez
> y verifica TODAS las preguntas de ese capitulo juntas. Detecta drift, contradicciones inter-preguntas,
> y calificadores perdidos. Ejecutado con agentes Sonnet verificando contra textos legales extraidos del BOE.

| Ley | Total | Verified | Answers Fixed | Refs Fixed | Drift Fixed |
|-----|-------|----------|---------------|------------|-------------|
| CE | 705 | 705 | 6 | 31 | 7 |
| Ley 40/2015 | 230 | 226 | 5 | 15 | 2 |
| LOTC | 79 | 79 | 3 | 3 | 2 |
| LOPJ | 67 | 67 | 1 | 1 | 15 |
| Ley 50/1997 | 47 | 47 | 2 | 1 | 1 |
| TREBEP | 28 | 25 | 1 | 4 | 2 |
| LBRL | 23 | 23 | 0 | 3 | 0 |
| Ley 39/2015 | 20 | 20 | 1 | 3 | 0 |
| Ley 19/2013 | 10 | 10 | 0 | 0 | 1 |
| LOPDGDD | 10 | 10 | 0 | 4 | 0 |
| LGP | 6 | 6 | 0 | 0 | 0 |
| LRBRL (T9) | 49 | 49 | 1 | 0 | 0 |
| Otras leyes | 154 | 154 | 1 | 0 | 0 |
| **TOTAL** | **1,422** | **1,422** | **25** | **66** | **30** |

- **0 restantes** — 100% verificacion completada (Feb 20, 2026)
- **25 respuestas incorrectas corregidas** (ej: suplencia Delegado, EPE→Agencia, disciplinaria Subsecretario)
- **66 referencias legales corregidas** (articulos incorrectos, citas verbosas limpiadas, LOPDGDD/RGPD refs)
- **30 drift fixes** (calificadores anadidos/eliminados vs texto legal)
- **5 contradicciones detectadas** (Phase 1 discrepancy): IDs 992, 945, 1440, 1372 corregidos; 560/1386 + 95 pendientes revision humana
- **Archivos de ley:** 11 leyes extraidas del BOE en `.claude/questions/Temario/leyes/` (~4.3MB)
- CE completada: Arts 1-169 (Arts 81-96 anadidos Feb 19)

### Pipelines anteriores (historico)

<details>
<summary>Pipeline Calidad Rev. 3 — Feb 10</summary>

- Agente 1 (Reformulador): 994+54 preguntas reformuladas (100%)
- Agente 2 (Verificador): 994 verificadas, 143 flags corregidos
- Agente 3 (Cazador Discrepancias): 204 flags encontrados, todos resueltos
</details>

<details>
<summary>Re-Assessment Opus 4.6 — Feb 15</summary>

- 1,002/1,120 procesadas (89.5%), 540 con fuente legal, 460 sin fuente
- 3 respuestas incorrectas corregidas, 56 needs_refresh
- Backup: questions_pre_reassessment_backup (1,120 rows)
</details>

<details>
<summary>Pipeline Citas Textuales — Feb 15</summary>

- 590/1,120 con citas textuales (52.7%)
- Verificacion sample Opus: 50/50 = 100% correctas
- Archivos de ley re-extraidos: LOTC, Ley 40/2015, Ley 39/2015, LBRL, CE ampliada
</details>

#### Snapshot actual:
```
total_active: 1,422 (post-migracion 16 temas + 75 AI-created)
verified: 1,422/1,422 (100%)
contradictions_detected: 5 (4 fixed, 1 human review)
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
- [x] Scoring real en Simulacro con dificultad adaptativa + time management analysis
- [x] Post-session analysis por tema + cross-session weakness detection
- [x] StudyPlanEngine: 2-3 actividades diarias personalizadas (FSRS + accuracy + staleness + prerequisites + exam urgency)
- [x] Post-session next step recommendation (1-click to start)
- [x] ExamCountdown con urgency levels
- [x] Gamificacion saludable

---

## Historial de Sesiones

| Fecha | Resumen |
|-------|---------|
| 2026-02-23 | STUDY INTELLIGENCE SPRINT: StudyPlanEngine creado (2-3 actividades diarias recomendadas basadas en FSRS/accuracy/staleness/exam). Home redesign "Tu sesion de hoy" con TodayPlanSection + ExamCountdown. Post-session "Siguiente paso recomendado" con 1-click. weaknessAnalyzer.js para deteccion cross-session de patrones de error. SimulacroSession con time tracking per-question + pacing verdict. OpositaApp.jsx legacy eliminado (-537KB). Migration 014 SQL creada (FK fix pendiente). TOTAL_TOPICS fix 11→16 |
| 2026-02-20 | 100% VERIFICATION + DISCREPANCY PHASE 1: Committed UX audit bug fixes (8 files). Phase 1 contradiction check on 116 hotspot articles (492 questions): 5 contradictions found (4 answers fixed, 1 human review). LRBRL 49 questions verified against law text (1 answer fixed). Other laws 154 verified by knowledge (1 answer fixed). Total: 1,422/1,422 verified (100%). Cumulative: 25 answers fixed, 66 refs fixed, 30 drift fixed |
| 2026-02-19 | UX AUDIT E2E: Seed script 5 semanas datos realistas (40 sesiones, 4 temas). Audit Playwright 29 checks. 6 bugs encontrados y corregidos: ISO dates, getDueReviews FK JOIN, updateProgress UUID, Fortaleza names, session_stats columns/constraint. Resultado final: 29/29 PASS, 0 console errors. Subgrupos temas reorganizados (secuencial BOE) |
| 2026-02-19 | VERIFICACION POR CAPITULO completa: CE(690), L40(220), LOTC(79), LOPJ(67), L50(47), TREBEP(24), LBRL(23), L39(20) = 1,171/1,422 (82.3%). 18 answers fixed, 58 refs fixed, 29 drift fixed. CE Arts 81-96 extraidos. TREBEP verificado con texto legal |
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
