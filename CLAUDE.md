# CLAUDE.md - Guía para Claude Code

## Descripción del Proyecto

**OpositaSmart** es una aplicación web de preparación para oposiciones españolas (actualmente enfocada en Auxiliar Administrativo del Estado - AGE).

### Filosofía Core
- **Bienestar primero**: Sin gamificación tóxica, sin presión artificial
- **A tu ritmo**: "Unos minutos al día, sin agobios"
- **Ciencia del aprendizaje**: Basado en repetición espaciada (FSRS)

## Tareas al Inicio de Sesión

### Content Radar — Detectar oportunidades de contenido
Al inicio de cada sesión, ejecutar el skill `content-radar` para identificar oportunidades de blog posts o publicaciones de Telegram. Verificar:
1. ¿Hay fechas de examen próximas (<60 días)? → Contenido urgente tipo "recta final"
2. ¿Hay novedades en el BOE (convocatorias, listas, resultados)? → Post de reacción
3. ¿Qué están buscando los opositores ahora? → Análisis SEO de gaps vs competidores
Presentar al usuario las 3 mejores oportunidades antes de empezar el trabajo técnico.

### Revisar BOE para actualizaciones del Radar
Al inicio de cada sesión de trabajo, consultar la tabla `boe_scraper_log` en Supabase para ver si hay convocatorias relevantes nuevas:

```sql
SELECT boe_id, departamento, titulo, plazas_detectadas, grupo_detectado, tipo_detectado, fecha_publicacion
FROM boe_scraper_log
WHERE es_relevante = true AND publicado = false
ORDER BY fecha_publicacion DESC
LIMIT 10;
```

Si hay items relevantes no publicados:
1. Informar al usuario: "El BOE ha publicado X convocatorias relevantes desde la última sesión"
2. Preguntar si quiere actualizar el Radar (`oposiciones_radar`) y/o los datos del grafo de organismos
3. NO publicar automáticamente — siempre confirmar con el usuario

El scraper corre automáticamente Lun-Vie a las 10:00 AM España (8:00 UTC) via pg_cron → Edge Function `boe-scraper`.

## Stack Tecnológico

- **Frontend**: React 19 + Vite 7
- **Estilos**: Tailwind CSS 4
- **Backend**: Supabase (auth + base de datos)
- **Iconos**: Lucide React
- **Deploy**: GitHub Pages (gh-pages)

## Estrategia de Modelos (Ahorro de Tokens)

**Modelo por defecto: Sonnet 4.5** — usar SIEMPRE a menos que la tarea lo requiera.

### Cuándo usar cada modelo (3 niveles)

| Nivel | Modelo | Cuándo usar | Ejemplos |
|-------|--------|-------------|----------|
| 1 | **Sonnet 4.5** (default) | 80% del trabajo diario | Edits, componentes, fix bugs, refactors, wiring, tests |
| 2 | **Opus 4.6 sin thinking** | Tareas complejas | Arquitectura multi-archivo, debugging difícil, swarm lead |
| 3 | **Opus 4.6 con thinking** | Ultimo recurso | Problemas donde Opus sin thinking falla, lógica muy compleja |

> **Haiku** para agentes de búsqueda/exploración y comandos git triviales (merge, deploy).

### Regla de escalado automático

Escalar progresivamente. Volver a Sonnet después de resolver.

```
Sonnet → falla 2x → Opus sin thinking → falla → Opus con thinking
```

### Para agentes (Task tool)

- Agentes de búsqueda/exploración: `model: "haiku"`
- Agentes de implementación: `model: "sonnet"`
- Team lead en swarm: `model: "sonnet"` (Opus solo si coordina >4 agentes)
- Agentes individuales complejos: `model: "sonnet"`, escalar si fallan

### Anti-patrones de consumo

- **NO** usar Opus para lint fixes, rename variables, o edits mecánicos
- **NO** usar swarm team para <3 tareas independientes (el overhead no vale)
- **NO** lanzar agentes de exploración cuando un Grep/Glob directo basta
- **NO** releer archivos completos que ya están en contexto
- **NO** lanzar múltiples agentes que lean el mismo archivo fuente (ej: ley). Organizar agentes por archivo/ley, no por tema
- **NO** usar Opus para tareas mecánicas (copiar citas, reformular). Sonnet para generación, Opus SOLO para verificación
- **Pipeline de preguntas**: Sonnet genera/enriquece → Opus verifica. Nunca al revés ni Opus para ambos

## Estructura del Proyecto

```
src/
├── OpositaApp.jsx          # Componente principal (2560 líneas - NECESITA REFACTOR)
├── main.jsx                # Entry point
├── index.css               # Estilos globales
├── components/
│   ├── admin/              # Panel de administración
│   │   ├── AdminPanel.jsx
│   │   ├── AdminLoginModal.jsx
│   │   ├── PreguntasTab.jsx
│   │   ├── TemasTab.jsx
│   │   └── QuestionImporter/Exporter.jsx
│   ├── auth/               # Autenticación
│   │   ├── LoginForm.jsx
│   │   ├── SignUpForm.jsx
│   │   └── ForgotPasswordForm.jsx
│   ├── study/              # Sesiones de estudio
│   │   ├── HybridSession.jsx    # Sesión híbrida (17K chars)
│   │   └── StudyDashboard.jsx
│   ├── review/             # Repaso de preguntas
│   │   ├── ReviewContainer.jsx
│   │   └── QuestionCardCompact.jsx
│   ├── FeedbackPanel.jsx
│   └── Fortaleza.jsx       # Sistema de progreso visual
├── contexts/
│   ├── AuthContext.jsx     # Estado de autenticación
│   └── AdminContext.jsx    # Estado de admin
├── hooks/
│   ├── useAuth.js
│   ├── useSpacedRepetition.js  # Algoritmo FSRS
│   ├── useUserInsights.js
│   └── useActivityData.js
├── lib/
│   ├── supabase.js         # Cliente Supabase
│   └── fsrs.js             # Implementación FSRS
└── data/
    └── questions/          # Banco de preguntas
```

