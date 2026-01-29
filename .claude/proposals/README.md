# Propuestas de Visualización - Resumen

Este documento resume los intentos de implementación de visualizaciones interactivas para el Developer Roadmap/Dendrite Network, sus resultados y lecciones aprendidas.

---

## 1. DendriteViz - Canvas 2D con Efecto 3D

### Qué se intentó

Implementación de una visualización estilo "dendrita neuronal" usando Canvas 2D nativo con:

- **Física de grafos personalizada**: Sistema de fuerzas (atracción al centro, repulsión entre nodos, atracción por enlaces)
- **Efecto de profundidad falso 3D**: Eje Z simulado con opacidad y escala variable
- **Animación orgánica**: Movimiento "floating" continuo con fases aleatorias
- **Parallax por ratón**: Efecto de profundidad reactivo al movimiento del cursor

**Archivos creados:**
- `DendriteGraph.tsx` - Componente principal con Canvas rendering
- `types.ts` - Definiciones TypeScript para nodos, links, física
- `useGraphPhysics.ts` - Hook de simulación de física
- `useParallax.ts` - Hook para efecto parallax

### Por qué falló

1. **Enfoque Canvas puro**: Renderizado directo en Canvas 2D es difícil de depurar y mantener
2. **Sin pruebas en producción**: Solo se verificó en desarrollo local
3. **Complejidad de física**: Sistema de física propio sin biblioteca probada
4. **Falta de interactividad React**: El Canvas no se integra bien con el modelo de React para eventos y estado

---

## 2. ForceGraph - Biblioteca react-force-graph

### Qué se intentó

Usar la biblioteca `react-force-graph` para crear una visualización de grafo de fuerzas:

- **Biblioteca establecida**: react-force-graph tiene soporte para 2D/3D
- **Física D3**: Usa d3-force para simulación de física probada
- **Renderizado WebGL**: Soporte para Three.js y WebGL rendering

### Por qué falló

1. **Aumento masivo del bundle**: El tamaño pasó de **1.1MB a 2.9MB** (+164%)
   - La biblioteca depende de Three.js (~600KB minificado)
   - Incluye todo el stack 3D aunque solo se use 2D

2. **Problemas de importación de tipos**:
   - El tipo `ForceGraphMethods` no se exporta correctamente del paquete
   - Error: `Module '"react-force-graph"' has no exported member 'ForceGraphMethods'`
   - La tipificación TypeScript del paquete es incompleta

3. **Incompatibilidad de exports**:
   - Los tipos internos no coinciden con los exports públicos
   - Requiere workarounds o ignorar errores de TypeScript

---

## 3. Lecciones Aprendidas

### Verificación de paquetes npm

> **Regla**: Siempre verificar los exports de un paquete npm ANTES de importar tipos o funciones.

```bash
# Verificar qué exporta un paquete
npm pack <paquete> --dry-run
# O revisar el archivo index.d.ts en node_modules
```

### Impacto en bundle size

> **Regla**: Bibliotecas pesadas como Three.js aumentan significativamente el tamaño del bundle.

| Estado | Bundle Size |
|--------|-------------|
| Antes (sin ForceGraph) | ~1.1 MB |
| Después (con ForceGraph) | ~2.9 MB |
| **Incremento** | **+1.8 MB (+164%)** |

Para una aplicación de estudio móvil-first, este aumento es inaceptable.

### Pruebas en producción

> **Regla**: Probar en entorno de producción, no solo builds locales.

El build de desarrollo puede ocultar problemas de:
- Tree-shaking incorrecto
- Imports dinámicos fallidos
- Dependencias circulares

---

## 4. Próximos Pasos a Probar

### A. Lazy Loading / Dynamic Imports

Cargar la visualización solo cuando se necesita:

```jsx
// Solo cargar cuando se abre el DevPanel
const DendriteNetwork = lazy(() => import('./DendriteNetwork'));

// En DevPanel
{showVisualization && (
  <Suspense fallback={<LoadingSpinner />}>
    <DendriteNetwork data={roadmapData} />
  </Suspense>
)}
```

**Ventaja**: El peso adicional solo se descarga cuando el admin lo necesita.

### B. Alternativas más ligeras

| Biblioteca | Tamaño | Uso |
|------------|--------|-----|
| **D3.js directo** | ~50KB (módulos selectivos) | Física + SVG |
| **Chart.js** | ~60KB | Grafos simples |
| **SVG puro + CSS** | 0KB dependencias | Animaciones CSS |
| **Cytoscape.js** | ~300KB | Grafos complejos |

**Recomendación**: Probar con D3.js usando solo los módulos necesarios:
- `d3-force` para física
- `d3-selection` para manipulación DOM
- Renderizar en SVG (mejor integración con React)

### C. Cargar solo en DevPanel

Patrón de carga condicional:

```jsx
// En DevPanel.jsx
const [vizLoaded, setVizLoaded] = useState(false);
const [VizComponent, setVizComponent] = useState(null);

const loadVisualization = async () => {
  const module = await import('./DendriteNetwork');
  setVizComponent(() => module.default);
  setVizLoaded(true);
};

// Solo cargar al hacer click en el botón
<button onClick={loadVisualization}>
  Cargar Dendrite Network
</button>
```

### D. Versión simplificada SVG

Para MVP, considerar una versión estática o semi-animada con SVG:

```jsx
// Nodos como círculos SVG con transiciones CSS
<svg viewBox="0 0 800 600">
  {nodes.map(node => (
    <g
      key={node.id}
      className="transition-transform duration-500"
      transform={`translate(${node.x}, ${node.y})`}
    >
      <circle r={node.size} fill={statusColors[node.status]} />
      <text>{node.label}</text>
    </g>
  ))}
</svg>
```

---

## 5. Decisión Pendiente

**Opciones ordenadas por esfuerzo/beneficio:**

1. **SVG estático con CSS animations** - Mínimo esfuerzo, suficiente para MVP
2. **D3.js modular con lazy loading** - Mejor balance peso/funcionalidad
3. **react-force-graph con code splitting** - Si se necesita 3D real

**Recomendación**: Empezar con opción 1 (SVG + CSS) y evaluar si se necesita más complejidad.

---

## Archivos Preservados

Los archivos del intento DendriteViz se conservan en esta carpeta para referencia:

```
.claude/proposals/
├── README.md (este archivo)
├── dendrite-viz/
│   ├── types.ts
│   ├── useGraphPhysics.ts
│   └── useParallax.ts
└── force-graph/
    └── (vacío - no se preservó código)
```

---

*Última actualización: Enero 2026*
