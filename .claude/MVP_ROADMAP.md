# MVP ROADMAP - OpositaSmart
## Plan Consolidado Post-Assessment Completo

**Fecha:** 24 de Enero, 2026
**Última Actualización:** 31 de Enero, 2026
**Estado Actual:** Pre-beta (~50% completado) ⬆️ +15%
**Objetivo:** Definir ruta clara hacia MVP funcional y deployable

---

## RESUMEN EJECUTIVO

Se realizó un assessment exhaustivo de OpositaSmart desde 4 ángulos:
1. **UI/UX** - Experiencia de usuario
2. **Arquitectura** - Código y estructura
3. **Datos/BD** - Backend y seguridad
4. **Estructura** - Organización de archivos

### Hallazgos Críticos:

| Área | Score | Problemas Críticos | Deuda Técnica |
|------|-------|-------------------|---------------|
| **UI/UX** | 6.1/10 | 4 bloqueadores, 6 altos | 60-80 horas |
| **Arquitectura** | - | Monolito 1,869 líneas | 585-485 horas |
| **Datos/BD** | - | RLS disabled, SQL injection | 40-50 horas |
| **Estructura** | - | Sin routing, carpetas confusas | 17-20 horas |
| **TOTAL** | - | **15 bloqueadores** | **700-635 horas** |

**Tiempo realista para MVP:** 8-12 semanas (2 devs full-time)

---

## PROBLEMAS CRÍTICOS (MVP BLOCKERS)

### 🔴 CRÍTICO 1: Seguridad de Base de Datos

**Problema:**
- RLS deshabilitado en tabla `questions` (cualquiera puede escribir)
- SQL injection en `spacedRepetitionService.js:104`
- PIN de admin sin rate limiting (brute-force attack posible)

**Impacto:** **App no es deployable en producción**

**Solución:**
1. Habilitar RLS en `questions`, `badges`, `waitlist`
2. Corregir SQL injection (usar API nativa Supabase)
3. Implementar rate limiting en admin login

**Tiempo:** 4-6 horas
**Prioridad:** P0 - INMEDIATO

---

### ✅ CRÍTICO 2: OpositaApp.jsx Monolito (1,869 líneas) - RESUELTO

**Problema Original:**
- Contiene routing, estado global (37 hooks), UI de 10+ páginas
- Imposible testear, mantener, o escalar
- Git conflicts constantes

**Estado Actual (31 Ene 2026):**
1. ✅ Extraer routing → `AppRouter.jsx` **COMPLETADO**
2. ✅ Dividir en páginas individuales (`/pages`) **19 PÁGINAS CREADAS**
3. ✅ Crear layouts (`/layouts`) **TopBar + BottomTabBar**
4. 🔄 Reducir estado global con Zustand **STORES CREADOS, INTEGRACIÓN PENDIENTE**

**Métricas:**
- OpositaApp.jsx: 1,869 → 2,151 líneas (aún tiene onboarding inline)
- Páginas extraídas: 19 (con lazy loading)
- Code splitting: ✅ Implementado

**Tiempo restante:** 8-10 horas (extraer onboarding inline + integrar stores)
**Prioridad:** P1 - EN PROGRESO

---

### ✅ CRÍTICO 3: Empty States Faltantes - COMPLETADO

**Problema Original:**
- Usuarios nuevos ven pantallas vacías sin instrucción
- No hay guía de "qué hacer ahora"
- Presente en: StudyDashboard, ActividadPage, TemasListView

**Estado Actual (31 Ene 2026):**
1. ✅ Componente `EmptyState` creado (121 líneas, variantes de color)
2. ✅ Implementado en **6 pantallas**: SoftFortHome, ActividadPage, ReviewContainer, StudyDashboard, TemasListView
3. ✅ CTAs claros con iconos y animaciones Framer Motion

**Ubicación:** `/src/components/common/EmptyState/`

**Tiempo:** COMPLETADO
**Prioridad:** ✅ RESUELTO

---

### 🔴 CRÍTICO 4: Performance - N+1 Queries

**Problema:**
- Importar 263 preguntas = 263 HTTP calls secuenciales
- Queries sin índices (10x más lentos)
- Sin caché en hooks (refetch constante)

