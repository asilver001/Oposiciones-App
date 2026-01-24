# Plan: Página de Actividad con Tabs Deslizantes

## Concepto

Rediseñar la página de Actividad para tener **dos subpáginas** con navegación por tabs deslizantes:

```
┌─────────────────────────────────────────────┐
│  Actividad                           [⚙️]   │
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐         │
│  │  📊 Mi       │  │  🎯 Modos de │         │
│  │  Progreso    │  │  Estudio     │         │
│  └──────────────┘  └──────────────┘         │
│        ▼                                    │
│  ════════════════════════════════════════   │ ← Indicador de tab activo
├─────────────────────────────────────────────┤
│                                             │
│  [CONTENIDO DESLIZABLE]                     │
│                                             │
│  ← Swipe para cambiar de tab →              │
│                                             │
└─────────────────────────────────────────────┘
│  🎲 Dev Randomizer (flotante)               │
└─────────────────────────────────────────────┘
```

---

## Estructura de Tabs

### Tab 1: "📊 Mi Progreso" (Actividad actual)
Contenido actual de ActividadPage:
- Stats cards (tests, accuracy, correctas, días)
- Gráfico semanal
- Calendario mensual
- Historial de sesiones
- Mensaje motivacional
- **Botón flotante 🎲** para simular estados de usuario

### Tab 2: "🎯 Modos de Estudio"
Nueva subpágina con el selector de modos:
- Grid de 6 cards de modos de estudio
- Cada card con icono, título, descripción, tiempo estimado
- Estados: disponible, próximamente, premium
- Al seleccionar → Acción según modo:
  - Test Rápido → Inicia test de 5-10 preguntas
  - Práctica por Tema → Abre selector de temas
  - Repaso de Errores → Inicia con preguntas falladas
  - Simulacro → (Próximamente) placeholder
  - Flashcards → Inicia modo flashcards
  - Solo Lectura → (Premium) placeholder

---

## Componentes Necesarios

### 1. `ActivityTabsContainer` (nuevo componente wrapper)
```jsx
function ActivityTabsContainer({
  // Props para Mi Progreso
  weeklyData, sessionHistory, totalStats, calendarData, ...
  // Props para Modos
  onStartTest, onSelectTopic, onStartFlashcards, ...
  // Props generales
  devMode
}) {
  const [activeTab, setActiveTab] = useState(0); // 0 = Progreso, 1 = Modos

  return (
    <div>
      {/* Tab Headers */}
      <TabHeaders activeTab={activeTab} onChange={setActiveTab} />

      {/* Swipeable Content */}
      <SwipeableViews index={activeTab} onChangeIndex={setActiveTab}>
        <MiProgresoTab {...progressProps} devMode={devMode} />
        <ModosEstudioTab {...modesProps} />
      </SwipeableViews>

      {/* Dev Randomizer - visible en ambos tabs pero afecta solo a Progreso */}
      {devMode && <DevModeRandomizer onSimulate={...} />}
    </div>
  );
}
```

### 2. `TabHeaders` (navegación visual)
```jsx
function TabHeaders({ activeTab, onChange }) {
  const tabs = [
    { id: 0, icon: BarChart3, label: 'Mi Progreso' },
    { id: 1, icon: Target, label: 'Modos de Estudio' }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          onClick={() => onChange(tab.id)}
          className={activeTab === tab.id ? 'border-purple-500' : ''}
        >
          <tab.icon /> {tab.label}
        </button>
      ))}
      {/* Indicador animado debajo del tab activo */}
      <motion.div
        className="h-0.5 bg-purple-500"
        animate={{ x: activeTab * tabWidth }}
      />
    </div>
  );
}
```

### 3. `MiProgresoTab` (contenido actual de Actividad)
- Extraer el contenido actual de `ActividadPage` aquí
- Mantiene stats, gráficos, calendario, historial
- Recibe data simulada cuando dev randomizer está activo

### 4. `ModosEstudioTab` (selector de modos)
- Adaptar `StudyModeSelector` de DraftFeatures
- Grid responsive de cards de modos
- Cada card ejecuta acción correspondiente

---

## Interacción de Swipe

Usar `framer-motion` para el swipe:

```jsx
const [[page, direction], setPage] = useState([0, 0]);

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

<motion.div
  key={page}
  custom={direction}
  variants={slideVariants}
  initial="enter"
  animate="center"
  exit="exit"
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={1}
  onDragEnd={(e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1); // Ir a Modos
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1); // Ir a Progreso
    }
  }}
>
  {activeTab === 0 ? <MiProgresoTab /> : <ModosEstudioTab />}
</motion.div>
```

---

## Botón Dev Randomizer

El botón flotante 🎲 permanece en la página completa (no solo en un tab):
- Posición: esquina inferior derecha, encima del BottomTabBar
- Al simular un estado → afecta SOLO a "Mi Progreso"
- En "Modos de Estudio" → El botón sigue visible pero no tiene efecto visual

Estados disponibles:
```javascript
const userStates = {
  nuevo: { /* Usuario sin actividad */ },
  activo: { /* Usuario con actividad media */ },
  veterano: { /* Usuario con mucha actividad */ },
  aleatorio: { /* Valores random */ }
};
```

