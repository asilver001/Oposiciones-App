/**
 * Force Graph Roadmap Visualization Components
 *
 * Uses lazy loading to avoid increasing main bundle size.
 * Components are only loaded when actually rendered.
 */

import { lazy } from 'react';

// Lazy-loaded component (only loaded when rendered)
export const RoadmapBasic = lazy(() => import('./RoadmapBasic'));

// Types (lightweight, no lazy loading needed)
export type {
  RoadmapTask,
  TaskStatus,
  GraphNode,
  GraphLink,
  GraphData,
  RoadmapGraphProps,
} from './types';

export { STATUS_COLORS, PHASE_COLORS } from './types';

// Data utilities
export { roadmapTasks, tasksToGraphData, getDefaultGraphData } from './data';