## Comandos

```bash
npm run dev      # Servidor desarrollo (Vite)
npm run build    # Build producción
npm run preview  # Preview build local
npm run deploy   # Deploy a GitHub Pages
npm run lint     # ESLint
npm run screenshot  # Capturas de pantalla (Playwright)
npm run test:e2e    # Tests E2E completos
```

## Convenciones de Código

### Componentes
- Componentes funcionales con hooks
- Props destructuradas en parámetros
- Tailwind para estilos (inline classes)
- Lucide para iconos

### Naming
- Componentes: PascalCase (`StudyDashboard.jsx`)
- Hooks: camelCase con prefijo `use` (`useSpacedRepetition.js`)
- Archivos de datos: kebab-case (`ce-constitucion.js`)

### Estilo Visual
- Paleta principal: Purple (purple-50 a purple-700)
- Bordes redondeados grandes: `rounded-2xl`, `rounded-3xl`
- Sombras suaves: `shadow-lg shadow-purple-600/30`
- Transiciones: `transition-all`, `active:scale-[0.98]`

## Sistema de Diseño "Calma Editorial" (Abr 2026)

El app tiene un **rediseño editorial completo** basado en un handoff de Claude Design. Convive con el diseño anterior mediante un feature flag.

### Feature flag

```js
// Por defecto: editorial activo
// Para volver al legacy desde DevTools:
localStorage.setItem('home-design', 'legacy')
```

Cualquier otro valor (incluido ausencia de la key) = editorial on.

### Tokens y primitives

Todos en [src/components/editorial/EditorialPrimitives.jsx](src/components/editorial/EditorialPrimitives.jsx):

- **Colores**: paper `#F3F3F0`, ink `#1B4332`, inkSoft `#2D6A4F`, warm `#C67D5E`, gold `#C9A94F`, muted `#8A8783`
- **Fuentes**: Instrument Serif (titulares) + Inter (UI). Declaradas en [index.html](index.html) y [src/index.css](src/index.css) como `--font-serif` / `--font-sans`
- **Primitives**: `Masthead`, `Headline`, `Eyebrow`, `PullQuote`, `EditorialStat`, `EditorialButton`, `StudyModeRow`, `UnfurlBar`, `TabBar`, `Rule`
- **Hooks**: `useReveal(delay)` — fade-up con blur, `useCountUp(target, duration, delay)`, `useMediaQuery(query)`

### Estructura de los componentes editoriales

Cada pantalla editorial vive al lado del componente legacy con el prefijo `Editorial*`:

| Pantalla | Editorial | Legacy |
|----------|-----------|--------|
| Home | `src/components/home/EditorialHome.jsx` | `SoftFortHome.jsx` |
| Session | `src/components/study/EditorialSessionHeader.jsx` + `EditorialQuestionCard.jsx` | `SessionHeader.jsx` + `QuestionCard.jsx` |
| Results | `src/components/study/EditorialSessionComplete.jsx` | `SessionComplete.jsx` |
| Temas | `src/components/temas/EditorialTemasList.jsx` | `TemasListView.jsx` (interno) |
| Actividad | `src/components/activity/EditorialActividad.jsx` | `ActividadPage.jsx` |
| Recursos | `src/components/recursos/EditorialRecursos.jsx` | `RecursosPage.jsx` |
| Onboarding | `src/components/onboarding/Editorial{Oposicion,Tiempo,Fecha}Step.jsx` + `EditorialOnboardingShell.jsx` | `GoalStep`, `TiempoStep`, `DateStep` |

### Mobile vs Desktop

Cada componente editorial usa `useMediaQuery('(min-width: 1024px)')` y renderiza una variante u otra. Son **fieles al diseño original** — no es un CSS responsive con breakpoints, son dos componentes distintos (`HomeMobile` / `HomeDesktop`) porque los layouts son muy diferentes.

### Layout chrome

- [MainLayout.jsx](src/layouts/MainLayout/MainLayout.jsx) tiene fondo paper (`#F3F3F0`) que **se extiende por todo el viewport**, incluidos sidebar desktop y bottom tab bar mobile — nada de white breaks
- `editorialPaths` en MainLayout: `[HOME, TEMAS, ACTIVIDAD, RECURSOS]`. En esas rutas el Outlet se renderiza **sin padding** (el componente editorial maneja su propio padding)
- `BottomTabBar`: paper bg + tabs activas en `#1B4332` con uppercase letter-spacing
- `DesktopSidebar`: paper bg + item activo con borde izquierdo 2px ink (match del diseño)

### Patrones al añadir nuevas pantallas editoriales

1. **Crear** `EditorialXxx.jsx` en el mismo folder que el legacy
2. **Wire con feature flag** en el wrapper/page:
   ```jsx
   const useEditorial =
     typeof window !== 'undefined' && localStorage.getItem('home-design') !== 'legacy';
   return useEditorial ? <EditorialXxx {...props} /> : <LegacyXxx {...props} />;
   ```
3. **El flag va DESPUÉS de todos los hooks** (regla de React). Si el wrapper tiene `useState`/`useMemo`, poner el check antes del `return` principal
4. **Si la ruta es nueva** → añadirla a `editorialPaths` en MainLayout para que skip padding
5. **Si la ruta usa `GuestLock` u otros wrappers condicionales** → render editorial ANTES de esos wrappers (learned the hard way: el editorial queda opaco/recortado si lo envuelves)
6. **Si hay toggles de vista legacy** (como list/roadmap/dendrite en Temas) → skip el wrapper entero cuando editorial

### Qué NO está en editorial todavía

