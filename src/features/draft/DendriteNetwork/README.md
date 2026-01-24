# Dendrite Network - Project Visualization

## Overview

The Dendrite Network is an interactive visualization tool for tracking the OpositaSmart MVP roadmap. It provides a visual representation of all project phases, tasks, dependencies, and progress.

## Features

### 3 Visualization Layouts

1. **Hierarchical** (Default)
   - Top-down layout
   - Phases at the top with tasks below
   - Best for understanding project structure

2. **Timeline**
   - Left-to-right chronological view
   - Shows progression through phases
   - Best for understanding project flow

3. **Force-Directed Network**
   - Organic circular layout
   - Shows relationships between phases
   - Best for exploring connections

### Interactive Elements

- **Phase Nodes**: Show phase status, progress, estimated/actual hours
- **Task Nodes**: Show task status, priority, description, completion date
- **Color Coding**:
  - Completed: Green
  - In Progress: Purple (animated pulse)
  - Pending: Gray
  - Blocked: Red

### Controls

- **Pan**: Click and drag background
- **Zoom**: Mouse wheel or zoom controls
- **Node Click**: Click nodes to log details (can be extended for modals)
- **MiniMap**: Overview navigation in bottom-right
- **Layout Switcher**: Toggle between 3 visualization styles

## File Structure

```
DendriteNetwork/
├── DendriteNetworkReactFlow.jsx  # Main component
├── projectState.json              # Project data from MVP_ROADMAP.md
├── components/
│   ├── PhaseNode.jsx             # Phase visualization
│   └── TaskNode.jsx              # Task visualization
└── README.md                      # This file
```

## Data Source

The visualization reads from `projectState.json`, which is generated from `/workspaces/Oposiciones-App/.claude/MVP_ROADMAP.md`.

### Updating Project Data

To update the visualization with new tasks/phases:

1. Edit the MVP_ROADMAP.md file
2. Update `projectState.json` to reflect changes
3. The visualization will automatically reflect the new data

## Integration

The Dendrite Network is integrated into the DevPanel:

- Only visible to admin users
- Accessed via "🧬 Dendrite Network" button
- Lazy loaded for performance (171KB chunk)
- Full-screen overlay with close button

## Technical Details

### Dependencies

- **reactflow**: Interactive node-based graphs
- **React 19**: Latest React features
- **Lucide React**: Icons

### Performance

- Lazy loaded using React.lazy()
- Separate chunk (171KB gzipped: 54KB)
- Suspense fallback for loading state

### Customization

To add new features:

1. **Add modal on node click**: Extend `onNodeClick` callback
2. **Add filtering**: Add filter state and filter nodes/edges
3. **Add search**: Add search input and highlight matching nodes
4. **Add export**: Use React Flow's export features

## Future Enhancements

- [ ] Task detail modal on node click
- [ ] Filter by status, priority, phase
- [ ] Search functionality
- [ ] Export as PNG/SVG
- [ ] Real-time updates from GitHub Issues
- [ ] Gantt chart view
- [ ] Critical path highlighting
- [ ] Team member assignments
- [ ] Time tracking integration

## Usage Example

```javascript
// In any component
import DendriteNetworkReactFlow from './features/draft/DendriteNetwork/DendriteNetworkReactFlow';

function MyComponent() {
  const [showDendrite, setShowDendrite] = useState(false);

  return (
    <>
      <button onClick={() => setShowDendrite(true)}>
        Show Project Map
      </button>

      {showDendrite && (
        <DendriteNetworkReactFlow onClose={() => setShowDendrite(false)} />
      )}
    </>
  );
}
```

## Statistics

- **Total Phases**: 5
- **Total Tasks**: 56
- **Completed Tasks**: 13
- **Overall Progress**: 23%
- **Estimated Total Hours**: 328h
- **Team Size**: 2 developers

---

Built with ❤️ for OpositaSmart project management