**Impacto:** App lenta, Supabase quota excedido, mala UX

**Solución:**
1. Bulk insert en `questionImportService.js`
2. Crear índices en BD (ver lista en Data Assessment)
3. Implementar caché de 5 minutos en hooks

**Tiempo:** 6-8 horas
**Prioridad:** P0 - URGENTE

---

### ✅ ALTO 1: Inconsistencia de Navegación - COMPLETADO

**Problema Original:**
- Confusión entre `activeTab` y `currentPage`
- Flujo "Reviewer" hijackea navegación normal
- No hay URLs (sin deep linking)

**Estado Actual (31 Ene 2026):**
1. ✅ React Router v6 implementado (HashRouter para GitHub Pages)
2. ✅ Rutas separadas: `/app/*`, `/admin/*`, `/onboarding/*`, `/auth/*`
3. ✅ URLs limpias con lazy loading
4. ✅ Route guards: RequireAuth, RequireOnboarding, RequireAdmin

**Archivos clave:**
- `/src/router/AppRouter.jsx`
- `/src/router/routes.jsx`
- `/src/router/guards/`

**Tiempo:** COMPLETADO
**Prioridad:** ✅ RESUELTO

---

### 🟠 ALTO 2: DraftFeatures.jsx en Producción (8,713 líneas)

**Problema:**
- Componente experimental gigante en bundle
- Aumenta bundle size 40%+
- Código duplicado con componentes reales

**Impacto:** Build lento, bundle grande, confusión

**Solución:**
1. Mover a `archived/DraftFeatures.jsx.bak`
2. Eliminar del bundle actual
3. Guardar en Git history si se necesita

**Tiempo:** 30 minutos
**Prioridad:** P1 - ALTA (Quick Win)

---

### ✅ ALTO 3: Design System Inconsistente - COMPLETADO

**Problema Original:**
- Colores de status diferentes por componente
- Border-radius sin jerarquía (rounded-xl, 2xl, 3xl mezclados)
- Spacing sin patrón (gap-3, gap-4, mb-2, mb-6...)

**Estado Actual (31 Ene 2026):**
1. ✅ Carpeta `/theme` creada con:
   - `colors.js` - Paleta completa (primary purple 50-900, status FSRS)
   - `spacing.js` - Espaciado consistente
   - `shadows.js` - Sombras predefinidas
   - `typography.js` - Tipografía
2. ✅ Status colors para FSRS: nuevo, learning, review, relearning, mastered
3. 🔄 Refactor de componentes usando tokens - EN PROGRESO

**Archivos:** `/src/theme/`

**Tiempo restante:** 4 horas (aplicar tokens consistentemente)
**Prioridad:** P2 - MEDIA

---

## QUICK WINS (Máximo Impacto, Mínimo Esfuerzo)

| Quick Win | Impacto | Tiempo | Estado |
|-----------|---------|--------|--------|
| 1. Eliminar DraftFeatures | Bundle -40% | 30 min | 🔄 Pendiente (sandbox útil) |
| 2. Habilitar RLS en BD | Seguridad crítica | 1 hora | ❌ Pendiente |
| 3. Corregir SQL injection | Seguridad | 30 min | ❌ Pendiente |
| 4. Crear índices BD | Performance 10x | 2 horas | ❌ Pendiente |
| 5. Empty States básicos | UX +30% | 4 horas | ✅ **COMPLETADO** |
| 6. Fix typo TopBar aria-label | A11y | 5 min | ❌ Pendiente |
| 7. Bulk import questions | 263s → 5s | 1 hora | ❌ Pendiente |
| 8. Caché en useActivityData | Queries -50% | 2 horas | ❌ Pendiente |
| 9. Paralelizar queries | UI 2x rápida | 1 hora | ❌ Pendiente |
| 10. Toast notifications | UX feedback | 3 horas | ❌ Pendiente |

**Progreso Quick Wins:** 1/10 completados
**Tiempo restante:** ~11 horas

---

## ROADMAP EN FASES

### 🚀 FASE 0: Críticos Pre-Deploy (1 semana)

**Objetivo:** App segura y deployable en producción