- **Fortaleza standalone** — la info vive en el right rail del Home desktop; no existe ruta dedicada
- **Radar BOE del app** — existe como feature completa en el landing (`/organismos`); portarla al app es scope de feature nueva, no de rediseño
- **Admin/Reviewer panels** — siguen con diseño legacy (purple migrado a green pero sin editorial)
- **Dev Panel & Draft Features** — intencionalmente no editorial

### Qué aprendí en esta migración (lessons learned)

1. **Leer el diseño completo antes de implementar**. Primera vez solo leí el mobile del Home y me perdí el desktop entero. Siempre `wc -l` y leer top-to-bottom
2. **Una sola decisión de split mobile/desktop por componente**. El `useMediaQuery` al nivel del componente padre y el dispatcher renderiza una de las dos variantes. No hacer CSS media-query-hell
3. **El flag "legacy" permite iteración segura** — prueba el editorial, y si algo se rompe, `localStorage.setItem('home-design', 'legacy')` en DevTools como escape hatch
4. **Wrappers existentes son el enemigo silencioso** — GuestLock, max-w-4xl containers, view toggles. Verifica siempre que el editorial renderiza full-bleed sin contaminación del wrapper legacy
5. **Inline styles son razonables aquí** — el diseño tiene muchos valores one-off (font sizes, letter-spacing negativos, padding específicos). Los tokens CSS de Tailwind añaden indirección innecesaria. Para este design system, `style={{...}}` con tokens `OS.*` es más legible

---

## Deuda Técnica Conocida

1. **OpositaApp.jsx** (2560 líneas): Contiene demasiada lógica
   - Onboarding completo debería extraerse
   - Estados de navegación mezclados con UI
   - Múltiples componentes inline

2. **HybridSession.jsx** (17K chars): Componente muy grande

3. Sin TypeScript (actualmente JavaScript puro)

4. Sin tests automatizados

## Variables de Entorno

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Contexto del Negocio

- **Oposición target**: Auxiliar Administrativo AGE
- **Usuarios**: Opositores españoles
- **Modelo**: Freemium (no implementado aún)
- **Estado actual**: ~34% completado, pre-beta

## Sistema de Gobernanza (.claude/)

El proyecto incluye un sistema de agentes y flujo de trabajo en `.claude/`:

```
.claude/
├── PROJECT_STATUS.md      # Estado actual (leer al inicio de sesión)
├── WORKFLOW.md            # Guía de decisiones
├── MAINTENANCE.md         # Tareas periódicas de mantenimiento
├── QUESTION_TRACKER.md    # Estado del banco de preguntas por tema
├── agents/                # Agentes especializados
├── questions/             # Pipeline de preguntas
├── references/            # Documentos de apoyo (PDFs)
└── oposiciones/
    └── MASTER_OPOSICIONES.md  # ★ Temarios y tracking por oposición
```

### Pipeline de Preguntas — Proceso CERO ERRORES

**REGLA DE ORO:** Si no puedes verificar la respuesta contra el texto literal del BOE, la pregunta NO se publica. Sin excepciones.

**Estándares de calidad:** Usar el skill `question-crafting` al generar o reformular preguntas. Contiene los 5 principios, ejemplos canónicos Tier S verificados por opositores reales, y checklist pre-publicación.

**3 pasos obligatorios:**

```
PASO 1 — FETCH: Obtener texto literal del artículo desde BOE
  → web_fetch https://www.boe.es/buscar/act.php?id=BOE-A-XXXX-XXXX
  → Si no puedes obtener el texto → BLOQUEADA
  
PASO 2 — GENERATE: Crear pregunta DESDE el texto verificado
  → La respuesta correcta DEBE aparecer literalmente en el texto
  → No inferir. No interpretar. Si no lo dice explícitamente → no generar
  
PASO 3 — VERIFY: Segunda pasada como revisor hostil
  □ ¿El artículo citado EXISTE?
  □ ¿La respuesta correcta coincide LITERALMENTE con el texto?
  □ ¿Las opciones incorrectas son REALMENTE incorrectas?
  □ ¿Terminología exacta? ("en su caso" ≠ "en todo caso")
  □ Si dice "señale la incorrecta" → ¿la marcada es la incorrecta?
```

**IDs BOE de leyes principales:**
- CE: BOE-A-1978-31229
- Ley 39/2015 LPAC: BOE-A-2015-10565
- Ley 40/2015 LRJSP: BOE-A-2015-10566
- Ley 50/1997 Gobierno: BOE-A-1997-25336
- LOTC (LO 2/1979): BOE-A-1979-23709
- TREBEP (RDLeg 5/2015): BOE-A-2015-11719
- LRBRL (Ley 7/1985): BOE-A-1985-5392
- Ley 3/2015 Alto Cargo: BOE-A-2015-3444

**Campos de auditoría en Supabase:**
- `source_text`: texto literal del artículo del BOE
- `verification_notes`: notas de la verificación
- `verified_at`: timestamp de verificación

**Batches:** Máximo 10 preguntas por batch de validación, 5 por batch de creación.

### Comandos Útiles

| Comando | Acción |
|---------|--------|
| `"status"` | Estado del proyecto |
| `"crear preguntas tema X"` | Crear preguntas |
| `"publicar aprobadas"` | Subir a Supabase |
| `"revisar referencias"` | Escanear nuevos docs |
| `"auditar preguntas"` | Revisar calidad en BD |
| `"revisar arquitectura"` | Análisis de código |

---

## Acceso a Servicios

**Claude tiene acceso directo a:**

### Supabase
- **Proyecto:** Oposita Smart (`yutfgmiyndmhsjhzxkdr`)
- **Capacidades:**
  - Ejecutar migraciones SQL directamente
  - Consultar y modificar base de datos
  - Gestionar tablas, políticas RLS, funciones
  - Verificar índices y performance
- **Uso:** Claude puede ejecutar migraciones SQL sin intervención manual del usuario

### Vercel
- **Token de acceso:** Configurado
- **Capacidades:**
  - Deploy de builds
  - Gestionar deployments
  - Ver logs y analytics
