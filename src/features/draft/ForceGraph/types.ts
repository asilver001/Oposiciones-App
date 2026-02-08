/**
 * TypeScript interfaces for the Roadmap Force Graph visualization
 */

export type TaskStatus = 'completed' | 'in_progress' | 'pending' | 'blocked';

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  phase: string;
  dependencies?: string[];
  priority?: number;
}

export interface GraphNode {
  id: string;
  name: string;
  status: TaskStatus;
  phase: string;
  val: number;
  description?: string;
  __task: RoadmapTask;
}

export interface GraphLink {
  source: string;
  target: string;
  type?: 'dependency' | 'related';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface RoadmapGraphProps {
  tasks?: RoadmapTask[];
  onTaskClick?: (task: RoadmapTask) => void;
  width?: number;
  height?: number;
}

// Status color constants
export const STATUS_COLORS = {
  completed: '#10b981',   // emerald
  in_progress: '#f59e0b', // amber
  pending: '#6b7280',     // gray
  blocked: '#ef4444',     // red
} as const;

// Phase color palette for visual differentiation
export const PHASE_COLORS = {
  'Phase 1: Auth': 'var(--color-brand-500)',
  'Phase 2: Onboarding': '#06b6d4',
  'Phase 3: Study System': '#f59e0b',
  'Phase 4: Questions Bank': '#ec4899',
  'Phase 5: Progress/Stats': '#14b8a6',
  'Phase 6: Admin': '#6366f1',
  'Phase 7: Premium': '#f97316',
} as const;
