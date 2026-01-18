# Plan de Implementación - 18 Enero 2026 (v4)

## Contexto: Assessments Realizados

Este plan se basa en tres assessments previos:
1. **UX_UI_ASSESSMENT.md** - Evaluación de consistencia visual, accesibilidad, usabilidad
2. **MARKETING_CONSUMER_ASSESSMENT.md** - Propuesta de valor, onboarding, engagement
3. **CONSOLIDATED_OPPORTUNITIES.md** - Síntesis y priorización

### Hallazgos Clave de los Assessments

**UX/UI:**
- Inconsistencia visual entre código legacy y nuevo
- Dos versiones de Fortaleza (dots vs progress bars)
- Focus states ausentes (accesibilidad)
- Textos grises con bajo contraste
- **OpositaApp.jsx monolítico (~2571 líneas) - CRÍTICO**

**Marketing:**
- Onboarding no comunica propuesta de valor
- Upsell Premium muy pronto (genera fricción)
- Sin mecanismos de viralidad/referidos
- Falta "Modo Tranquilo" (diferenciador único)
- Contenido insuficiente (~34% temario)

**Funcionalidades Críticas Ausentes:**
- ⚠️ **Simulacros cronometrados** (100 preguntas en 60 min) - CRÍTICO
- ⚠️ **Modo "solo errores"** - Alto valor percibido
- ⚠️ **Opciones de duración de test** (5, 10, 20, 60, 100 preguntas)
- ⚠️ **Timer opcional** en sesiones

---

## 🎯 Visión General: 3 FASES

```
┌──────────────────────────────────────────────────────────────────────┐
│  FASE 1: CREAR COMPONENTES NUEVOS (5 Agentes en paralelo)           │
│  - Los agentes crean componentes en carpetas separadas               │
│  - NO modifican OpositaApp.jsx                                       │
│  - Resultado: Componentes listos para revisar                        │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│  FASE 2: REVISIÓN Y APROBACIÓN                                       │
│  - Orquestador revisa output de cada agente                         │
│  - Usuario aprueba componentes en DraftFeatures                     │
│  - Se corrigen inconsistencias                                       │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│  FASE 3: INTEGRACIÓN + REFACTOR                                      │
│  - Reemplazar componentes inline con los nuevos                     │
│  - Extraer modales y navegación (DevPanel, BottomTabBar, etc.)      │
│  - OpositaApp.jsx: 2571 → ~400 líneas                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📋 FASE 1: 5 Agentes en Paralelo

> **NOTA IMPORTANTE:** Los agentes NO modifican OpositaApp.jsx.
> Crean componentes nuevos que después se integrarán.

```
┌─────────────────────────────────────────────────────────────┐
│                    ORQUESTADOR (Yo)                         │
│  - Revisa output de cada agente                            │
│  - NO oculta DevButton                                     │
│  - Coordina la integración posterior                       │
└─────────────────────────────────────────────────────────────┘
                              │
    ┌─────────┬───────────────┼───────────────┬─────────┐
    │         │               │               │         │
    ▼         ▼               ▼               ▼         ▼
┌───────┐ ┌───────┐     ┌───────┐     ┌───────┐ ┌───────┐
│AGT 1  │ │AGT 2  │     │AGT 3  │     │AGT 4  │ │AGT 5  │
│Soft+  │ │Temas+ │     │Recurs+│     │Quick  │ │BD &   │
│Fort   │ │Activ. │     │Drafts │     │Wins   │ │Arquit.│
└───────┘ └───────┘     └───────┘     └───────┘ └───────┘
    │         │               │               │         │
    ▼         ▼               ▼               ▼         ▼
  home/    temas/+        recursos/+       Draft      Docs
           activity/     DraftFeatures    Features
```

---

## 📦 Agente 1: Soft+Fort Home

**Objetivo:** Crear nueva página de inicio (reemplazará `InicioContent`)

**Archivos a crear:**
```
src/components/home/
├── SoftFortHome.jsx        # Página completa
├── FortalezaVisual.jsx     # Sistema de fortaleza con progress bars
└── TopBar.jsx              # Barra superior con progreso SVG
```

**Tareas:**
1. Crear `SoftFortHome.jsx` basado en DraftFeatures existente
2. Integrar FortalezaVisual con progress bars (no dots)
3. TopBar con círculo de progreso SVG
4. Sección "Tu Sesión de Hoy" destacada
5. Conectar con datos mock (no tocar OpositaApp.jsx)

**Criterios de aceptación:**
- [ ] Diseño coincide con mockup Soft+Fort de DraftFeatures
- [ ] Fortaleza usa progress bars (no dots)
- [ ] Un solo CTA destacado para nuevos usuarios
- [ ] Animaciones suaves (framer-motion)
- [ ] Props claras para recibir datos (sin depender de estado global)
- [ ] Responsive en móvil

---

## 📦 Agente 2: Temas A + Actividad

**Objetivo:** Crear páginas de temas y actividad (reemplazarán `TemasContent` y `ActividadContent`)

**Archivos a crear:**
```
src/components/temas/
└── TemasListView.jsx       # Lista de temas con progreso

