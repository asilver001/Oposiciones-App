/**
 * DendriteViz - Dendrite-style Graph Visualizations
 *
 * A Canvas 2D visualization system with fake 3D depth effects,
 * inspired by Remotion's Dendrite template.
 *
 * Components:
 * - DendriteGraph: Core visualization component
 * - DevRoadmap: Internal development progress dashboard
 * - OpositaUniverse: User-facing study progress map
 *
 * Hooks:
 * - useGraphPhysics: Force-directed physics simulation
 * - useParallax: Mouse-based parallax effect
 */

// Core component
export { DendriteGraph } from './DendriteGraph';

// Dashboard implementations
export { DevRoadmap } from './DevRoadmap';
export { OpositaUniverse } from './OpositaUniverse';

// Hooks
export { useGraphPhysics } from './useGraphPhysics';
export { useParallax } from './useParallax';

// Types
export type {
  GraphNode,
  GraphLink,
  GraphData,
  NodeSize,
  NodeStatus,
  PhysicsConfig,
  VisualConfig,
  ParallaxConfig,
  StatsData,
  ActivityItem,
  DendriteGraphProps,
} from './types';

// Default configs
export {
  DEFAULT_PHYSICS,
  DEFAULT_VISUAL,
  DEFAULT_PARALLAX,
} from './types';