**Tareas:**
1. ❌ Habilitar RLS en `questions`, `badges`, `waitlist` (1h) - PENDIENTE
2. ❌ Corregir SQL injection spacedRepetitionService.js (30min) - PENDIENTE
3. ❌ Crear índices en BD (2h) - PENDIENTE
4. ❌ Bulk import questions (1h) - PENDIENTE
5. ❌ Rate limiting admin login (2h) - PENDIENTE
6. ✅ Empty States en 5 pantallas (4h) - **COMPLETADO**
7. 🔄 DraftFeatures (se mantiene como sandbox dev) - REEVALUADO
8. ❌ Testing básico de seguridad (3h) - PENDIENTE
9. ❌ **[NUEVO]** Importar temas faltantes en banco de preguntas (2h) - PENDIENTE
   - Archivos existentes: `l39-procedimiento.js`, `otras-leyes.js`, `ebep-empleados.js`
   - Solo 2/4 temas están importados actualmente

**Progreso:** 1/9 tareas completadas (11%)
**Tiempo restante:** ~12 horas

**Entregables pendientes:**
- BD segura con RLS
- Performance mejorado
- ✅ UX básica para usuarios nuevos

**Criterio de éxito:** Pasar security audit básico

---

### 🏗️ FASE 1: Refactor Arquitectónico (2-3 semanas) - 75% COMPLETADO

**Objetivo:** Código mantenible, testeable, escalable

**Tareas:**

**Semana 1:** ✅ COMPLETADA
1. ✅ Crear estructura `/pages`, `/layouts`, `/theme` (2h)
2. ✅ Crear `AppRouter.jsx` (4h)
3. ✅ Extraer HomePage de OpositaApp (6h)
4. ✅ Extraer StudyPage de OpositaApp (8h)
5. ✅ Crear MainLayout con TopBar + BottomTabBar (4h)

**Semana 2:** ✅ COMPLETADA
6. ✅ Extraer ActividadPage, RecursosPage, AdminPage (12h)
7. ✅ Crear Design System (`/theme`) (8h)
8. ✅ Mover componentes a estructura correcta (6h)
9. ✅ Actualizar imports (4h)

**Semana 3:** 🔄 EN PROGRESO
10. 🔄 Implementar Zustand para state management (12h) - STORES CREADOS, INTEGRACIÓN 40%
11. 🔄 Eliminar prop drilling (8h) - EN PROGRESO
12. ❌ Testing de navegación (6h) - PENDIENTE
13. ❌ Code review completo (4h) - PENDIENTE

**Progreso:** 9/13 tareas completadas (69%)
**Tiempo restante:** ~30 horas

**Logros actuales:**
- ✅ 19 páginas extraídas con lazy loading
- ✅ React Router v6 con guards
- ✅ Design System con tokens
- 🔄 Zustand stores creados (3), integración pendiente
- OpositaApp.jsx: 1,869 → 2,151 líneas (onboarding inline pendiente)

**Criterio de éxito:**
- 🔄 Cada página <400 líneas (mayoría cumple)
- 🔄 Estado global <10 hooks (stores creados)
- ❌ 80%+ componentes testeables (sin tests aún)

---

### 🎨 FASE 2: UI/UX Polish (1-2 semanas)

**Objetivo:** Experiencia de usuario profesional

**Tareas:**

**Semana 1:**
1. Implementar Toast notifications (3h)
2. Loading skeletons en 5 pantallas (4h)
3. Mejorar WelcomeScreen (1h)
4. Consistencia de micro-interactions (2h)
5. Fix responsive en mobile (6h)
6. Typography hierarchy (2h)

**Semana 2:**
7. Accessibility audit + fixes (4h)
8. Confirmación de acciones destructivas (2h)
9. Contextual help/tooltips (6h)
10. Pull-to-refresh en mobile (3h)
11. Testing UI completo (6h)
12. **[NUEVO]** Plan diario en Home con countdown a examen (3h)
    - Bloque "Tu plan de hoy" con objetivos
    - "Quedan X días para tu examen"
13. **[NUEVO]** Feedback post-test con temas débiles + CTAs (4h)
    - Mostrar top 3 temas con más errores
    - Botón "Repasar ahora" que navega a sesión de repaso
    - Datos ya existen en `insightDetector.js`