src/components/activity/
└── ActividadPage.jsx       # Historial y estadísticas
```

**Tareas para Temas:**
1. Crear `TemasListView.jsx` con lista clásica
2. Cada tema muestra: nombre, progreso %, estado visual
3. Filtros por bloque temático
4. Buscador de temas
5. Estados: dominado (verde), avanzando (amber), nuevo (gray), riesgo (red)
6. Recibe `topics` y `onTopicSelect` como props

**Tareas para Actividad:**
1. Crear `ActividadPage.jsx`
2. Historial de últimas 10 sesiones
3. Gráfico de actividad semanal (7 días)
4. Stats: precisión promedio, tiempo total, racha actual
5. Recibe datos vía props o hook `useActivityData`

**Criterios de aceptación:**
- [ ] Temas muestran progreso y estado visual
- [ ] Filtros funcionan correctamente
- [ ] Actividad muestra historial (mock o real)
- [ ] Componentes exportan interfaz clara de props
- [ ] Responsive en móvil

---

## 📦 Agente 3: Recursos + Draft Features (FlipCards y Contadores)

**Objetivo:** Crear página de recursos y demos de propuestas

**Archivos a crear/modificar:**
```
src/components/recursos/
└── RecursosPage.jsx        # 6 categorías expandibles

src/components/playground/
└── DraftFeatures.jsx       # Añadir tabs FlipCard y Contador
```

**Tareas para Recursos:**
1. Crear `RecursosPage.jsx` con 6 categorías:
   - 📚 Legislación, 📝 Esquemas, 🎯 Simulacros
   - 💡 Tips, 📖 Glosario, 🔗 Enlaces
2. Animación expandir/colapsar por categoría
3. Iconos y colores distintivos

**Tareas para FlipCard Demos:**
1. Tab "🃏 FlipCard Demos" en DraftFeatures
2. **Propuesta 1** - Flashcards de Repaso (gradiente rose→purple)
3. **Propuesta 2** - Stats Cards (colores por tipo)
4. **Propuesta 3** - Temas con Progreso (estado visual)

**Tareas para Contador Demos:**
1. Tab "🔢 Contador Animado Demos"
2. Variantes: Simple, Con %, Con Icono, Gamificación suave
3. Controles interactivos para probar valores

**Criterios de aceptación:**
- [ ] Recursos tiene 6 categorías con expand/collapse
- [ ] FlipCard demos muestran las 3 propuestas
- [ ] Contadores tienen 4 variantes interactivas
- [ ] Todo con animaciones suaves

---

## 📦 Agente 4: Quick Wins en Draft Features + Re-Assessment

**Objetivo:** Demos de Quick Wins + evaluación de nuevas páginas

**IMPORTANTE:** NO ocultar DevButton

**Archivos a crear/modificar:**
```
src/components/playground/
└── DraftFeatures.jsx       # Añadir tab Quick Wins