- **Uso:** Claude puede hacer deploys cuando sea necesario

**Importante:** No es necesario pedirle al usuario que ejecute migraciones SQL o deploys manualmente - Claude puede hacerlo directamente.

---

## Visual Companion para Brainstorming

Cuando se trabaja en diseño de features complejas o decisiones arquitectónicas, usar el **visual companion** del sistema Superpowers para mostrar opciones, diagramas y mockups en el browser.

### Setup

```bash
# Iniciar servidor (Windows — siempre run_in_background: true)
bash /c/Users/alber/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.5/skills/brainstorming/scripts/start-server.sh --project-dir /c/Users/alber/OpositaSmart
# Leer URL desde: .superpowers/brainstorm/<session>/.server-info
```

### Flujo

1. Iniciar servidor con `run_in_background: true`
2. Leer `.server-info` para obtener la URL (ej: http://localhost:54271)
3. Decirle al usuario que abra esa URL
4. Escribir archivos HTML en el `screen_dir` con el Write tool (nunca heredoc/cat)
5. Usar fragmentos HTML — el servidor añade el CSS/JS automáticamente
6. Leer `.events` para ver las selecciones del usuario
7. Push `waiting.html` cuando se vuelve al terminal

### Cuándo usarlo

- **Sí**: opciones de diseño, diagramas de flujo, mockups de UI, comparativas visuales
- **No**: preguntas conceptuales, decisiones de API, preguntas de texto simple

### Nota de diseño

- `.superpowers/` ya está en `.gitignore`
- Archivos guardados en `.superpowers/brainstorm/<session>/` como referencia histórica
- El servidor auto-para tras 30 min de inactividad; reiniciar con el mismo comando

---

## Verificación Visual con Playwright

Claude puede tomar capturas de pantalla de la app para verificar cambios de UI sin depender del usuario.

### Setup

- **Config:** `playwright.config.js` (mobile 390x844 + desktop 1280x720)
- **Script:** `e2e/take-screenshots.js` (standalone, rápido)
- **Tests:** `e2e/screenshots.spec.js` (Playwright Test formal)
- **Capturas:** `e2e/screenshots/` (gitignored)

### Flujo de Verificación Visual

**Después de cambios de UI, seguir este flujo:**

1. Asegurarse de que el dev server está corriendo (`npm run dev`)
2. Ejecutar `npm run screenshot` (o `node e2e/take-screenshots.js`)
3. Leer las capturas con el Read tool para verificar visualmente
4. Si algo no se ve bien, corregir y repetir

### Cuándo usarlo

- **Siempre** después de cambios de estilos, layout o componentes visuales
- Después de refactors que afectan la UI
- Para verificar que un bugfix visual realmente arregló el problema
- Antes de marcar tareas de UI como completadas

### Notas técnicas

- El base URL en desarrollo es `http://localhost:5173/Oposiciones-App/` (por el `base` de Vite para GitHub Pages)
- En Vercel el base es `/` (controlado por `process.env.VERCEL`)
- El script captura mobile y desktop automáticamente
- Requiere `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para que la app renderice
- Las dependencias de sistema de Chromium deben estar instaladas (`npx playwright install-deps chromium`)

---

## Lecciones Aprendidas - Refactoring

### Incidente: Componentes Inline Perdidos (Enero 2026)

**Problema:** Durante un refactor para extraer componentes a archivos separados, se eliminaron componentes inline (`OnboardingOposicion`, `OnboardingTiempo`, `OnboardingFecha`, `OnboardingIntro`) del archivo principal sin crear los archivos correspondientes.

**Síntoma:** `ReferenceError: OnboardingOposicion is not defined`

**Causa raíz:**
1. Extraer componentes del archivo principal
2. NO crear los archivos nuevos con esos componentes
3. El archivo principal sigue referenciando componentes que ya no existen

### Reglas de Refactoring Seguro

1. **NUNCA eliminar código sin verificar destino**
   - Antes de borrar un componente inline, confirmar que existe el archivo destino
   - Usar `git diff` para revisar qué se está eliminando

2. **Refactor en pasos atómicos**
   - Paso 1: CREAR archivo nuevo con el componente
   - Paso 2: AGREGAR import al archivo principal
   - Paso 3: VERIFICAR build
   - Paso 4: Solo entonces, ELIMINAR código inline duplicado

3. **Build después de cada cambio**
   - No acumular cambios sin verificar
   - Un build roto = revertir inmediatamente

4. **Verificación visual obligatoria**
   - Sin acceso al navegador, Claude NO puede garantizar que los cambios visuales estén correctos
   - Siempre pedir al usuario que verifique después de cambios de UI

### Checklist Pre-Refactor

```
[ ] ¿Existe el archivo destino para cada componente a extraer?
[ ] ¿Los imports están actualizados?
[ ] ¿El build pasa?
[ ] ¿El usuario verificó visualmente?
```

### Estrategia de Migración Gradual

Para evitar estos problemas, la migración de OpositaApp.jsx debe ser:
- **Incremental**: Un componente a la vez
- **Verificable**: Testing visual después de cada paso
- **Reversible**: Commits pequeños, fácil rollback

---

### Incidente: Feature UI sin Lógica de Datos (Enero 2026)

**Problema:** Al implementar DevModeRandomizer en múltiples páginas, se añadió el componente UI (botón flotante) pero NO se implementó la transformación de datos en todas las páginas.

**Síntoma:** El botón aparece y se puede seleccionar un modo, pero los datos mostrados no cambian.

**Causa raíz:**
1. Añadir componente UI a la página ✅
2. Añadir estado `simulationMode` ✅
3. **OLVIDAR** implementar la lógica que transforma los datos usando ese estado ❌
4. Marcar la tarea como "completada" sin verificar funcionalmente ❌

**Páginas afectadas:**
- ✅ SoftFortHome - Implementado correctamente (usa `effectiveStats`, `effectiveStreak`)
- ✅ ActividadPage - Implementado correctamente (usa `simulatedData`)
- ❌ TemasListView - Solo UI, sin transformación de datos de topics
- ❌ RecursosPage - Solo UI, sin transformación de favoritos

### Regla: "UI + Estado + Transformación = Feature Completa"

**Checklist para features con datos simulados/mock:**
```
[ ] ¿El componente UI se renderiza? (botón, dropdown, etc.)
[ ] ¿El estado se actualiza al interactuar? (useState funciona)
[ ] ¿Los datos mostrados CAMBIAN cuando el estado cambia? ← CRÍTICO
[ ] ¿Se probó visualmente cada modo/estado?
```

**Anti-patrón a evitar:**
```jsx
// ❌ MAL: Estado existe pero no se usa
const [simulationMode, setSimulationMode] = useState(null);
// ... render usa props originales, ignora simulationMode

// ✅ BIEN: Estado transforma los datos
const [simulationMode, setSimulationMode] = useState(null);
const effectiveData = simulationMode ? getSimulatedData(simulationMode) : realData;
// ... render usa effectiveData
```

---

### Incidente: Lazy Loading sin ErrorBoundary (Enero 2026)

**Problema:** Al implementar ForceGraph con React.lazy(), el componente fallaba silenciosamente sin mostrar ningún error al usuario.

**Síntoma:** El tab "Roadmap" mostraba solo "Cargando..." indefinidamente o un espacio vacío, sin indicación de error.

**Causa raíz:**
1. `React.lazy()` carga el componente dinámicamente
2. `<Suspense>` solo maneja el estado de "cargando", NO los errores
3. Si el módulo falla al cargar o el componente lanza error, NO hay feedback
4. El error se "traga" silenciosamente

**Diagnóstico dificultado por:**
- Build local pasa correctamente
- No hay errores en consola visibles sin DevTools
- El usuario solo ve "no funciona" sin detalles

### Regla: "Lazy Loading SIEMPRE con ErrorBoundary"

**Patrón obligatorio para componentes lazy:**
```jsx
// ❌ MAL: Solo Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

// ✅ BIEN: ErrorBoundary + Suspense
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

**ErrorBoundary mínimo:**
```jsx
// src/components/common/ErrorBoundary.jsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">{this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
```

**Checklist para componentes lazy:**
```
[ ] ¿Tiene ErrorBoundary envolviendo el Suspense?
[ ] ¿El ErrorBoundary muestra el mensaje de error?
[ ] ¿La dependencia está en package.json?
[ ] ¿Se verificó en Vercel (no solo build local)?
```

**Lección clave:** El build puede pasar localmente pero fallar en producción si:
- Falta una dependencia en package.json
- La dependencia no se instala correctamente en Vercel
- El componente tiene errores de runtime que solo aparecen al ejecutar

---

### Incidente: Dependencia con Sub-dependencias No Deseadas (Enero 2026)

**Problema:** Al usar `react-force-graph` para visualización de grafos, el componente fallaba en producción con el error "AFRAME is not defined".

**Síntoma:**
- Build local pasa ✅
- Build en Vercel pasa ✅
- Runtime en producción falla ❌ con `ReferenceError: AFRAME is not defined`

**Causa raíz:**
El paquete `react-force-graph` incluye soporte para:
- `ForceGraph2D` (2D canvas)
- `ForceGraph3D` (3D con three.js)
- `ForceGraphVR` (VR con A-Frame) ← Requiere AFRAME
- `ForceGraphAR` (AR)

Aunque solo importamos `ForceGraph2D`, el bundler incluye código que referencia AFRAME, causando el error en runtime.

**Solución:**
Usar el paquete específico `react-force-graph-2d` en lugar del paquete completo:

```json
// ❌ MAL: Incluye dependencias VR/AR innecesarias (1,767 KB)
"react-force-graph": "^1.48.1"

// ✅ BIEN: Solo 2D, sin AFRAME (197 KB)
"react-force-graph-2d": "^1.28.0"
```

```jsx
// ❌ MAL: Import del paquete completo
import { ForceGraph2D } from 'react-force-graph';

// ✅ BIEN: Import del paquete específico
import ForceGraph2D from 'react-force-graph-2d';
```

### Regla: "Verificar Sub-dependencias de Paquetes Grandes"

**Antes de usar una librería de visualización/gráficos:**
```
[ ] ¿El paquete tiene variantes más específicas? (ej: -2d, -lite, -core)
[ ] ¿Qué sub-dependencias trae? (revisar package.json del paquete)
[ ] ¿Hay dependencias opcionales que pueden causar errores?
[ ] ¿El tamaño del bundle es razonable para lo que necesito?
```

**Paquetes comunes con este patrón:**
- `react-force-graph` → usar `react-force-graph-2d` o `react-force-graph-3d`
- `three` → usar imports específicos de submódulos
- `d3` → usar `d3-force`, `d3-selection`, etc. por separado
- `lodash` → usar `lodash-es` o imports específicos

**Lección clave:** Un paquete puede compilar correctamente pero fallar en runtime si tiene dependencias opcionales que no están instaladas. Preferir siempre el paquete más específico para el caso de uso.

---

### Incidente: Nombres de Campos DB vs Código (Febrero 2026)

**Problema:** Los componentes de estudio (FlashcardSession, SimulacroSession) no mostraban datos porque usaban nombres de campos incorrectos.

**Síntoma:**
- Flashcards mostraban tarjetas vacías
- Simulacro mostraba preguntas sin texto
- "No hay preguntas disponibles" cuando sí había datos

**Causa raíz:**
El código usaba nombres de campos en español (de datos locales legacy) pero la base de datos usa nombres en inglés:

| Código (incorrecto) | Base de Datos (correcto) |
|---------------------|--------------------------|
| `q.pregunta` | `q.question_text` |
| `q.opciones` | `q.option_a`, `q.option_b`, `q.option_c`, `q.option_d` |
| `q.explicacion` | `q.explanation` |
| `a.dificultad` | `a.difficulty` |

**Archivos afectados:**
- `src/components/study/FlashcardSession.jsx` - líneas 62-74
- `src/components/study/SimulacroSession.jsx` - líneas 509, 517
- `src/services/spacedRepetitionService.js` - líneas 253-258

### Regla: "Verificar Esquema de DB Antes de Crear Componentes"

**Checklist para componentes que consumen datos de Supabase:**
```
[ ] ¿Revisé el esquema de la tabla en las migraciones SQL?
[ ] ¿Los nombres de campos coinciden exactamente con la DB?
[ ] ¿Consulté QuestionCard.jsx u otro componente que YA funciona para ver los nombres correctos?
[ ] ¿Probé con console.log(data) para ver la estructura real?
```

**Referencia de campos de `questions` table:**
```javascript
// Campos correctos de la base de datos:
{
  id: "uuid",
  question_text: "¿Cuál es...?",      // NO: pregunta
  option_a: "Primera opción",          // NO: opciones.a
  option_b: "Segunda opción",
  option_c: "Tercera opción",
  option_d: "Cuarta opción",
  correct_answer: "b",                 // Letra de la opción correcta
  explanation: "Porque...",            // NO: explicacion
  tema: 1,                             // Número de tema
  difficulty: 3,                       // NO: dificultad (1-5)
  is_active: true
}
```

**Anti-patrón a evitar:**
```jsx
// ❌ MAL: Nombres de campos legacy/español
const flashcards = questions.map(q => ({
  front: q.pregunta,
  back: q.opciones?.[q.correct_answer]
}));

// ✅ BIEN: Nombres de campos reales de la DB
const flashcards = questions.map(q => ({
  front: q.question_text,
  back: q[`option_${q.correct_answer}`]
}));
```

**Lección clave:** Siempre verificar el componente `QuestionCard.jsx` como referencia canónica de los nombres de campos correctos, ya que es el que funciona con HybridSession.

---

### Incidente: Config Props Mismatch (Febrero 2026)

**Problema:** Componentes de sesión recibían config pero usaban nombres de propiedades diferentes.

**Síntoma:** Sesiones cargaban número incorrecto de preguntas (defaults en vez de config).

**Causa raíz:**
- OpositaApp enviaba: `{ totalQuestions: 10, ... }`
- Componentes buscaban: `config.questionCount`
- Resultado: siempre usaba el default (20 o 100)

### Regla: "Consistencia en Nombres de Props de Config"

**Props estándar para sesiones de estudio:**
```javascript
// Config que envía OpositaApp:
{
  mode: 'flashcards',           // Tipo de sesión
  totalQuestions: 10,           // NO: questionCount
  reviewRatio: 0.25,            // Ratio de preguntas de repaso
  tema: 1,                      // Número de tema (para filtrar)
  temaId: 'uuid',               // ID del tema (legacy, evitar)
  failedOnly: false             // Solo preguntas falladas
}

// Los componentes DEBEN usar estos mismos nombres:
const count = config.totalQuestions || 20;  // NO: config.questionCount
```

---

### Incidente: Login No Redirige al Inicio (Febrero 2026)

**Problema:** Después de login exitoso, el usuario se quedaba en la página de bienvenida en vez de ir al inicio.

**Síntoma:** Login completa sin errores pero el usuario vuelve a `/welcome` en loop.

**Causa raíz:**
1. `RequireOnboarding` guard verifica `onboardingComplete` del zustand store (`user-storage` en localStorage)
2. Usuarios que completaron onboarding en la versión vieja (OpositaApp) NO tienen este flag en el nuevo store
3. El guard redirige a `/welcome`, y WelcomePage no redirige al inicio porque `onboardingComplete` es `false`
4. Resultado: loop infinito login → /app → /welcome → login

**Solución:**
Los usuarios autenticados (con cuenta Supabase) ya completaron onboarding por definición. El guard debe saltarse la verificación para ellos:

```jsx
// ✅ BIEN: Usuarios autenticados saltan onboarding
if (user) {
  return children;
}
// Solo usuarios anónimos necesitan onboarding
if (!onboardingComplete) {
  return <Navigate to={ROUTES.WELCOME} />;
}
```

### Regla: "Migración de Estado entre Arquitecturas"

**Al migrar de una arquitectura a otra (ej: OpositaApp → AppRouter):**
```
[ ] ¿Los stores de zustand/localStorage tienen las mismas keys?
[ ] ¿Los usuarios existentes tienen los flags necesarios en el nuevo store?
[ ] ¿Los guards de ruta manejan usuarios que migraron sin datos locales?
[ ] ¿Se probó el flujo con un usuario existente (no solo nuevo)?
```

**Anti-patrón a evitar:**
```jsx
// ❌ MAL: Bloquear acceso basándose solo en estado local
if (!onboardingComplete) redirect('/welcome');

// ✅ BIEN: Considerar fuentes de verdad múltiples
if (user) return children; // Auth = ya onboarded
if (!onboardingComplete) redirect('/welcome');
```

**Lección clave:** Al migrar arquitectura, los usuarios existentes pueden no tener el estado local que el nuevo código espera. Siempre usar la fuente de verdad más fiable (autenticación > localStorage).

---

### Incidente: Contradicciones Entre Preguntas del Mismo Artículo (Febrero 2026)

**Problema:** Dos preguntas sobre el mismo artículo legal (Art. 8.1 Ley 50/1997) tenían respuestas que se contradecían mutuamente.

**Síntoma:** ID 765 dice que "Ministro de la Presidencia" es FALSO; ID 1007 dice que es VERDADERO. Ambas sobre la presidencia de la Comisión General de Secretarios de Estado y Subsecretarios.

**Causa raíz:**
1. Las preguntas se crearon independientemente sin cruzar con preguntas existentes sobre el mismo artículo
2. Una versión de la ley dice "Ministro de la Presidencia" y otra (tras reforma) dice "Ministro que determine el Presidente del Gobierno"
3. No había verificación cruzada entre preguntas

### Regla: "Verificar Coherencia Inter-Preguntas"

**Antes de crear/aprobar una pregunta sobre un artículo legal:**
```
[ ] ¿Hay otras preguntas en el banco sobre el mismo artículo?
[ ] ¿Las respuestas son coherentes entre sí?
[ ] ¿Se está usando la versión vigente de la ley?
```

**Query útil:**
```sql
SELECT id, question_text, legal_reference
FROM questions
WHERE legal_reference ILIKE '%art. 8%' AND legal_reference ILIKE '%50/1997%';
```

---

### Incidente: Asignación Masiva de Temas Incorrectos (Febrero 2026)

**Problema:** En el piloto de calidad, 12 de 15 preguntas del batch 5 tenían el tema mal asignado.

**Síntoma:** Preguntas sobre Tribunal Constitucional (Tema 4) aparecían en Tema 9 (LPAC). Preguntas de LBRL aparecían en Tema 11 (LRJSP).

**Causa raíz:**
1. Al importar preguntas masivamente, el tema se asignó por lote/archivo, no por contenido
2. No había validación automática tema-vs-contenido

### Regla: "Validar Tema vs Contenido Legal"

**Mapeo obligatorio Tema → Leyes:**
- Tema 1-2: CE (Preliminar, Título I)
- Tema 3: CE (Corona, Cortes)
- Tema 4: CE (Gobierno, Poder Judicial, TC)
- Tema 5-6: Ley 50/1997, Ley 40/2015 Título II
- Tema 7-8: Ley 40/2015 LRJSP
- Tema 9: Ley 39/2015 LPAC
- Tema 10: TREBEP/EBEP
- Tema 11: Ley 40/2015 (sector público institucional)

**Si `legal_reference` cita una ley que no corresponde al tema asignado → flag.**

---

### Incidente: Respuestas Desactualizadas por Reformas Legales (Febrero 2026)

**Problema:** La pregunta ID 488 sobre cuántas veces se ha reformado la CE tenía respuesta "2", pero la reforma del Art. 49 en 2024 hace que la respuesta correcta sea "3".

**Regla:** Al verificar preguntas, considerar reformas legales recientes:
- Art. 49 CE reformado en 2024 (discapacidad)
- Art. 135 CE reformado en 2011 (estabilidad presupuestaria)
- Art. 13.2 CE reformado en 1992 (Maastricht)

---

### Lección: Pipeline de Calidad de Preguntas (Febrero 2026)

**Piloto de 55 preguntas** reveló distribución real: S:22%, A:35%, B:33%, C:11%.

**Hallazgos sistémicos:**
1. `legal_reference` con texto explicativo en vez de cita limpia (~30%)
2. Enunciados cortos sin contexto (<80 chars, ~25%)
3. Abreviaturas sin expandir (~20%)
4. Temas mal asignados (~15-20%)
5. Contradicciones entre preguntas sobre mismo artículo (detectado 1 par)
6. Respuestas incorrectas por reformas legales (~2-3%)

**Pipeline diseñado (3 agentes):**
1. Reformulador: limpia legal_reference, expande abreviaturas, enriquece enunciados
2. Verificador Lógico: verifica lógica pregunta-respuesta, confianza <0.90 → flag
3. Cazador de Discrepancias: contradicciones inter-preguntas, temas incorrectos, reformas

**Referencia completa:** `.claude/questions/QUALITY_STANDARDS.md`

---

### Incidente: Sesión de Estudio No Registra Respuestas (Febrero 2026)

**Problema:** Todas las respuestas se contaban como incorrectas (0 correctas siempre).

**Síntomas:**
- Al completar 20 preguntas, los stats mostraban 0 correctas
- Algunas preguntas no mostraban opciones
- La página de estudio a veces mostraba error "motion is not defined"

**Causas raíz (múltiples bugs simultáneos):**

1. **`motion` no importado** en 6 componentes: `DevModeRandomizer`, `Toast`, `FlipCard`, `StatsFlipCard`, `ActividadPage`, `TopBar` — importaban `AnimatePresence` pero no `motion` de framer-motion. `EmptyState` usaba `motion.div` sin tenerlo. Causaba crash del ErrorBoundary.

2. **Opciones sin `id`**: 107/1000 preguntas tienen `options: [{text, is_correct}]` sin campo `id`. QuestionCard verificaba `rawOpts[0]?.id` y al ser undefined, no renderizaba opciones.

3. **`answerQuestion` bloqueado por DB**: `setSessionStats` y `setCurrentIndex` estaban DESPUÉS de `await updateProgress()` dentro del `try`. Como `updateProgress` fallaba (schema mismatch), los stats nunca se actualizaban.

4. **Schema mismatch**: Código usaba `ease_factor` e `interval`, pero la DB tiene `difficulty` y `scheduled_days`. Además `user_question_progress.question_id` es UUID pero `questions.id` es INTEGER.

5. **Service Worker cache-first para JS**: Bundles viejos se servían desde cache en vez de red.

6. **Tabla inexistente**: `useActivityData` consultaba `quiz_sessions` (no existe) en vez de `test_sessions`.

### Reglas Aprendidas:

1. **"Nunca bloquear la UI por escrituras a DB"**: Actualizar estado local PRIMERO, luego fire-and-forget al DB.
2. **"Al parsear opciones JSONB, no verificar `[0]?.id`"**: Solo verificar `Array.isArray()`. Generar `id` desde índice si falta.
3. **"Buscar TODOS los componentes con el mismo patrón"**: Si un componente tiene un import roto, buscar el mismo pattern en todo el codebase.
4. **"Verificar con Playwright después de cambios funcionales"**: Los bugs de lógica (no solo UI) se detectan con tests E2E automatizados.

---

### Incidente: Sesión Completada No Actualiza Inicio (Febrero 2026)

**Problema:** Después de completar una sesión de estudio, los stats del home page (precisión, etc.) no cambiaban.

**Síntoma:** Usuario completa sesión → vuelve a inicio → mismos números que antes.

**Causa raíz:**
- `completeSession()` escribía a `study_history` (tabla de actividad diaria)
- El home page lee de `test_sessions` (tabla de sesiones individuales)
- **Nadie escribía a `test_sessions`** → datos siempre stale

**Fix:**
1. Crear `recordTestSession()` en `spacedRepetitionService.js` que inserta en `test_sessions`
2. Actualizar `completeSession()` para llamar AMBAS: `recordTestSession` + `recordDailyStudy`
3. Agregar `sessionStartRef` para tracking de duración

### Regla: "Verificar Flujo Completo de Datos: Escritura → Lectura"

**Antes de marcar una feature de datos como completa:**
```
[ ] ¿El componente que ESCRIBE datos usa la misma tabla que el componente que LEE?
[ ] ¿Las columnas escritas coinciden con las columnas leídas?
[ ] ¿Se verificó con Playwright el flujo completo (acción → resultado visible)?
```

**Anti-patrón:**
```
// ❌ Escribir a tabla A, leer desde tabla B
completeSession → study_history    // escribe aquí
useActivityData → test_sessions     // lee de aquí (¡diferente!)

// ✅ Escribir y leer la misma tabla
completeSession → test_sessions + study_history
useActivityData → test_sessions     // lee correctamente
```

---

### Incidente: Pipeline de Calidad Masivo — Agentes Estancados y Falsos Positivos (Febrero 2026)

**Problema 1:** Al lanzar 11 agentes Sonnet en paralelo (uno por tema), 3 se detuvieron silenciosamente sin completar (Temas 1, 3, 7 — los más grandes con >120 preguntas cada uno).

**Lección:** No confiar en que los agentes background terminen. Monitorear progreso con queries directas a Supabase (`SELECT COUNT(*) WHERE original_text IS NOT NULL`), no solo con output files. Relanzar agentes estancados con IDs específicos pendientes.

**Problema 2:** El Reformulador (Sonnet) cambió el enunciado pero olvidó actualizar la explicación en 60+ casos. La pregunta hablaba de un artículo y la explicación de otro completamente distinto (TOPIC_CHANGE).

**Lección:** El Agente 1 (Reformulador) DEBE verificar coherencia entre question_text, options y explanation. Todos deben referirse al mismo artículo legal. Agregar esta verificación explícita al prompt del agente.

**Problema 3:** Un `UPDATE` con `ILIKE '%Tema 9%'` para limpiar falsos positivos eliminó 91 flags legítimos porque la razón contenía "está en Tema 9" (el tema actual) aunque sugerían mover a otro tema.

**Lección:** Al hacer limpieza de flags con SQL, siempre usar condiciones más específicas. Verificar el COUNT antes del UPDATE. Preferir UPDATE con RETURNING para ver exactamente qué se modificó.

### Regla: "Pipeline Multi-Agente — Verificación Cruzada"

**Al ejecutar pipelines con múltiples agentes en secuencia:**
```
[ ] ¿Cada agente verifica que su output es coherente internamente?
[ ] ¿Se monitorea progreso con queries a la DB, no solo con logs?
[ ] ¿Los agentes grandes (>100 items) tienen mecanismo de relanzamiento?
[ ] ¿Las limpiezas automáticas de flags usan condiciones específicas?
[ ] ¿Se hace snapshot del estado antes de UPDATEs masivos?
```

### Pipeline de Preguntas — Referencia Rápida

**Dos pipelines disponibles en `.claude/questions/QUALITY_STANDARDS.md`:**

| Pipeline | Cuándo usar | Agentes |
|----------|-------------|---------|
| Reformulación (Rev. 3) | Mejorar preguntas importadas existentes | Reformulador(Sonnet) → Verificador(Opus) → Cazador(Sonnet) |
| Creación (Rev. 1) | Crear preguntas nuevas para temas con poca cobertura | Creador(Sonnet) → Verificador(Opus) → Cazador(Sonnet) |

**Campo `origin` en `questions` table** (nota: `source` almacena el nombre de archivo fuente):
- `'imported'` — de archivos Word/PDF
- `'reformulated'` — mejorada por pipeline
- `'ai_created'` — creada desde cero por IA

**Campo `validation_status`:**
- `'ai_created_pending'` — creada por IA, pendiente de revisión humana
- `'auto_validated'` — pasó pipeline automático
- `'human_approved'` — aprobada por revisor humano
- `'human_pending'` — pendiente de revisión
- `'rejected'` — rechazada

---

## Tareas Periódicas

### Roadmap ForceGraph (Visualización de Progreso)

El **Roadmap** es una visualización interactiva del progreso del proyecto ubicada en `src/features/draft/ForceGraph/`.

**Cuándo actualizar:**
- Al completar una fase importante del proyecto
- Después de varios commits con cambios significativos
- Cuando el usuario lo solicite
- Periódicamente para reflejar el estado actual

**Cómo acceder:**
- DevPanel → DraftFeatures → Tab "🌐 Roadmap"
- Solo visible para admins o en modo desarrollo

**Qué actualizar en `data.ts`:**
- Nodos completados vs pendientes (cambiar `status`)
- Conexiones entre features (`dependencies`)
- Estado de cada componente: `completed`, `in_progress`, `pending`, `blocked`

**Modos de layout:**
- `queue`: Topológico en columnas por nivel de dependencia (default)
- `force`: Orgánico con física (nodos se mueven libremente)

**Archivo principal:** `src/features/draft/DendriteNetwork/DendriteNetworkReactFlow.jsx`
