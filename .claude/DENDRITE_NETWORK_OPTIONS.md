# Dendrite Network Visualization Options

## Overview

The Dendrite Network now features **9 different visualization layouts** with enhanced node components featuring gradients, animations, and interactive elements inspired by modern network visualizations.

## New Components

### Enhanced Node Components

#### PhaseNodeEnhanced
- Gradient backgrounds based on status
- Progress ring animation
- Phase-specific emojis (🔐, 🏗️, 🎨, ⚙️, 🧪, 🚀)
- Animated pulse for in-progress phases
- Task count badge
- Status-specific glow effects

**Status Colors:**
- Completed: Emerald (green) gradient
- In Progress: Purple gradient with pulse
- Pending: Gray gradient
- Blocked: Red gradient

#### TaskNodeEnhanced
- Avatar-style circular badges
- Priority-based colored borders (P0: red, P1: orange, P2: yellow)
- Status icons with animations (spinning loader for in-progress)
- Hover tooltips with full task details
- Gradient backgrounds
- Pulse animation for active tasks

## 9 Visualization Layouts

### 1. Hierarchical (Original)
**Icon:** LayoutGrid
**Description:** Vista clásica por fases

Classic top-to-bottom layout showing phases with tasks arranged in a grid below each phase. Best for understanding the sequential structure of the project.

### 2. Timeline (Original)
**Icon:** Calendar
**Description:** Línea temporal horizontal

Horizontal timeline showing phases connected in sequence with tasks cascading vertically below each phase. Ideal for understanding project progression over time.

### 3. Force-Directed / Red Circular (Original)
**Icon:** Network
**Description:** Fases en círculo

Phases arranged in a circle with tasks clustered around their respective phases. Good for seeing relationships between phases and their tasks.

### 4. Radial Burst ⭐ NEW
**Icon:** Sparkles
**Description:** Explosión radial desde el centro

**Algorithm:** `radialBurstLayout`

Phases radiate from the center like spokes of a wheel. Completed phases move closer to the center, while active phases stay on the outer ring. Tasks burst outward from their phases.

**Best for:**
- Visualizing project maturity (completed work moves inward)
- Seeing active vs completed work distribution
- Dramatic presentation of project status

**Features:**
- Dynamic radius based on completion status
- 360° distribution of phases
- Tasks fan out in sectors

### 5. Galaxy Spiral ⭐ NEW
**Icon:** Orbit
**Description:** Espiral galáctica

**Algorithm:** `galaxySpiralLayout`

Phases follow a spiral pattern from the center outward, like a galaxy. Tasks orbit around their parent phase like planets around a star.

**Best for:**
- Sequential phase visualization
- Understanding project evolution
- Aesthetically pleasing presentations

**Features:**
- Spiral factor increases with phase index
- Each phase has its own orbital system
- Natural flow from early to late phases

### 6. Organic Clusters ⭐ NEW
**Icon:** Droplets
**Description:** Agrupación física natural

**Algorithm:** `organicClustersLayout` (uses D3 force simulation)

Uses physics-based force simulation to naturally cluster related tasks around their phases. Nodes repel each other while staying connected, creating an organic, natural layout.

**Best for:**
- Discovering natural groupings
- Minimizing edge crossings
- Understanding task relationships

**Features:**
- D3 force simulation with 300 iterations
- Collision detection
- Attraction to phase centers
- Natural spacing between all nodes

**Physics Forces:**
- Link force: Connects tasks to phases (distance: 150)
- Charge force: Nodes repel each other (strength: -300)
- Center force: Pulls toward canvas center
- Collision force: Prevents overlap

### 7. Swim Lanes ⭐ NEW
**Icon:** Rows
**Description:** Carriles por estado

**Algorithm:** `swimLanesLayout`

Organizes tasks into horizontal swim lanes based on their status (completed, in-progress, pending, blocked). Phases appear as markers on the left side.

**Best for:**
- Kanban-style workflow visualization
- Status-based task management
- Quick status overview

**Features:**
- 4 horizontal lanes (one per status)
- Phase markers on left edge
- Tasks arranged horizontally within lanes
- Clear status separation

**Lanes (top to bottom):**
1. Completed (green zone)
2. In Progress (purple zone)
3. Pending (gray zone)
4. Blocked (red zone)

### 8. Network Graph ⭐ NEW
**Icon:** Share2
**Description:** Red social completa

**Algorithm:** `networkGraphLayout` (uses D3 force simulation)

Creates a complete network graph showing all relationships: phase-to-task connections, task dependencies, and phase sequences. Similar to social network visualizations.

**Best for:**
- Understanding all dependencies
- Seeing the complete project network
- Identifying critical paths
- Complex dependency analysis

**Features:**
- Shows task dependencies (animated orange edges)
- Shows phase sequences (dashed purple edges)
- Phase-task connections (standard edges)
- Stronger force simulation (400 iterations)
- Variable edge distances based on relationship type