.claude/assessments/
└── NEW_PAGES_ASSESSMENT.md # Evaluación de las nuevas páginas
```

**Tareas - Quick Wins Demos:**
1. Tab "⚡ Quick Wins Preview" en DraftFeatures
2. **Demo Focus States:** Comparativa con/sin focus-visible
3. **Demo Contraste Grises:** gray-400 vs gray-500 vs gray-600
4. **Demo Auto-avance:** Slider 300ms-2000ms
5. **Demo Timer Opcional:** Toggle para mostrar/ocultar

**Tareas - Re-Assessment:**
1. Evaluar consistencia visual de Soft+Fort Home
2. Evaluar UX de Temas A
3. Evaluar estructura de Recursos
4. Evaluar Actividad page
5. Documentar en `NEW_PAGES_ASSESSMENT.md`

**Criterios de aceptación:**
- [ ] Tab Quick Wins muestra demos interactivos
- [ ] Usuario puede comparar antes/después
- [ ] Assessment documentado con recomendaciones

---

## 📦 Agente 5: Base de Datos + Arquitectura + User Journey

**Objetivo:** Revisar fundamentos técnicos y documentar

**Archivos a crear:**
```
.claude/assessments/
├── DATABASE_ARCHITECTURE_REVIEW.md  # Revisión de BD
└── USER_JOURNEY_ANALYSIS.md         # Análisis de flujo
```

**Nota:** El plan de refactor de OpositaApp.jsx ya existe en:
`.claude/assessments/OPOSITAAPP_REFACTOR_PLAN.md`

**Tareas:**

### 5.1 Estructura de Base de Datos
1. Revisar tablas existentes en Supabase
2. Verificar relaciones entre tablas
3. Revisar RLS policies
4. Identificar gaps para simulacros

### 5.2 Sistema de Preguntas
1. Contar preguntas por tema
2. Verificar estructura de pregunta
3. Proponer estructura para simulacros (100 preguntas)

### 5.3 Sistema de Fortaleza
1. Revisar cálculo de estado por tema
2. Comparar lógica legacy vs nueva
3. Proponer unificación

### 5.4 User Journey Analysis
1. Mapear flujo onboarding → sesión diaria
2. Identificar puntos de fricción
3. Proponer flujo para simulacros

### 5.5 Propuestas para Simulacros
- Opciones: 5, 10, 20, 60, 100 preguntas
- Timer: Sin tiempo, 1 min/preg, 36 seg/preg (AGE real)

**Criterios de aceptación:**
- [ ] Inventario de tablas y relaciones
- [ ] Conteo de preguntas por tema
- [ ] User journey mapeado
- [ ] Propuesta técnica para simulacros

---

## 🔄 FASE 2: Revisión y Aprobación

Después de que los 5 agentes completen:

### 2.1 Revisión del Orquestador
1. Verifico código de cada agente
2. Verifico consistencia de estilos (paleta purple/violet)
3. Verifico que componentes exporten props claras
4. Corrijo inconsistencias menores

### 2.2 Preview para Usuario
1. Los nuevos componentes se pueden ver en DraftFeatures
2. Usuario aprueba o solicita cambios
3. Se iteran correcciones si es necesario

---

## 🔧 FASE 3: Integración + Refactor de OpositaApp.jsx

> **Esta fase se ejecuta DESPUÉS de aprobar los componentes**

### 3.1 Reemplazar Componentes Inline (Bajo Riesgo)

| Inline Actual | Nuevo Componente | Líneas Eliminadas |
|---------------|------------------|-------------------|
| `InicioContent` | `SoftFortHome` | ~150 |
| `TemasContent` | `TemasListView` | ~90 |
| `ActividadContent` | `ActividadPage` | ~275 |
| `RecursosContent` | `RecursosPage` | ~80 |

**Resultado:** OpositaApp.jsx ~2571 → ~1975 líneas

### 3.2 Extraer Componentes UI Simples (Bajo Riesgo)

| Componente | Nuevo Archivo | Líneas |
|------------|---------------|--------|
| `DevPanel` | `src/components/dev/DevPanel.jsx` | ~60 |
| `TopBar` | `src/components/navigation/TopBar.jsx` | ~35 |

**Resultado:** ~1975 → ~1880 líneas

### 3.3 Extraer Modales (Medio Riesgo)

| Modal | Nuevo Archivo | Líneas |
|-------|---------------|--------|
| `PremiumModal` | `src/components/modals/PremiumModal.jsx` | ~75 |
| `ProgressModal` | `src/components/modals/ProgressModal.jsx` | ~100 |
| `SettingsModal` | `src/components/modals/SettingsModal.jsx` | ~145 |

**Resultado:** ~1880 → ~1560 líneas

### 3.4 Extraer Navegación (Medio Riesgo)

| Componente | Nuevo Archivo | Líneas |
|------------|---------------|--------|
| `BottomTabBar` | `src/components/navigation/BottomTabBar.jsx` | ~85 |

**Resultado:** ~1560 → ~1475 líneas

### 3.5 Extraer Lógica a Hooks (Alto Riesgo - Opcional)

> Solo si hay tiempo y el usuario lo aprueba

| Hook | Responsabilidad |
|------|-----------------|
| `useQuizSession` | Estados de quiz, respuestas, resultados |
| `useStreakManager` | Rachas, badges, celebraciones |
| `useOnboarding` | Flujo de onboarding |

**Resultado potencial:** ~1475 → ~400-500 líneas

---

## 📁 Estructura de Archivos Final (Post-Refactor)

```
src/
├── OpositaApp.jsx              # ~400-500 líneas (orquestador)
│
├── components/
│   ├── home/                   ← Agente 1
│   │   ├── SoftFortHome.jsx
│   │   ├── FortalezaVisual.jsx
│   │   └── TopBar.jsx
│   │
│   ├── temas/                  ← Agente 2
│   │   └── TemasListView.jsx
│   │
│   ├── activity/               ← Agente 2
│   │   └── ActividadPage.jsx
│   │
│   ├── recursos/               ← Agente 3
│   │   └── RecursosPage.jsx
│   │
│   ├── navigation/             ← Fase 3 Refactor
│   │   ├── BottomTabBar.jsx
│   │   └── TopBar.jsx
│   │
│   ├── modals/                 ← Fase 3 Refactor
│   │   ├── PremiumModal.jsx
│   │   ├── ProgressModal.jsx
│   │   └── SettingsModal.jsx
│   │
│   ├── dev/                    ← Fase 3 Refactor
│   │   └── DevPanel.jsx
│   │
│   └── playground/             ← Agentes 3 + 4
│       └── DraftFeatures.jsx
│
├── hooks/                      ← Fase 3 (opcional)
│   ├── useQuizSession.js
│   ├── useStreakManager.js
│   └── useOnboarding.js