**Tiempo total:** 46 horas = **6 días** (+7h nuevas features)
**Entregables:**
- Score UI/UX: 6.1 → 8.5/10
- A11y compliant
- Mobile-friendly
- Feedback visual claro

**Criterio de éxito:**
- ✅ 0 bloqueadores UX
- ✅ WCAG AA compliance
- ✅ Mobile usable sin frustraciones

---

### ⚙️ FASE 3: Features MVP (2-3 semanas)

**Objetivo:** Features necesarias para launch

**Tareas:**

**Semana 1:**
1. Simulacros - Crear tablas BD (4h)
2. Simulacros - UI página simulacros (8h)
   - **NOTA:** Cambiar `status: 'proximamente'` → `'disponible'` en ActividadPage.jsx
3. Simulacros - Timer + scoring con penalización (6h)
4. Simulacros - Resultados detallados (4h)

**Semana 2:**
5. Sistema de reportes UI (modal) (4h)
6. Filtros avanzados en ReviewContainer (6h)
7. Export de progreso (PDF/CSV) (6h)
8. Notificaciones push (setup) (4h)

**Semana 3:**
9. Onboarding mejorado (tour guiado) (8h)
10. Sistema de badges visual (4h)
11. Dashboard de admin mejorado (6h)
12. Testing E2E completo (8h)

**Tiempo total:** 68 horas = **8 días**
**Entregables:**
- Simulacros funcionales
- Sistema de reportes
- Export de datos
- Admin dashboard completo

**Criterio de éxito:**
- ✅ Usuario puede hacer simulacro completo
- ✅ Usuario puede exportar su progreso
- ✅ Admin puede gestionar todo desde panel

---

### 🧪 FASE 4: Testing & QA (1-2 semanas)

**Objetivo:** App estable y sin bugs críticos

**Tareas:**

**Semana 1:**
1. Tests unitarios servicios (70% coverage) (12h)
2. Tests integración hooks (40% coverage) (8h)
3. Tests E2E flujos principales (6h)
4. Fix bugs encontrados (12h)

**Semana 2:**
5. Performance testing (Lighthouse) (4h)
6. Security audit externo (8h)
7. Load testing (100 usuarios concurrentes) (4h)
8. Bug bash interno (8h)
9. Fix bugs P0/P1 (12h)

**Tiempo total:** 74 horas = **9 días**
**Entregables:**
- 60%+ test coverage
- 0 bugs P0
- Performance score >90
- Security audit passed

**Criterio de éxito:**
- ✅ <5 bugs P1 conocidos
- ✅ Lighthouse score >90
- ✅ No security vulnerabilities

---

### 🚢 FASE 5: Pre-Launch (1 semana)

**Objetivo:** Preparación para producción

**Tareas:**
1. Migración de datos draft → producción (4h)
2. Setup analytics (Google Analytics / Mixpanel) (3h)
3. Error tracking (Sentry) (2h)
4. Documentación usuario final (6h)
5. Landing page (8h)
6. Beta testing con 10 usuarios (12h)
7. Incorporar feedback beta (8h)
8. Deploy a staging + smoke tests (4h)
9. Deploy a producción (2h)
10. Monitoreo post-launch (ongoing)

**Tiempo total:** 49 horas = **6 días**
**Entregables:**
- App en producción
- 10 usuarios beta han probado
- Analytics funcionando
- Error tracking activo

**Criterio de éxito:**
- ✅ 0 errores críticos en 48h post-launch
- ✅ 8/10 usuarios beta satisfechos
- ✅ <1% error rate

---

## CRONOGRAMA CONSOLIDADO (Actualizado 31 Ene 2026)

| Fase | Duración | Esfuerzo | Estado | Progreso |
|------|----------|----------|--------|----------|
| **Fase 0: Críticos** | 2 días | 14h | 🔄 En progreso | 12% |
| **Fase 1: Refactor** | 10 días | 84h | 🔄 En progreso | **75%** ✅ |
| **Fase 2: UI/UX** | 5 días | 39h | ❌ Pendiente | 0% |
| **Fase 3: Features** | 8 días | 68h | ❌ Pendiente | 0% |
| **Fase 4: Testing** | 9 días | 74h | ❌ Pendiente | 0% |
| **Fase 5: Launch** | 6 días | 49h | ❌ Pendiente | 0% |
| **TOTAL** | **40 días** | **328h** | **~50%** | **En camino** |

