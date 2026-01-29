# ForceGraph Visualization Proposal

> **STATUS: ARCHIVED - Reference Only**  
> These files are NOT to be imported into the application.

## Overview

This directory contains a proposed visualization system using `react-force-graph` that was explored but ultimately rejected due to performance and bundle size issues.

## Why It Was Rejected

### Bundle Size Issues
- The `react-force-graph` library adds approximately **2.9MB** to the bundle
- This significantly impacts initial load time
- The library pulls in heavy dependencies (Three.js, d3-force-3d)

### Runtime Errors
- Encountered runtime errors in production builds
- Issues with WebGL context in certain environments
- Memory leaks when rapidly switching between views

## Files Included

| File | Description |
|------|-------------|
| `types.ts` | TypeScript interfaces for graph data |
| `data.ts` | Sample roadmap data and conversion utilities |
| `RoadmapBasic.tsx` | Organic force-directed layout |
| `RoadmapDAG.tsx` | Left-to-right DAG timeline view |
| `RoadmapTree.tsx` | Top-down hierarchical tree view |
| `index.ts` | Module exports |
| `RESEARCH.md` | Detailed research notes on the library |

## Alternative Implemented

Instead of `react-force-graph`, we implemented a custom Canvas 2D visualization in `src/features/draft/DendriteViz/` which:

- Uses native HTML5 Canvas (no heavy dependencies)
- Has minimal bundle impact
- Provides similar visual appeal with custom physics
- Is more maintainable and debuggable

## Recovering This Code

These files were recovered from git commit `520136e` using:

```bash
git show 520136e:src/features/draft/ForceGraph/FILE > .claude/proposals/force-graph/FILE
```

## Usage Notes

If you want to experiment with this approach again:

1. Install the dependency: `npm install react-force-graph`
2. Copy these files to `src/features/draft/ForceGraph/`
3. Import and test in development only
4. Be aware of the bundle size implications before deploying

---

*Archived: January 2026*
