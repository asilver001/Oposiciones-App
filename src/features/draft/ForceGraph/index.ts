import { lazy } from 'react';

// Lazy-loaded component
export const RoadmapBasic = lazy(() => import('./RoadmapBasic'));

// Types
export type { RoadmapTask, TaskStatus, GraphNode, GraphLink, GraphData, RoadmapGraphProps } from './types';
export { STATUS_COLORS, PHASE_COLORS } from './types';
export { roadmapTasks, tasksToGraphData } from './data';
