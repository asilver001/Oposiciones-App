# Plan de Integración: Flowy Flow Visualizer

## Objetivo

Integrar [Flowy](https://github.com/alyssaxuu/flowy) en el DevPanel para visualizar y documentar los flujos de la aplicación OpositaSmart mediante diagramas interactivos.

## ¿Por qué Flowy?

- **Vanilla JS**: Sin dependencias adicionales (proyecto ya tiene pocas deps)
- **Ligero**: ~11KB minificado
- **Interactivo**: Drag & drop, reorganización, export/import JSON
- **Responsive**: Funciona en móvil
- **MIT License**: Compatible con proyecto open source

## Ubicación en el Proyecto

```
src/
├── components/
│   └── dev/
│       ├── DevPanel.jsx              # Agregar botón "📊 Flow Visualizer"
│       └── FlowVisualizer.jsx        # NUEVO: Componente visualizador
└── assets/
    └── flowy/                         # NUEVO: CSS + JS de Flowy
        ├── flowy.min.css
        └── flowy.min.js
```

## Flujos a Mapear (Fase 1)

### 1. Flujo de Onboarding
```
Inicio → WelcomeScreen → IntroStep → GoalStep → DateStep → Home
```

### 2. Flujo de Estudio Principal
```
Home → StudyDashboard → HybridSession → SessionComplete → Home
                       ↓
                  (si repaso) → ReviewContainer
```

### 3. Flujo de Autenticación
```
Login/SignUp → AuthContext → Home
              ↓
         ForgotPassword → Email sent → Login
```

### 4. Flujo de Navegación (BottomTabBar)
```
Home ←→ Actividad ←→ Recursos ←→ Perfil
```

### 5. Flujo de Admin
```
DevPanel → AdminLogin → AdminPanel → PreguntasTab / TemasTab / InsightsTab
```

## Implementación Técnica

### Fase 1: Setup Básico (30-45 min)

**1. Instalación**
```bash
# Descargar archivos de Flowy
mkdir -p src/assets/flowy
cd src/assets/flowy
curl -O https://cdn.jsdelivr.net/gh/alyssaxuu/flowy/flowy.min.css
curl -O https://cdn.jsdelivr.net/gh/alyssaxuu/flowy/flowy.min.js
```

**2. Crear componente FlowVisualizer.jsx**
```jsx
// src/components/dev/FlowVisualizer.jsx
import { useEffect, useRef, useState } from 'react';
import './flowy.css'; // Import CSS

const PREDEFINED_FLOWS = {
  onboarding: [...],
  study: [...],
  auth: [...],
  navigation: [...],
  admin: [...]
};

export default function FlowVisualizer({ onClose }) {
  const canvasRef = useRef(null);
  const [selectedFlow, setSelectedFlow] = useState('onboarding');
  const [flowInstance, setFlowInstance] = useState(null);

  useEffect(() => {
    // Inicializar Flowy
    if (canvasRef.current && window.flowy) {
      const instance = window.flowy(
        canvasRef.current,
        onGrab,
        onRelease,
        onSnap,
        onRearrange,
        40, // spacingX
        100 // spacingY
      );
      setFlowInstance(instance);
    }
  }, []);

  const loadFlow = (flowName) => {
    if (flowInstance) {
      flowInstance.import(PREDEFINED_FLOWS[flowName]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">📊 Flow Visualizer</h2>
        <div className="flex gap-2">
          {/* Flow selector */}
          <select
            value={selectedFlow}
            onChange={(e) => { setSelectedFlow(e.target.value); loadFlow(e.target.value); }}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            <option value="onboarding">Onboarding</option>
            <option value="study">Estudio</option>
            <option value="auth">Autenticación</option>
            <option value="navigation">Navegación</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="flex-1 overflow-auto bg-gray-950" id="canvas">
        {/* Bloques de Flowy se renderizarán aquí */}
      </div>

      {/* Toolbar */}
      <div className="bg-gray-900 p-3 flex gap-2">
        <button
          onClick={() => flowInstance?.deleteBlocks()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          🗑️ Limpiar
        </button>
        <button
          onClick={() => console.log(flowInstance?.output())}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          💾 Export JSON
        </button>
      </div>
    </div>
  );
}
```

**3. Actualizar DevPanel.jsx**
```jsx
import FlowVisualizer from './FlowVisualizer';

export default function DevPanel({ ... }) {
  const [showFlowViz, setShowFlowViz] = useState(false);

  return (
    <>
      {/* Panel existente */}
      <div className="...">
        {/* ...botones existentes... */}

        {/* NUEVO BOTÓN */}
        <button
          onClick={() => setShowFlowViz(true)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs py-2 px-3 rounded-lg text-left font-medium"
        >
          📊 Flow Visualizer
        </button>
      </div>

      {/* Modal de Flow Visualizer */}
      {showFlowViz && <FlowVisualizer onClose={() => setShowFlowViz(false)} />}
    </>
  );
}
```

**4. Cargar Flowy en index.html**
```html
<!-- public/index.html -->
<head>
  <!-- ...existente... -->
  <link rel="stylesheet" href="/src/assets/flowy/flowy.min.css">
  <script src="/src/assets/flowy/flowy.min.js"></script>
</head>
```

### Fase 2: Bloques Predefinidos (45-60 min)

**Definir estructura de bloques por flujo:**

```javascript
// src/components/dev/flowData.js
export const ONBOARDING_FLOW = {
  blocks: [
    { id: 1, parent: -1, data: [{ name: "WelcomeScreen" }], x: 0, y: 0 },
    { id: 2, parent: 1, data: [{ name: "IntroStep" }], x: 0, y: 100 },
    { id: 3, parent: 2, data: [{ name: "GoalStep" }], x: 0, y: 200 },
    { id: 4, parent: 3, data: [{ name: "DateStep" }], x: 0, y: 300 },
    { id: 5, parent: 4, data: [{ name: "Home" }], x: 0, y: 400 }
  ]
};

export const STUDY_FLOW = {
  blocks: [
    { id: 1, parent: -1, data: [{ name: "Home" }], x: 0, y: 0 },
    { id: 2, parent: 1, data: [{ name: "StudyDashboard" }], x: 0, y: 100 },
    { id: 3, parent: 2, data: [{ name: "HybridSession" }], x: 0, y: 200 },
    { id: 4, parent: 3, data: [{ name: "SessionComplete" }], x: 0, y: 300 },
    { id: 5, parent: 4, data: [{ name: "Home" }], x: 0, y: 400 },
    // Branch de repaso
    { id: 6, parent: 3, data: [{ name: "ReviewContainer" }], x: 200, y: 300 }
  ]
};

export const AUTH_FLOW = { /* ... */ };
export const NAVIGATION_FLOW = { /* ... */ };
export const ADMIN_FLOW = { /* ... */ };

export const ALL_FLOWS = {
  onboarding: ONBOARDING_FLOW,
  study: STUDY_FLOW,
  auth: AUTH_FLOW,
  navigation: NAVIGATION_FLOW,
  admin: ADMIN_FLOW
};
```

### Fase 3: Estilos y Mejoras (30 min)

**Customizar bloques de Flowy para match con tema purple:**

```css
/* src/components/dev/flowVisualizer.css */
.blockelem {
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  border: 2px solid #a855f7;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
}

.blockelem:hover {
  box-shadow: 0 6px 30px rgba(147, 51, 234, 0.5);
}

.indicator {
  background: #a855f7;
}

.arrowblock {
  stroke: #a855f7;
  stroke-width: 3px;
}
```

### Fase 4: Features Avanzados (Opcional - Fase 2)

1. **Clickable nodes**: Al hacer click en un bloque, mostrar info del componente
2. **Search**: Buscar componentes específicos
3. **Export PNG**: Captura del diagrama
4. **Auto-generate**: Generar flowchart desde código (parser AST)
5. **Annotations**: Añadir notas a cada nodo

## Testing

- [ ] DevPanel muestra botón "📊 Flow Visualizer"
- [ ] Modal abre correctamente en fullscreen
- [ ] Selector de flujos funciona
- [ ] Cada flujo predefinido carga correctamente
- [ ] Botón "Limpiar" funciona
- [ ] Botón "Export JSON" muestra output en console
- [ ] Estilos purple match con la app
- [ ] Responsive en móvil

## Beneficios

1. **Documentación visual**: Nuevos devs entienden flujos rápidamente
2. **Detección de problemas**: Identificar flujos redundantes o confusos
3. **Planning**: Diseñar nuevos features visualmente antes de codear
4. **Comunicación**: Explicar arquitectura a stakeholders
5. **Onboarding**: Reducer curva de aprendizaje del proyecto

## Notas

- Flowy no tiene npm package oficial, usar CDN o archivos locales
- Alternativas evaluadas: ReactFlow (78KB), Cytoscape (pesado)
- Flowy elegido por ser más ligero y suficiente para nuestro caso de uso

## Referencias

- Repo oficial: https://github.com/alyssaxuu/flowy
- Demo: https://flowy.alyssax.com/
- Docs: README en GitHub

---

**Estimación total:** 2-3 horas
**Prioridad:** MEDIA (útil para desarrollo, no crítico para MVP)
**Dependencias:** Ninguna (standalone)