**Tiempo restante estimado:**
- Con 2 devs full-time: 4-6 semanas
- Con 1 dev full-time: 8-10 semanas

---

## CRITERIOS DE "MVP READY"

### Funcionalidades Core (MUST HAVE):

- [x] Autenticación (login/signup/forgot password)
- [x] Onboarding (WelcomeScreen → GoalStep → DateStep)
- [x] Sesión de estudio (HybridSession con FSRS)
- [x] Sistema de repaso espaciado (algoritmo FSRS funcional)
- [ ] Simulacros (examen completo cronometrado)
- [x] Dashboard de progreso (Fortaleza, streak, stats)
- [x] Página de actividad (historial de sesiones)
- [ ] Sistema de reportes (usuarios reportan preguntas)
- [ ] Exportar progreso (PDF/CSV)
- [x] Panel de admin (gestión de preguntas)

**Estado actual:** 6/10 (60%) - Sin cambios

### Criterios Técnicos:

- [ ] RLS habilitado en todas las tablas
- [ ] 0 vulnerabilidades críticas
- [ ] Performance score Lighthouse >85
- [x] Mobile responsive ← **NUEVO** (layouts responsivos)
- [ ] Test coverage >50%
- [ ] Error rate <1%
- [ ] Uptime >99.5%

**Estado actual:** 2/7 (28%) ⬆️ +14%

### Criterios de Negocio:

- [ ] 500+ preguntas en BD (actualmente ~200)
- [ ] Cobertura de 28 temas completa
- [ ] Beta testing con 10+ usuarios
- [ ] Feedback score >4/5
- [ ] Landing page live
- [ ] Términos de servicio + privacidad

**Estado actual:** 0/6 (0%) - Sin cambios

---

## DECISIONES PENDIENTES

### 1. TypeScript Migration

**Opciones:**
- A) Gradual (Phase 1: lib/, Phase 2: services/, Phase 3: components/)
- B) Todo de una vez (alto riesgo)
- C) No migrar (mantener JavaScript)

**Recomendación:** Opción A - Gradual, empezar en Fase 1
**Esfuerzo adicional:** +150 horas

---

### 2. State Management

**Opciones:**
- A) Zustand (ligero, simple)
- B) Redux Toolkit (robusto, verbose)
- C) Mantener contexts (actual)

**Recomendación:** Opción A - Zustand
**Razón:** Proyecto actual pequeño, Zustand suficiente

---

### 3. Testing Strategy

**Opciones:**
- A) Jest + RTL (unit + integration)
- B) Vitest + RTL (más rápido)
- C) Playwright (solo E2E)

**Recomendación:** Opción B - Vitest + RTL + Playwright para E2E
**Razón:** Vitest integra mejor con Vite

---

### 4. Deployment

**Opciones:**
- A) Vercel (fácil, automático)
- B) Netlify (similar a Vercel)
- C) GitHub Pages (actual, gratis pero limitado)
- D) AWS Amplify (más control)

**Recomendación:** Opción A - Vercel
**Razón:** CI/CD automático, preview deploys, edge functions

---

### 5. Monetización

**Opciones:**
- A) Freemium (100 preguntas gratis, resto premium)
- B) Todo gratis (monetizar con ads)
- C) Suscripción única (€9.99/mes)
- D) Pago único (€29.99 lifetime)

**Recomendación:** Opción A - Freemium
**Razón:** Baja barrera entrada, permite crecer base usuarios

---

## RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|-----------|
| Refactor rompe funcionalidad | Alta | Alto | Tests antes de refactor |
| Cambios BD pierden datos | Media | Crítico | Backups antes de migrar |
| Usuarios beta encuentran bugs | Alta | Medio | Bug bash interno primero |
| Supabase quota excedido | Media | Alto | Implementar caché agresivo |
| Bundle size muy grande | Baja | Medio | Code splitting + lazy load |
| Performance en móvil | Media | Alto | Testing en dispositivos reales |
| Seguridad comprometida | Baja | Crítico | Audit externo obligatorio |

---

## RECURSOS NECESARIOS