**Edge Types:**
- Phase connections: Purple dashed (strokeWidth: 3)
- Task dependencies: Orange animated (strokeWidth: 2)
- Phase-task links: Gray subtle (strokeWidth: 1)

### 9. Matrix View ⭐ NEW
**Icon:** Grid3x3
**Description:** Vista de cuadrícula

**Algorithm:** `matrixViewLayout`

Grid-based layout where rows represent phases and columns represent task statuses. Creates a clear matrix showing where all tasks fall in the phase-status space.

**Best for:**
- Quick overview of project distribution
- Identifying bottlenecks (empty cells)
- Balanced workload analysis
- Management dashboards

**Features:**
- Rows = Phases (Phase 0 to Phase 5)
- Columns = Status (Pending, In Progress, Completed, Blocked)
- Phase headers on left edge
- Clear grid structure
- Easy to spot patterns

## Technical Implementation

### File Structure

```
src/features/draft/DendriteNetwork/
├── DendriteNetworkReactFlow.jsx       # Main component
├── components/
│   ├── PhaseNode.jsx                  # Original phase node
│   ├── TaskNode.jsx                   # Original task node
│   ├── PhaseNodeEnhanced.jsx         # NEW: Enhanced phase node
│   └── TaskNodeEnhanced.jsx          # NEW: Enhanced task node
└── layouts/
    ├── radialBurst.js                # NEW: Radial burst layout
    ├── galaxySpiral.js               # NEW: Galaxy spiral layout
    ├── organicClusters.js            # NEW: Organic clusters (D3)
    ├── swimLanes.js                  # NEW: Swim lanes layout
    ├── networkGraph.js               # NEW: Network graph (D3)
    └── matrixView.js                 # NEW: Matrix view layout
```

### Dependencies

```json
{
  "d3-force": "^3.0.0",    // For physics simulations
  "d3-scale": "^4.0.2",    // For scaling calculations
  "framer-motion": "^12.26.2",  // For animations
  "reactflow": "^11.11.4"  // For graph rendering
}
```

### Node Types

The component now supports 4 node types:

```javascript
const nodeTypes = {
  phase: PhaseNode,              // Original simple phase
  task: TaskNode,                // Original simple task
  phaseEnhanced: PhaseNodeEnhanced,  // NEW: Fancy phase
  taskEnhanced: TaskNodeEnhanced,    // NEW: Fancy task
};
```

## UI Components

### Layout Selector Panel

Located at bottom-left of the visualization:

- 3x3 grid of layout buttons
- Active layout highlighted with purple gradient
- Hover tooltips with descriptions
- Icons for quick recognition
- Smooth transitions between layouts

### Enhanced Features

**Phase Nodes:**
- Animated progress rings (SVG circle with stroke-dasharray)
- Status-based gradient backgrounds
- Pulsing animation for in-progress
- Checkmark icon for completed
- Task count badge (top-right corner)

**Task Nodes:**
- Priority badges (top-left)
- Status icons (top-right) with spin animation
- Hover tooltips with full details
- Gradient backgrounds by priority
- Pulse border for in-progress tasks

## Performance Considerations

### D3 Force Simulations

For `organicClusters` and `networkGraph`:

- Pre-computed layouts (not real-time simulation)
- Limited to 300-400 ticks for performance
- Results cached until layout change
- No ongoing animation overhead

### Framer Motion Animations

- CSS-based transitions (GPU accelerated)
- Conditional animations (only active tasks pulse)
- Optimized for 60fps
- No layout thrashing

## Usage Example

```javascript
import DendriteNetworkReactFlow from './features/draft/DendriteNetwork/DendriteNetworkReactFlow';

function App() {
  const [showNetwork, setShowNetwork] = useState(false);

  return (
    <>
      <button onClick={() => setShowNetwork(true)}>
        Ver Dendrite Network
      </button>

      {showNetwork && (
        <DendriteNetworkReactFlow
          onClose={() => setShowNetwork(false)}
        />
      )}
    </>
  );
}
```

## Future Enhancements

Potential improvements:

1. **3D Visualization** - Three.js integration for 3D network graphs
2. **Time Machine** - Replay project evolution over time
3. **Heat Maps** - Color code by time spent, complexity, etc.
4. **Zoom to Fit** - Auto-focus on specific phases/tasks
5. **Export** - Save layouts as SVG/PNG
6. **Custom Layouts** - User-defined layout algorithms
7. **Real-time Collaboration** - Multi-user cursors and selections
8. **Search & Filter** - Find tasks, filter by criteria
9. **Grouping** - Collapse/expand phases
10. **Critical Path** - Highlight longest dependency chain

## Accessibility

- High contrast mode support
- Screen reader labels on all interactive elements
- Keyboard navigation
- Focus indicators
- ARIA labels for status

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (some animation differences)
- Mobile: Touch gestures supported

## Credits

Inspired by:
- D3.js force layouts
- Figma's component network view
- GitHub's dependency graphs
- Social network visualizations
- Modern data visualization tools

---

**Created:** 2026-01-25
**Version:** 1.0
**Status:** Production Ready
