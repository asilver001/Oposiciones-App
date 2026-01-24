# Dendrite Network Visualization - Opciones de Implementación

**Objetivo:** Visualizar el estado del proyecto OpositaSmart con tareas, dependencias, y progreso en un gráfico de red estilo dendrite/neural network.

---

## Recomendación Principal: React Flow ⭐

**Library:** `reactflow` ([@xyflow/react](https://reactflow.dev))

### Por qué React Flow:
- ✅ **Perfecto para project tracking** - Diseñado para workflows y diagramas de flujo
- ✅ **Integración nativa con React** - Sin conflictos con Virtual DOM
- ✅ **Features out-of-the-box** - Zoom, pan, drag-and-drop incluidos
- ✅ **Bundle pequeño** - ~40-50KB gzipped (aceptable)
- ✅ **Fácil customización** - Tailwind CSS compatible
- ✅ **Documentación excelente** - Muchos ejemplos y tutoriales
- ✅ **Comunidad activa** - 2M+ descargas semanales, mantenido activamente

### Ejemplo de Uso:
```javascript
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  {
    id: 'fase-0',
    type: 'phase',
    data: {
      label: 'Fase 0: Críticos',
      status: 'completed',
      progress: 100
    },
    position: { x: 0, y: 0 }
  },
  {
    id: 'task-1',
    type: 'task',
    data: {
      label: 'Habilitar RLS',
      status: 'completed',
      priority: 'P0'
    },
    position: { x: 200, y: 100 }
  }
];

const edges = [
  { id: 'e1', source: 'fase-0', target: 'task-1', type: 'smoothstep' }
];

<ReactFlow nodes={nodes} edges={edges}>
  <Background />
  <Controls />
  <MiniMap />
</ReactFlow>
```

### Estructura de Nodos:

**Phase Node (Fase):**
- Color: Purple gradient
- Tamaño: Grande (200x100px)
- Info: Nombre, progreso %, status
- Icon: Rocket/Target/Trophy (según fase)

**Task Node (Tarea):**
- Color según status:
  - ✅ Completed: Green (emerald-500)
  - 🔄 In Progress: Purple (purple-500)
  - ⏳ Pending: Gray (gray-400)
  - 🔴 Blocked: Red (red-500)
- Tamaño: Mediano (150x80px)
- Info: Nombre, prioridad, estimación

**Blocker Node (Bloqueador):**
- Color: Orange/Red (warning)
- Forma: Hexágono
- Info: Descripción del blocker

### Edge Types:

- **Dependency** (requiere): Línea sólida azul
- **Blocks** (bloquea): Línea punteada roja
- **Part of** (parte de): Línea delgada gris

---

## Opción Alternativa: D3.js Force Graph

**Library:** `react-force-graph` ([GitHub](https://github.com/vasturiano/react-force-graph))

### Cuándo usar D3:
- Si quieres layouts orgánicos tipo "neural network"
- Si prefieres física natural (nodos se repelen/atraen)
- Si quieres visualización 3D (soporta WebGL)

### Pros:
- ✅ **Layouts hermosos** - Simulación de fuerzas muy natural
- ✅ **Flexible** - D3.js es extremadamente poderoso
- ✅ **3D capability** - Puede renderizar en 3D si se desea

### Cons:
- ❌ **Bundle grande** - ~280KB+ (mucho más pesado)
- ❌ **Integración compleja** - Conflictos con React Virtual DOM
- ❌ **Curva de aprendizaje** - D3.js es complejo
- ❌ **Performance** - Más lento para actualizaciones frecuentes

### Cuándo NO usar D3:
- Para project tracking (overkill)
- Si quieres drag-and-drop manual de nodos
- Si bundle size importa

---

## Comparación de Opciones

| Feature | React Flow | D3 Force | Cytoscape | Sigma.js |
|---------|-----------|----------|-----------|----------|
| **Bundle Size** | 40-50KB ✅ | 280KB+ ❌ | 150KB ⚠️ | 80KB ⚠️ |
| **React Support** | Nativo ✅ | Wrapper ⚠️ | Wrapper ⚠️ | Wrapper ⚠️ |
| **Project Tracking** | Perfecto ✅ | Overkill ❌ | Overkill ❌ | No ideal ⚠️ |
| **Customization** | Alto ✅ | Muy alto ✅ | Alto ✅ | Medio ⚠️ |
| **Performance** | Bueno ✅ | Medio ⚠️ | Bueno ✅ | Excelente ✅ |
| **Learning Curve** | Bajo ✅ | Alto ❌ | Medio ⚠️ | Medio ⚠️ |
| **Organic Layouts** | No ❌ | Sí ✅ | Sí ✅ | No ❌ |

---

## Estructura de Datos Propuesta

### projectState.json

```json
{
  "metadata": {
    "lastUpdated": "2026-01-24T18:00:00Z",
    "totalPhases": 5,
    "totalTasks": 47,
    "completedTasks": 13
  },
  "phases": [
    {
      "id": "phase-0",
      "name": "Fase 0: Críticos Pre-Deploy",
      "status": "completed",
      "progress": 100,
      "color": "purple",
      "estimatedHours": 14,
      "actualHours": 12,
      "tasks": ["task-1", "task-2", "task-3", "task-4", "task-5", "task-6", "task-7"]
    },
    {
      "id": "phase-1",
      "name": "Fase 1: Refactor Arquitectónico",
      "status": "pending",
      "progress": 0,
      "color": "blue",
      "estimatedHours": 92,
      "tasks": ["task-8", "task-9", "task-10"]
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "label": "Habilitar RLS en BD",
      "description": "Enable Row Level Security en todas las tablas",
      "status": "completed",
      "priority": "P0",
      "estimatedHours": 1,
      "actualHours": 1.5,
      "assignee": "agent-a99bd1b",
      "completedAt": "2026-01-24T17:58:00Z",
      "dependencies": [],
      "blockedBy": [],
      "phase": "phase-0"
    },
    {
      "id": "task-8",
      "label": "Crear estructura /pages",
      "description": "Crear carpetas pages, layouts, theme",
      "status": "pending",
      "priority": "P0",
      "estimatedHours": 2,
      "dependencies": [],
      "blockedBy": [],
      "phase": "phase-1"
    }
  ],
  "dependencies": [
    { "from": "task-8", "to": "task-9", "type": "requires" },
    { "from": "task-10", "to": "task-8", "type": "blocks" }
  ]
}
```

---

## Implementación Recomendada

### Fase 1: Proof of Concept (2-3 horas)

```bash
npm install reactflow
```

**Crear:**
```
src/features/draft/DendriteNetwork/
├── DendriteNetworkReactFlow.jsx    # Main component
├── projectState.json                # Project state data
├── hooks/
│   └── useDendriteData.js          # Parse & transform data
├── components/
│   ├── PhaseNode.jsx               # Phase visualization
│   ├── TaskNode.jsx                # Task visualization
│   └── BlockerNode.jsx             # Blocker visualization
└── styles.css                      # Custom styling
```

**PhaseNode.jsx:**
```jsx
import { Handle, Position } from 'reactflow';

export function PhaseNode({ data }) {
  const statusColors = {
    completed: 'bg-emerald-500',
    'in-progress': 'bg-purple-500',
    pending: 'bg-gray-400'
  };

  return (
    <div className={`rounded-2xl ${statusColors[data.status]} p-6 shadow-xl min-w-[200px]`}>
      <Handle type="target" position={Position.Top} />

      <div className="text-white">
        <div className="text-xs font-bold mb-2">{data.label}</div>
        <div className="text-2xl font-bold">{data.progress}%</div>
        <div className="text-xs mt-1">{data.status}</div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

**TaskNode.jsx:**
```jsx
export function TaskNode({ data }) {
  const priorityColors = {
    P0: 'border-red-500',
    P1: 'border-orange-500',
    P2: 'border-yellow-500'
  };

  const statusIcons = {
    completed: '✅',
    'in-progress': '🔄',
    pending: '⏳',
    blocked: '🔴'
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${priorityColors[data.priority]} p-4 min-w-[150px] shadow-md`}>
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start gap-2">
        <span className="text-xl">{statusIcons[data.status]}</span>
        <div>
          <div className="font-semibold text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500 mt-1">{data.priority} · {data.estimatedHours}h</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

### Fase 2: Integración con DevPanel (1 hora)

**DevPanel.jsx:**
```jsx
const [showDendrite, setShowDendrite] = useState(false);

<button onClick={() => setShowDendrite(true)} className="...">
  🧬 Dendrite Network
</button>

{showDendrite && (
  <Suspense fallback={<LoadingSpinner />}>
    <DendriteNetworkReactFlow onClose={() => setShowDendrite(false)} />
  </Suspense>
)}
```

### Fase 3: Interactividad (2 horas)

- Click en nodo → Modal con detalles de tarea
- Filtros: Por status, por fase, por prioridad
- Highlight dependencies al hover
- Export to PNG/SVG

### Fase 4: Data Syncing (opcional, 3 horas)

- Read from MVP_ROADMAP.md automáticamente
- Update projectState.json en real-time
- Persist en localStorage
- Sync con Supabase (opcional)

---

## Instalación y Setup

### 1. Install React Flow

```bash
npm install reactflow
```

### 2. Create Component

```jsx
// src/features/draft/DendriteNetwork/DendriteNetworkReactFlow.jsx
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PhaseNode } from './components/PhaseNode';
import { TaskNode } from './components/TaskNode';
import projectState from './projectState.json';

const nodeTypes = {
  phase: PhaseNode,
  task: TaskNode,
};

export default function DendriteNetworkReactFlow({ onClose }) {
  // Transform projectState.json to React Flow format
  const initialNodes = /* ... */;
  const initialEdges = /* ... */;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999]">
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
      >
        Cerrar
      </button>
    </div>
  );
}
```

### 3. Add to DevPanel

```jsx
const DendriteNetwork = lazy(() => import('@/features/draft/DendriteNetwork/DendriteNetworkReactFlow'));

{showDendrite && (
  <Suspense fallback={<div>Loading...</div>}>
    <DendriteNetwork onClose={() => setShowDendrite(false)} />
  </Suspense>
)}
```

---

## Ejemplo Visual (Conceptual)

```
┌─────────────────────────────────────────────────┐
│  FASE 0: Críticos Pre-Deploy          100% ✅   │
└───┬─────────────────────────────────────────────┘
    │
    ├─→ [RLS Habilitado] ✅ P0 1h
    ├─→ [SQL Injection Fix] ✅ P0 0.5h
    ├─→ [Índices BD] ✅ P0 2h
    ├─→ [Bulk Import] ✅ P0 1h
    └─→ [Rate Limiting] ✅ P0 2h

┌─────────────────────────────────────────────────┐
│  FASE 1: Refactor Arquitectónico       0% ⏳    │
└───┬─────────────────────────────────────────────┘
    │
    ├─→ [Instalar deps] ⏳ P0 0.5h
    ├─→ [Crear carpetas] ⏳ P0 1h
    ├─→ [Design System] ⏳ P0 4h
    └─→ [Zustand Stores] ⏳ P0 6h
         ↑
         └── [Blocker: Need React Router] 🔴
```

---

## Próximos Pasos

1. **Aprobar opción** - Confirmar React Flow como elección
2. **Install** - `npm install reactflow`
3. **Create structure** - Carpeta `/features/draft/DendriteNetwork/`
4. **Implement POC** - PhaseNode + TaskNode básicos
5. **Integrate** - Botón en DevPanel
6. **Test** - Verificar visualización funciona
7. **Polish** - Animaciones, interactividad, export

---

## Referencias

- **React Flow Docs:** https://reactflow.dev
- **React Flow GitHub:** https://github.com/xyflow/xyflow
- **Examples:** https://reactflow.dev/examples
- **Bundlephobia:** https://bundlephobia.com/package/reactflow

---

**Recomendación Final:** Usar React Flow para la primera versión. Si en el futuro se necesita física natural (organic layout), considerar agregar D3 Force Graph como opción alternativa toggleable.