### Humanos:
- 2 devs full-stack (React + Supabase)
- 1 designer part-time (UI/UX polish)
- 1 QA tester (fase testing)
- 10 beta testers

### Infraestructura:
- Supabase Pro ($25/mes)
- Vercel Pro ($20/mes)
- Sentry ($29/mes)
- Analytics (gratis tier)

**Costo mensual:** ~$75/mes

### Herramientas:
- Figma (diseño)
- Linear/Jira (project management)
- Slack (comunicación)

---

## MÉTRICAS DE ÉXITO POST-LAUNCH

### Semana 1:
- 50+ usuarios registrados
- <1% error rate
- Uptime >99%
- 0 security incidents

### Mes 1:
- 200+ usuarios activos
- Retention >40% (día 7)
- NPS >40
- 1000+ sesiones completadas

### Mes 3:
- 500+ usuarios activos
- Retention >60% (día 30)
- NPS >50
- Premium conversion >5%

---

## PRÓXIMOS PASOS INMEDIATOS

### Esta Semana (Prioritario):

1. **Lunes:** Habilitar RLS en BD + crear índices (3h)
2. **Martes:** Corregir SQL injection + bulk import (2h)
3. **Miércoles:** Empty States en 5 pantallas (4h)
4. **Jueves:** Eliminar DraftFeatures + testing (1h)
5. **Viernes:** Rate limiting admin + review (2h)

**Total:** 12 horas = Fase 0 casi completa

---

### Próxima Semana (Fase 1 inicio):

1. Crear estructura `/pages`, `/layouts`, `/theme`
2. Iniciar extracción de OpositaApp
3. Setup Zustand
4. Primeras pruebas de routing

---

## CONCLUSIÓN

OpositaSmart ha avanzado significativamente desde el assessment inicial:

### ✅ Logros desde 24 Ene 2026:
1. **Arquitectura** - React Router v6 implementado, 19 páginas extraídas
2. **UX** - Empty States completados, Design System con tokens
3. **Code Splitting** - Lazy loading en todas las páginas
4. **Navegación** - Route guards, URLs limpias

### ❌ Pendiente Crítico:
1. **Seguridad** (RLS, SQL injection) - SIN CAMBIOS
2. **Testing** - 0% coverage
3. **Performance BD** - Índices, bulk import

**Progreso general:** 35% → **50%** (+15%)

**Tiempo restante estimado:** 6-8 semanas (1 dev) o 3-4 semanas (2 devs)

**Próximos pasos recomendados:**
1. Completar Fase 0 (seguridad) - URGENTE
2. Integrar Zustand stores en páginas
3. Extraer onboarding inline de OpositaApp.jsx

---

## CHANGELOG

### 31 Ene 2026 (Tarde) - Análisis ChatGPT
- 📋 Validación de recomendaciones ChatGPT "award-winning"
- ➕ Añadido a Fase 0: Importar temas faltantes de banco de preguntas
- ➕ Añadido a Fase 2: Plan diario en Home con countdown
- ➕ Añadido a Fase 2: Feedback post-test con temas débiles
- 📝 Nota en Fase 3: Cambiar status simulacro de 'proximamente' a 'disponible'

### 31 Ene 2026 (Mañana)
- ✅ React Router v6 con HashRouter
- ✅ 19 páginas creadas con lazy loading
- ✅ Route guards (RequireAuth, RequireOnboarding)
- ✅ Design System `/theme/` completo
- ✅ Empty States en 6 pantallas
- ✅ StatsFlipCard con AnimatedCounter
- 🔄 Zustand stores creados (integración pendiente)

### 24 Ene 2026
- Documento inicial creado
- Assessment de 4 áreas completado

---

**Documentos relacionados:**
- [UX Assessment Report](./UX_ASSESSMENT.md)
- [Architecture Assessment](./ARCHITECTURE_ASSESSMENT.md)
- [Data Assessment](./DATA_ASSESSMENT.md)
- [Folder Structure Proposal](./FOLDER_STRUCTURE_PROPOSAL.md)
- [Flowy Integration Plan](./FLOWY_INTEGRATION_PLAN.md)

**Última actualización:** 2026-01-31
**Próxima revisión:** Después de completar seguridad (Fase 0)
