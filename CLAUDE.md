# CLAUDE.md - Guía para Claude Code

## Descripción del Proyecto

**OpositaSmart** es una aplicación web de preparación para oposiciones españolas (actualmente enfocada en Auxiliar Administrativo del Estado - AGE).

### Filosofía Core
- **Bienestar primero**: Sin gamificación tóxica, sin presión artificial
- **A tu ritmo**: "Unos minutos al día, sin agobios"
- **Ciencia del aprendizaje**: Basado en repetición espaciada (FSRS)

## Stack Tecnológico

- **Frontend**: React 19 + Vite 7
- **Estilos**: Tailwind CSS 4
- **Backend**: Supabase (auth + base de datos)
- **Iconos**: Lucide React
- **Deploy**: GitHub Pages (gh-pages)

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

### Pipeline de Preguntas

```
CREAR → REVISAR (IA) → PUBLICAR
              │
              ├─▶ ≥0.95 confidence → auto-aprobado
              ├─▶ <0.95 + corrección clara → auto-corregido
              └─▶ <0.80 sin corrección → rejected/ (humano)
```

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

## Tareas Periódicas

### Dendrite Network (Visualización de Progreso)

El **Dendrite Network** es una visualización interactiva del progreso del proyecto ubicada en `src/features/draft/DendriteNetwork/`.

**Cuándo actualizar:**
- Al completar una fase importante del proyecto
- Después de varios commits con cambios significativos
- Cuando el usuario lo solicite
- Periódicamente para reflejar el estado actual

**Cómo acceder:**
- DevPanel → botón "🧬 Dendrite Network"
- Solo visible para admins o en modo desarrollo

**Qué actualizar:**
- Nodos completados vs pendientes
- Conexiones entre features
- Estado de cada componente (nuevo, en progreso, completado)

**Archivo principal:** `src/features/draft/DendriteNetwork/DendriteNetworkReactFlow.jsx`