.claude/
├── assessments/
│   ├── UX_UI_ASSESSMENT.md           (existente)
│   ├── MARKETING_CONSUMER_ASSESSMENT.md (existente)
│   ├── CONSOLIDATED_OPPORTUNITIES.md  (existente)
│   ├── OPOSITAAPP_REFACTOR_PLAN.md   (existente)
│   ├── NEW_PAGES_ASSESSMENT.md       ← Agente 4
│   ├── DATABASE_ARCHITECTURE_REVIEW.md ← Agente 5
│   └── USER_JOURNEY_ANALYSIS.md      ← Agente 5
```

---

## ✅ Checklist de Seguridad para Refactor

### Antes de Fase 3:
- [ ] Todos los componentes nuevos aprobados
- [ ] Tests manuales de navegación funcionando
- [ ] Backup de OpositaApp.jsx actual
- [ ] Documentar props que necesita cada componente

### Durante Fase 3:
- [ ] Extraer un componente a la vez
- [ ] Probar después de cada extracción
- [ ] NO extraer hooks de lógica hasta el final
- [ ] Mantener git commits pequeños

### Después de Fase 3:
- [ ] Todas las páginas funcionan
- [ ] Navegación entre tabs funciona
- [ ] Modales abren/cierran correctamente
- [ ] Login/logout funciona
- [ ] Sesiones de quiz funcionan

---

## 🚀 Resumen de Entregables

### FASE 1 (Agentes):

**Código Nuevo:**
- 🏰 `SoftFortHome.jsx` - Nuevo home con Fortaleza
- 📚 `TemasListView.jsx` - Lista de temas
- 📈 `ActividadPage.jsx` - Historial y stats
- 📖 `RecursosPage.jsx` - 6 categorías

**Demos en DraftFeatures:**
- 🃏 3 propuestas de FlipCard
- 🔢 4 variantes de Contador
- ⚡ Quick Wins Preview

**Documentación:**
- 📄 NEW_PAGES_ASSESSMENT.md
- 📄 DATABASE_ARCHITECTURE_REVIEW.md
- 📄 USER_JOURNEY_ANALYSIS.md

### FASE 3 (Refactor):

**Componentes Extraídos:**
- DevPanel, TopBar, BottomTabBar
- PremiumModal, ProgressModal, SettingsModal

**Resultado:**
- OpositaApp.jsx: **2571 → ~400-500 líneas**
- Código más mantenible
- Componentes reutilizables

---

## ⏱️ Flujo de Ejecución

```
DÍA 1: FASE 1
├── Lanzo 5 agentes en paralelo
├── Agentes crean componentes nuevos
└── NO tocan OpositaApp.jsx

DÍA 1-2: FASE 2
├── Reviso output de agentes
├── Corrijo inconsistencias
├── Usuario revisa en DraftFeatures
└── Aprobación de componentes

DÍA 2-3: FASE 3 (Refactor)
├── Paso 1: Reemplazo de *Content → nuevos componentes
├── Paso 2: Extraigo DevPanel, TopBar
├── Paso 3: Extraigo Modales
├── Paso 4: Extraigo BottomTabBar
├── Paso 5: (Opcional) Hooks de lógica
└── Tests y verificación
```

---

## ⚠️ Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Romper navegación | Media | Extraer BottomTabBar al final |
| Props faltantes | Media | Documentar interfaz antes de integrar |
| Re-renders | Baja | Memoización donde sea necesario |
| Conflictos de merge | Baja | Agentes no tocan OpositaApp.jsx |

---

*Plan v4 Integrado - Agentes + Refactor en 3 Fases*
*18 Enero 2026*