---

## Flujo de Usuario

```
Usuario abre "Actividad" tab
        │
        ▼
┌───────────────────────────────────┐
│  Tab "Mi Progreso" (default)      │
│  - Ve sus estadísticas            │
│  - Revisa historial               │
│  - Swipe izquierda →              │
└───────────────────────────────────┘
        │ swipe
        ▼
┌───────────────────────────────────┐
│  Tab "Modos de Estudio"           │
│  - Ve opciones de práctica        │
│  - Selecciona un modo             │
│  - Click en card →                │
└───────────────────────────────────┘
        │ click
        ▼
┌───────────────────────────────────┐
│  Acción según modo:               │
│  - Test Rápido → startTest()      │
│  - Por Tema → TemasListView       │
│  - Flashcards → FlashcardsView    │
│  - etc.                           │
└───────────────────────────────────┘
```

---

## Archivos a Crear/Modificar

### Crear (en DraftFeatures para propuesta):
```
Tab: "📱 Actividad v2"
- ActivityTabsDemo component con:
  - Tab headers con indicador animado
  - Swipeable views (Mi Progreso + Modos)
  - Dev Randomizer flotante
  - Datos mock para demostración
```

### Para implementación futura en producción:
```
src/components/activity/
├── ActivityTabsContainer.jsx  (nuevo - wrapper con tabs)
├── ActividadPage.jsx          (renombrar a MiProgresoTab)
├── ModosEstudioTab.jsx        (nuevo - selector de modos)
└── DevModeRandomizer.jsx      (extraer de ActividadPage)
```

---

## Estimación

| Tarea | Tiempo |
|-------|--------|
| Crear demo en DraftFeatures | 1-2 horas |
| Implementar tabs con swipe | 1-2 horas |
| Extraer ModosEstudioTab | 30 min |
| Integrar DevRandomizer | 30 min |
| Testing y ajustes | 1 hora |
| **Total** | ~4-6 horas |

---

## Preguntas de Diseño

1. **¿El tab default debería ser "Mi Progreso" o "Modos"?**
   - Recomendación: Mi Progreso (el usuario quiere ver su estado primero)

2. **¿El swipe debería ser obligatorio o también tener click en tabs?**
   - Recomendación: Ambos (click + swipe para mejor UX)

3. **¿Mostrar preview de Modos en Mi Progreso?**
   - Opción: Mini-card "Continuar estudiando" con acceso rápido al último modo usado

---

## Mockup Visual (ASCII)

```
┌─────────────────────────────────────────────────┐
│ ← Actividad                              [⚙️]   │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐   ┌─────────────────┐        │
│   │📊 Mi        │   │ 🎯 Modos de     │        │
│   │  Progreso   │   │    Estudio      │        │
│   └─────────────┘   └─────────────────┘        │
│   ═══════════════                              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │     [Stats Cards Grid 2x2]              │   │
│  │     Tests: 15  |  Accuracy: 72%         │   │
│  │     Correct: 87 |  Days: 12             │   │
│  │                                         │   │
│  │     [Weekly Progress Chart]             │   │
│  │     ▁▃▂▅▄▁▃                            │   │
│  │     L M X J V S D                       │   │
│  │                                         │   │
│  │     [Calendar Grid]                     │   │
│  │     Enero 2026                          │   │
│  │     ● ● ○ ● ○ ○ ●  (días practicados)  │   │
│  │                                         │   │
│  │     [Session History]                   │   │
│  │     📚 Tema 3 - 80% - hace 2h          │   │
│  │     🎯 Mixto - 65% - ayer              │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│                                         ┌───┐  │
│                                         │🎲 │  │
│                                         └───┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│  [Inicio]  [Actividad●]  [Temas]  [Recursos]   │
└─────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────┐
│ ← Actividad                              [⚙️]   │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐   ┌─────────────────┐        │
│   │📊 Mi        │   │ 🎯 Modos de     │        │
│   │  Progreso   │   │    Estudio      │        │
│   └─────────────┘   └─────────────────┘        │
│                     ═══════════════════        │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  ¿Cómo quieres estudiar hoy?            │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ ⚡ Test Rápido                   │   │   │
│  │  │ 5-10 preguntas · ~5 min        ○│   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ 🎯 Práctica por Tema             │   │   │
│  │  │ Elige tema específico · ~15 min ○│   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ ⚠️ Repaso de Errores    [12]    │   │   │
│  │  │ Solo preguntas falladas · var  ○│   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ 🃏 Flashcards                    │   │   │
│  │  │ Memorización rápida · ~10 min  ○│   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ ⏱️ Simulacro         [Próximo]  │   │   │
│  │  │ 100 preguntas, 60 min          ○│   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│                                         ┌───┐  │
│                                         │🎲 │  │
│                                         └───┘  │
├─────────────────────────────────────────────────┤
│  [Inicio]  [Actividad●]  [Temas]  [Recursos]   │
└─────────────────────────────────────────────────┘
```

---

*Plan creado: 2026-01-18*
*Para implementar en DraftFeatures como "📱 Actividad v2"*
