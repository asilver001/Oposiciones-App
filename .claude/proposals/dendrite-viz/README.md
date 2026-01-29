# DendriteViz - Canvas 2D Graph Visualization (Proposal)

## Status: ARCHIVED / NOT IN USE

This directory contains reference code for a Canvas 2D-based graph visualization system that was attempted but **caused issues with the app bundle size**.

## Why This Is Here

These files are preserved as a **reference proposal only**. They should **NOT** be imported into the main application.

## What This Was

DendriteViz was an attempt to create an interactive graph visualization using:
- HTML5 Canvas 2D for rendering
- Custom physics simulation for node positioning
- Parallax effects for depth
- Three visualization modes:
  - **DendriteGraph**: Abstract neural network visualization
  - **DevRoadmap**: Development progress roadmap
  - **OpositaUniverse**: Space-themed progress visualization

## Why It Was Removed

1. **Bundle size impact**: The Canvas 2D implementation added significant weight to the bundle
2. **Complexity**: Custom physics and rendering logic was difficult to maintain
3. **Performance concerns**: Canvas rendering on mobile devices was problematic

## Files

| File | Description |
|------|-------------|
| `types.ts` | TypeScript interfaces for nodes, edges, and graph data |
| `useGraphPhysics.ts` | Custom hook for physics-based node positioning |
| `useParallax.ts` | Custom hook for parallax scrolling effects |
| `DendriteGraph.tsx` | Main Canvas 2D graph component |
| `DevRoadmap.tsx` | Development roadmap visualization |
| `OpositaUniverse.tsx` | Space-themed universe visualization |
| `index.ts` | Barrel exports |

## Alternative

The current visualization approach uses `ForceGraph` in `src/features/draft/ForceGraph/` which provides similar functionality with better library support.

## Recovered From

- **Commit:** `ddd614b`
- **Message:** `feat(DendriteViz): add Canvas 2D graph visualization system`
- **Date:** Recovered January 2026

---

**DO NOT IMPORT THESE FILES INTO THE APPLICATION**
