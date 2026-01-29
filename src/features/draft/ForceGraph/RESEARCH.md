# 3D Force Graph Research for Developer Roadmap Visualization

> Research for creating a developer roadmap/todo list visualization using [3d-force-graph](https://github.com/vasturiano/3d-force-graph) and [react-force-graph](https://github.com/vasturiano/react-force-graph).

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Layout Patterns](#layout-patterns)
   - [Basic Force-Directed](#1-basic-force-directed-layout)
   - [DAG (Directed Acyclic Graph)](#2-dag-directed-acyclic-graph-layout)
   - [Force Tree](#3-force-tree-layout)
4. [Data Structure](#data-structure)
5. [Visual Customizations](#visual-customizations)
6. [Status-Based Styling](#status-based-styling)
7. [Interactivity](#interactivity)
8. [React Integration Examples](#react-integration-examples)
9. [Performance Considerations](#performance-considerations)
10. [Sources](#sources)

---

## Overview

The **3d-force-graph** library provides a 3D force-directed graph visualization using ThreeJS/WebGL. The **react-force-graph** wrapper offers four React components with identical APIs:

| Component | Renderer | Use Case |
|-----------|----------|----------|
| `react-force-graph-2d` | HTML Canvas | Simpler, better performance |
| `react-force-graph-3d` | ThreeJS/WebGL | 3D visualization |
| `react-force-graph-vr` | A-Frame | VR experiences |
| `react-force-graph-ar` | AR.js | Augmented reality |

For a developer roadmap/todo system, **ForceGraph2D** is recommended for performance, while **ForceGraph3D** provides more visual impact.

---

## Installation

```bash
# 2D version (recommended for roadmaps)
npm install react-force-graph-2d

# 3D version (more visual impact)
npm install react-force-graph-3d

# Both use d3-force-3d internally
npm install d3-force-3d  # Optional: for custom force configuration
```

Import in React:

```javascript
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
```

---

## Layout Patterns

### 1. Basic Force-Directed Layout

Standard physics-based layout where nodes repel each other and links pull connected nodes together. Good for showing general relationships without hierarchy.

#### Configuration

```jsx
<ForceGraph3D
  graphData={data}
  // Default forces: 'link', 'charge', 'center'
  d3VelocityDecay={0.4}  // Dampening (0-1, higher = faster settle)
  d3AlphaDecay={0.0228}  // How quickly simulation cools
  warmupTicks={100}       // Ticks before rendering
  cooldownTicks={1000}    // Max ticks before stopping
/>
```

#### Customizing Forces

```jsx
import { forceCollide, forceManyBody, forceLink } from 'd3-force-3d';

<ForceGraph3D
  graphData={data}
  d3Force="charge"
  d3ForceConfig={{
    charge: { strength: -100 },
    link: { distance: 50 }
  }}
  // Or programmatically:
  ref={graphRef}
/>

// After mount:
graphRef.current.d3Force('charge').strength(-100);
graphRef.current.d3Force('collision', forceCollide(15));
```

#### Best For
- Exploratory visualizations
- No clear hierarchy
- Small to medium graphs (<500 nodes)

---

### 2. DAG (Directed Acyclic Graph) Layout

Hierarchical layout that constrains nodes based on graph directionality. **Ideal for developer roadmaps** where tasks flow from start to finish.

#### dagMode Options

| Mode | Description | Best For |
|------|-------------|----------|
| `'td'` | Top-down | Vertical roadmaps |
| `'bu'` | Bottom-up | Goal-oriented (end at top) |
| `'lr'` | Left-to-right | **Horizontal timelines** |
| `'rl'` | Right-to-left | RTL languages |
| `'zout'` | Z-axis outward | 3D depth effect |
| `'zin'` | Z-axis inward | 3D tunnel effect |
| `'radialout'` | Radial outward | Circular roadmaps |
| `'radialin'` | Radial inward | Focus on center |
| `null` | Disabled | Standard force layout |

#### Configuration

```jsx
<ForceGraph3D
  graphData={data}
  dagMode="lr"              // Left-to-right hierarchy
  dagLevelDistance={180}    // Distance between levels
  dagNodeFilter={node => node.type !== 'optional'}  // Exclude nodes from DAG
  onDagError={(loopNodeIds) => {
    console.warn('Cycle detected:', loopNodeIds);
    // Return false to suppress exception
    return false;
  }}
  d3VelocityDecay={0.3}
  d3Force="collision"
  d3ForceConfig={{
    collision: { radius: 15 }
  }}
/>
```

#### Example: Horizontal Roadmap

```jsx
import ForceGraph2D from 'react-force-graph-2d';

const RoadmapGraph = ({ tasks }) => {
  const graphData = useMemo(() => ({
    nodes: tasks.map(task => ({
      id: task.id,
      name: task.title,
      status: task.status,  // 'completed' | 'in_progress' | 'pending'
      group: task.phase
    })),
    links: tasks.flatMap(task =>
      (task.dependencies || []).map(depId => ({
        source: depId,
        target: task.id
      }))
    )
  }), [tasks]);

  return (
    <ForceGraph2D
      graphData={graphData}
      dagMode="lr"
      dagLevelDistance={120}
      nodeLabel="name"
      nodeColor={node => statusColors[node.status]}
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
    />
  );
};
```

---

### 3. Force Tree Layout

Tree-based DAG with additional physics for organic appearance. Uses collision forces to prevent overlap.

#### Configuration

```jsx
import { forceCollide } from 'd3-force-3d';

const NODE_REL_SIZE = 4;

<ForceGraph3D
  graphData={treeData}
  dagMode="td"                    // Top-down tree
  dagLevelDistance={200}          // Vertical spacing
  backgroundColor="#101020"
  nodeRelSize={NODE_REL_SIZE}
  nodeVal={node => node.size || 1}  // Node importance
  nodeAutoColorBy="module"        // Color by category
  nodeOpacity={0.9}
  linkColor={() => 'rgba(255,255,255,0.2)'}
  linkDirectionalParticles={2}    // Animated flow
  linkDirectionalParticleWidth={0.8}
  linkDirectionalParticleSpeed={0.006}
  d3Force="collision"
  d3ForceConfig={{
    collision: {
      radius: node => Math.cbrt(node.size) * NODE_REL_SIZE
    }
  }}
  d3VelocityDecay={0.3}
  ref={graphRef}
/>

// Reduce charge strength for tighter layout:
graphRef.current.d3Force('charge').strength(-15);
```

#### Tree Data Structure

```javascript
const treeData = {
  nodes: [
    { id: 'root', name: 'Project Start', level: 0, module: 'core' },
    { id: 'phase1', name: 'Phase 1', level: 1, module: 'setup' },
    { id: 'task1.1', name: 'Task 1.1', level: 2, module: 'setup', size: 20 },
    // ...
  ],
  links: [
    { source: 'root', target: 'phase1' },
    { source: 'phase1', target: 'task1.1' },
    // ...
  ]
};
```

---

## Data Structure

### Basic Format

```typescript
interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface Node {
  id: string | number;           // Required: unique identifier
  name?: string;                 // Display label
  val?: number;                  // Node size/importance
  color?: string;                // Node color
  group?: string | number;       // For auto-coloring
  [key: string]: any;            // Custom properties
}

interface Link {
  source: string | number;       // Source node id
  target: string | number;       // Target node id
  value?: number;                // Link strength/width
  color?: string;                // Link color
  [key: string]: any;            // Custom properties
}
```

### Roadmap-Specific Structure

```typescript
interface RoadmapNode extends Node {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  phase: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  completedDate?: string;
  dependencies?: string[];       // IDs of prerequisite tasks
}

interface RoadmapLink extends Link {
  source: string;
  target: string;
  type?: 'dependency' | 'related' | 'optional';
}
```

### Converting to Graph Data

```javascript
function tasksToGraphData(tasks) {
  const nodes = tasks.map(task => ({
    id: task.id,
    name: task.title,
    val: task.estimatedHours || 1,
    status: task.status,
    phase: task.phase,
    priority: task.priority,
    // Store full task for click handlers
    __task: task
  }));

  const links = [];
  tasks.forEach(task => {
    (task.dependencies || []).forEach(depId => {
      links.push({
        source: depId,
        target: task.id,
        type: 'dependency'
      });
    });
  });

  return { nodes, links };
}
```

---

## Visual Customizations

### Node Styling

#### Basic Props

```jsx
<ForceGraph3D
  nodeVal={node => node.val || 1}           // Size (sphere volume)
  nodeRelSize={4}                            // Base size multiplier
  nodeColor={node => node.color}             // Direct color
  nodeAutoColorBy="group"                    // Auto-color by property
  nodeOpacity={0.75}                         // Transparency
  nodeResolution={16}                        // Sphere detail (3D)
  nodeVisibility={node => !node.hidden}      // Show/hide
  nodeLabel={node => node.name}              // Hover label (HTML ok)
/>
```

#### Custom 2D Nodes (Canvas)

```jsx
<ForceGraph2D
  nodeCanvasObject={(node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    const nodeRadius = Math.sqrt(node.val || 1) * 4;

    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color || '#6366f1';
    ctx.fill();

    // Draw border for status
    if (node.status === 'in_progress') {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }

    // Draw glow effect for completed
    if (node.status === 'completed') {
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw label
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(label, node.x, node.y + nodeRadius + fontSize);
  }}
  nodeCanvasObjectMode={() => 'replace'}  // 'replace' | 'before' | 'after'
  nodePointerAreaPaint={(node, color, ctx) => {
    // Define clickable area
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, Math.sqrt(node.val || 1) * 4, 0, 2 * Math.PI);
    ctx.fill();
  }}
/>
```

#### Custom 3D Nodes (Three.js)

```jsx
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

<ForceGraph3D
  nodeThreeObject={node => {
    const group = new THREE.Group();

    // Main sphere
    const geometry = new THREE.SphereGeometry(
      Math.cbrt(node.val || 1) * 3
    );
    const material = new THREE.MeshLambertMaterial({
      color: statusColors[node.status],
      transparent: true,
      opacity: 0.9
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Glow effect for completed
    if (node.status === 'completed') {
      const glowGeometry = new THREE.SphereGeometry(
        Math.cbrt(node.val || 1) * 3.5
      );
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: '#22c55e',
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      group.add(glow);
    }

    // Label sprite
    const sprite = new SpriteText(node.name);
    sprite.color = '#ffffff';
    sprite.textHeight = 4;
    sprite.position.y = -10;
    group.add(sprite);

    return group;
  }}
  nodeThreeObjectExtend={false}  // Replace default, not extend
/>
```

### Link Styling

```jsx
<ForceGraph3D
  linkColor={link => link.type === 'dependency' ? '#6366f1' : '#94a3b8'}
  linkWidth={link => link.value || 1}
  linkOpacity={0.6}
  linkCurvature={0.1}                        // Curved links
  linkCurveRotation={Math.PI / 2}            // Curve direction

  // Directional indicators
  linkDirectionalArrowLength={6}
  linkDirectionalArrowRelPos={1}             // Arrow at end
  linkDirectionalArrowColor={() => '#fff'}

  // Animated particles (shows flow direction)
  linkDirectionalParticles={link =>
    link.type === 'dependency' ? 3 : 0
  }
  linkDirectionalParticleWidth={2}
  linkDirectionalParticleSpeed={0.01}
  linkDirectionalParticleColor={() => '#a855f7'}

  // Visibility
  linkVisibility={link => !link.hidden}
  linkLabel={link => `${link.source.name} -> ${link.target.name}`}
/>
```

---

## Status-Based Styling

### Color Schemes for Task States

```javascript
// Color palette for roadmap statuses
const STATUS_COLORS = {
  completed: '#22c55e',    // Green
  in_progress: '#f59e0b',  // Amber
  pending: '#6366f1',      // Indigo
  blocked: '#ef4444',      // Red
  optional: '#94a3b8'      // Gray
};

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

// Dynamic color accessor
const getNodeColor = (node) => {
  if (node.status === 'blocked') return STATUS_COLORS.blocked;
  if (node.status === 'completed') return STATUS_COLORS.completed;
  if (node.status === 'in_progress') return STATUS_COLORS.in_progress;
  return STATUS_COLORS.pending;
};
```

### Visual Differentiation Strategies

#### 1. Color + Size

```jsx
<ForceGraph2D
  nodeColor={getNodeColor}
  nodeVal={node => {
    // Completed tasks smaller, pending larger
    if (node.status === 'completed') return 1;
    if (node.status === 'in_progress') return 3;
    return 2;
  }}
/>
```

#### 2. Color + Opacity

```jsx
<ForceGraph3D
  nodeColor={getNodeColor}
  nodeOpacity={node => {
    if (node.status === 'completed') return 0.5;  // Fade completed
    if (node.status === 'pending') return 1.0;
    return 0.85;
  }}
/>
```

#### 3. Custom Shapes (2D)

```jsx
const drawStatusNode = (node, ctx, globalScale) => {
  const size = 6;
  ctx.fillStyle = STATUS_COLORS[node.status];

  switch (node.status) {
    case 'completed':
      // Checkmark in circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fill();
      // Draw checkmark
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.beginPath();
      ctx.moveTo(node.x - 3, node.y);
      ctx.lineTo(node.x - 1, node.y + 3);
      ctx.lineTo(node.x + 4, node.y - 3);
      ctx.stroke();
      break;

    case 'in_progress':
      // Pulsing ring effect
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fill();
      // Outer ring
      ctx.strokeStyle = STATUS_COLORS.in_progress;
      ctx.lineWidth = 3 / globalScale;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
      ctx.stroke();
      break;

    case 'blocked':
      // X shape
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.beginPath();
      ctx.moveTo(node.x - 3, node.y - 3);
      ctx.lineTo(node.x + 3, node.y + 3);
      ctx.moveTo(node.x + 3, node.y - 3);
      ctx.lineTo(node.x - 3, node.y + 3);
      ctx.stroke();
      break;

    default: // pending
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fill();
  }
};
```

#### 4. Glow Effects (2D Canvas)

```jsx
const drawGlowNode = (node, ctx, globalScale) => {
  const radius = 8;

  // Glow for completed/in_progress
  if (node.status === 'completed' || node.status === 'in_progress') {
    const glowColor = node.status === 'completed' ? '#22c55e' : '#f59e0b';
    const gradient = ctx.createRadialGradient(
      node.x, node.y, radius,
      node.x, node.y, radius * 2.5
    );
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius * 2.5, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Main node
  ctx.fillStyle = STATUS_COLORS[node.status];
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
  ctx.fill();
};
```

#### 5. Glow Effects (3D Three.js)

```jsx
import * as THREE from 'three';

const createGlowingSphere = (node) => {
  const group = new THREE.Group();
  const radius = Math.cbrt(node.val || 1) * 3;

  // Core sphere
  const coreGeo = new THREE.SphereGeometry(radius, 32, 32);
  const coreMat = new THREE.MeshLambertMaterial({
    color: STATUS_COLORS[node.status],
    transparent: true,
    opacity: 0.9
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Glow layer (for completed/in_progress)
  if (node.status === 'completed' || node.status === 'in_progress') {
    const glowGeo = new THREE.SphereGeometry(radius * 1.4, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: STATUS_COLORS[node.status],
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    group.add(new THREE.Mesh(glowGeo, glowMat));
  }

  return group;
};
```

---

## Interactivity

### Click Handlers

```jsx
<ForceGraph3D
  onNodeClick={(node, event) => {
    console.log('Clicked:', node);
    // Open task detail modal
    setSelectedTask(node.__task);
  }}
  onNodeRightClick={(node, event) => {
    // Context menu
    showContextMenu(event, node);
  }}
  onLinkClick={(link, event) => {
    console.log('Link:', link.source.name, '->', link.target.name);
  }}
  onBackgroundClick={(event) => {
    // Deselect
    setSelectedTask(null);
  }}
/>
```

### Hover Effects

```jsx
const [hoverNode, setHoverNode] = useState(null);

<ForceGraph2D
  onNodeHover={(node) => setHoverNode(node)}
  nodeCanvasObject={(node, ctx, globalScale) => {
    const isHovered = node === hoverNode;
    const radius = isHovered ? 10 : 6;

    ctx.fillStyle = isHovered
      ? '#fff'
      : STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (isHovered) {
      ctx.strokeStyle = STATUS_COLORS[node.status];
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }
  }}
/>
```

### Node Highlighting

```jsx
const [highlightNodes, setHighlightNodes] = useState(new Set());
const [highlightLinks, setHighlightLinks] = useState(new Set());

const handleNodeHover = (node) => {
  const nodes = new Set();
  const links = new Set();

  if (node) {
    nodes.add(node);
    // Add connected nodes
    graphData.links.forEach(link => {
      if (link.source === node || link.target === node) {
        nodes.add(link.source);
        nodes.add(link.target);
        links.add(link);
      }
    });
  }

  setHighlightNodes(nodes);
  setHighlightLinks(links);
};

<ForceGraph2D
  onNodeHover={handleNodeHover}
  nodeColor={node =>
    highlightNodes.size === 0 || highlightNodes.has(node)
      ? STATUS_COLORS[node.status]
      : '#333'  // Dim non-highlighted
  }
  linkColor={link =>
    highlightLinks.size === 0 || highlightLinks.has(link)
      ? '#6366f1'
      : '#222'
  }
  linkWidth={link =>
    highlightLinks.has(link) ? 3 : 1
  }
/>
```

### Node Dragging

```jsx
<ForceGraph3D
  enableNodeDrag={true}
  onNodeDrag={(node, translate) => {
    // Node is being dragged
  }}
  onNodeDragEnd={(node, translate) => {
    // Node drag finished
    // Could save position to state
  }}
/>
```

### Camera Controls

```jsx
const graphRef = useRef();

// Zoom to fit all nodes
const zoomToFit = () => {
  graphRef.current.zoomToFit(400, 50);  // duration, padding
};

// Focus on specific node
const focusOnNode = (nodeId) => {
  const node = graphData.nodes.find(n => n.id === nodeId);
  if (node) {
    graphRef.current.cameraPosition(
      { x: node.x, y: node.y, z: 300 },  // Position
      node,                               // LookAt target
      1000                                // Animation duration
    );
  }
};

<ForceGraph3D
  ref={graphRef}
  controlType="orbit"  // 'trackball' | 'orbit' | 'fly'
/>
```

---

## React Integration Examples

### Complete 2D Roadmap Component

```jsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const STATUS_COLORS = {
  completed: '#22c55e',
  in_progress: '#f59e0b',
  pending: '#6366f1',
  blocked: '#ef4444'
};

export default function RoadmapGraph2D({ tasks, onTaskClick }) {
  const graphRef = useRef();
  const [hoverNode, setHoverNode] = useState(null);

  // Convert tasks to graph data
  const graphData = useMemo(() => ({
    nodes: tasks.map(task => ({
      id: task.id,
      name: task.title,
      status: task.status,
      phase: task.phase,
      val: task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1,
      __task: task
    })),
    links: tasks.flatMap(task =>
      (task.dependencies || []).map(depId => ({
        source: depId,
        target: task.id
      }))
    )
  }), [tasks]);

  // Custom node rendering
  const paintNode = useCallback((node, ctx, globalScale) => {
    const isHovered = node === hoverNode;
    const radius = Math.sqrt(node.val) * 4 * (isHovered ? 1.3 : 1);

    // Glow for in-progress
    if (node.status === 'in_progress') {
      const gradient = ctx.createRadialGradient(
        node.x, node.y, radius,
        node.x, node.y, radius * 2
      );
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '80');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Main circle
    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Hover ring
    if (isHovered) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Checkmark for completed
    if (node.status === 'completed') {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.beginPath();
      ctx.moveTo(node.x - radius * 0.4, node.y);
      ctx.lineTo(node.x - radius * 0.1, node.y + radius * 0.3);
      ctx.lineTo(node.x + radius * 0.4, node.y - radius * 0.3);
      ctx.stroke();
    }

    // Label
    const fontSize = 10 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = isHovered ? '#fff' : '#94a3b8';
    ctx.fillText(node.name, node.x, node.y + radius + fontSize + 2);
  }, [hoverNode]);

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      width={800}
      height={600}
      backgroundColor="#0f172a"

      // Layout
      dagMode="lr"
      dagLevelDistance={100}
      d3VelocityDecay={0.3}

      // Nodes
      nodeCanvasObject={paintNode}
      nodeCanvasObjectMode={() => 'replace'}
      nodePointerAreaPaint={(node, color, ctx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.sqrt(node.val) * 6, 0, 2 * Math.PI);
        ctx.fill();
      }}

      // Links
      linkColor={() => '#334155'}
      linkWidth={1.5}
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.1}

      // Interaction
      onNodeClick={(node) => onTaskClick?.(node.__task)}
      onNodeHover={setHoverNode}

      // Auto-fit on load
      onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
    />
  );
}
```

### Complete 3D Roadmap Component

```jsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

const STATUS_COLORS = {
  completed: 0x22c55e,
  in_progress: 0xf59e0b,
  pending: 0x6366f1,
  blocked: 0xef4444
};

export default function RoadmapGraph3D({ tasks, onTaskClick }) {
  const graphRef = useRef();
  const [hoverNode, setHoverNode] = useState(null);

  const graphData = useMemo(() => ({
    nodes: tasks.map(task => ({
      id: task.id,
      name: task.title,
      status: task.status,
      phase: task.phase,
      val: task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1,
      __task: task
    })),
    links: tasks.flatMap(task =>
      (task.dependencies || []).map(depId => ({
        source: depId,
        target: task.id
      }))
    )
  }), [tasks]);

  // Custom 3D node
  const createNode = useCallback((node) => {
    const group = new THREE.Group();
    const radius = Math.cbrt(node.val) * 4;
    const isHovered = node === hoverNode;

    // Main sphere
    const sphereGeo = new THREE.SphereGeometry(
      radius * (isHovered ? 1.2 : 1),
      32, 32
    );
    const sphereMat = new THREE.MeshLambertMaterial({
      color: STATUS_COLORS[node.status],
      transparent: true,
      opacity: 0.9
    });
    group.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Glow for in_progress
    if (node.status === 'in_progress') {
      const glowGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: STATUS_COLORS.in_progress,
        transparent: true,
        opacity: 0.2
      });
      group.add(new THREE.Mesh(glowGeo, glowMat));
    }

    // Ring for completed
    if (node.status === 'completed') {
      const ringGeo = new THREE.TorusGeometry(radius * 1.3, 0.3, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Label
    const sprite = new SpriteText(node.name);
    sprite.color = '#e2e8f0';
    sprite.textHeight = 3;
    sprite.position.y = -radius - 5;
    group.add(sprite);

    return group;
  }, [hoverNode]);

  return (
    <ForceGraph3D
      ref={graphRef}
      graphData={graphData}
      width={800}
      height={600}
      backgroundColor="#0f172a"

      // Layout
      dagMode="lr"
      dagLevelDistance={120}
      d3VelocityDecay={0.3}

      // Nodes
      nodeThreeObject={createNode}
      nodeThreeObjectExtend={false}

      // Links
      linkColor={() => '#475569'}
      linkWidth={1}
      linkOpacity={0.6}
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleSpeed={0.005}
      linkDirectionalParticleColor={() => '#a855f7'}

      // Interaction
      onNodeClick={(node) => onTaskClick?.(node.__task)}
      onNodeHover={setHoverNode}

      // Camera
      controlType="orbit"
      onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
    />
  );
}
```

### DAG with Dynamic Orientation

```jsx
import React, { useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const DAG_MODES = [
  { value: 'lr', label: 'Left to Right' },
  { value: 'rl', label: 'Right to Left' },
  { value: 'td', label: 'Top Down' },
  { value: 'bu', label: 'Bottom Up' },
  { value: 'radialout', label: 'Radial Out' },
  { value: 'radialin', label: 'Radial In' },
  { value: null, label: 'Force Directed' }
];

export default function ConfigurableRoadmap({ tasks }) {
  const [dagMode, setDagMode] = useState('lr');
  const [levelDistance, setLevelDistance] = useState(100);

  const graphData = useMemo(() => ({
    nodes: tasks.map(t => ({ id: t.id, name: t.title, status: t.status })),
    links: tasks.flatMap(t =>
      (t.dependencies || []).map(d => ({ source: d, target: t.id }))
    )
  }), [tasks]);

  return (
    <div>
      <div className="controls">
        <select value={dagMode || ''} onChange={e => setDagMode(e.target.value || null)}>
          {DAG_MODES.map(m => (
            <option key={m.value} value={m.value || ''}>{m.label}</option>
          ))}
        </select>

        <input
          type="range"
          min="50"
          max="200"
          value={levelDistance}
          onChange={e => setLevelDistance(Number(e.target.value))}
        />
        <span>{levelDistance}px</span>
      </div>

      <ForceGraph2D
        graphData={graphData}
        dagMode={dagMode}
        dagLevelDistance={levelDistance}
        nodeColor={n => STATUS_COLORS[n.status]}
        linkDirectionalArrowLength={6}
      />
    </div>
  );
}
```

---

## Performance Considerations

### Optimization Tips

1. **Limit node count**: Best performance with <1000 nodes
2. **Use 2D for large graphs**: ForceGraph2D is faster than 3D
3. **Reduce visual complexity**:
   - Lower `nodeResolution` (3D)
   - Simpler `nodeCanvasObject` (2D)
4. **Limit particles**: `linkDirectionalParticles` affects performance
5. **Use `nodeVisibility`**: Hide nodes instead of filtering data
6. **Warm up simulation**: `warmupTicks={100}` pre-calculates positions

### Large Graph Handling

```jsx
<ForceGraph2D
  // Pre-calculate layout
  warmupTicks={200}
  cooldownTicks={0}  // Stop immediately after warmup

  // Reduce visual load
  nodeCanvasObjectMode={() => 'replace'}
  linkWidth={0.5}

  // Disable expensive features
  linkDirectionalParticles={0}
  enableNodeDrag={false}

  // Filter visibility instead of data
  nodeVisibility={node => visibleNodes.has(node.id)}
  linkVisibility={link =>
    visibleNodes.has(link.source.id) && visibleNodes.has(link.target.id)
  }
/>
```

---

## Sources

### Official Documentation
- [3d-force-graph GitHub](https://github.com/vasturiano/3d-force-graph)
- [3d-force-graph Demos](https://vasturiano.github.io/3d-force-graph/)
- [react-force-graph GitHub](https://github.com/vasturiano/react-force-graph)
- [react-force-graph Docs](https://vasturiano.github.io/react-force-graph/)

### Examples
- [Tree Layout Example](https://github.com/vasturiano/3d-force-graph/blob/master/example/tree/index.html)
- [DAG Yarn Dependencies Example](https://github.com/vasturiano/3d-force-graph/blob/master/example/dag-yarn/index.html)
- [Custom Node Shapes (Canvas)](https://github.com/vasturiano/react-force-graph/blob/master/example/custom-node-shape/index-canvas.html)
- [Custom Node Shapes (Three.js)](https://github.com/vasturiano/react-force-graph/blob/master/example/custom-node-shape/index-three.html)
- [CodeSandbox Examples](https://codesandbox.io/examples/package/react-force-graph-2d)

### Related Libraries
- [d3-force-3d](https://github.com/vasturiano/d3-force-3d) - Physics engine
- [three-spritetext](https://github.com/vasturiano/three-spritetext) - Text labels for 3D
- [three-glow-mesh](https://www.npmjs.com/package/three-glow-mesh) - Glow effects
- [fake-glow-material-threejs](https://github.com/ektogamat/fake-glow-material-threejs) - Shader-based glow

### Tutorials
- [Graph Visualization with GraphQL & react-force-graph](https://lyonwj.com/blog/graph-visualization-with-graphql-react-force-graph)
- [Creating a Force Graph using React and D3](https://dev.to/gilfink/creating-a-force-graph-using-react-and-d3-76c)
- [How to Implement a D3.js Force-directed Graph in 2025](https://dev.to/nigelsilonero/how-to-implement-a-d3js-force-directed-graph-in-2025-5cl1)
