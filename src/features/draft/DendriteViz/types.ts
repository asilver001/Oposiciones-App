/**
 * DendriteViz Types
 *
 * Type definitions for the Dendrite-style graph visualization
 */

// Node status for visual styling
export type NodeStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'not_started';

// Node size categories
export type NodeSize = 'large' | 'medium' | 'small';

// Base node interface
export interface GraphNode {
  id: string;
  label: string;
  size: NodeSize;
  status: NodeStatus;
  parentId?: string;

  // Optional metadata
  description?: string;
  progress?: number; // 0-100
  lastUpdated?: Date;
  color?: string; // Override default color
  icon?: string; // Emoji or icon name

  // Computed by physics (don't set manually)
  x?: number;
  y?: number;
  z?: number; // Depth for 3D effect
  vx?: number;
  vy?: number;
  vz?: number;
}

// Link between nodes
export interface GraphLink {
  source: string;
  target: string;
  strength?: number; // 0-1, affects physics
}

// Graph data structure
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Physics configuration
export interface PhysicsConfig {
  // Force strengths
  centerForce: number;      // Pull towards center (0-1)
  repelForce: number;       // Push nodes apart (0-500)
  linkForce: number;        // Pull linked nodes together (0-1)

  // Depth (Z-axis)
  minZ: number;             // Minimum depth (-1000 to 0)
  maxZ: number;             // Maximum depth (0 to 1000)
  zDrift: number;           // How much nodes drift in Z

  // Floating animation
  floatAmplitude: number;   // How much nodes float (px)
  floatSpeed: number;       // Speed of floating (0-1)

  // Damping
  velocityDecay: number;    // Velocity reduction per frame (0-1)
}

// Visual configuration
export interface VisualConfig {
  // Node appearance
  nodeSizes: {
    large: number;
    medium: number;
    small: number;
  };

  // Status colors
  statusColors: {
    pending: string;
    in_progress: string;
    completed: string;
    blocked: string;
    not_started: string;
  };

  // Depth effects
  minOpacity: number;       // Opacity at maxZ (0-1)
  maxOpacity: number;       // Opacity at minZ (0-1)
  minScale: number;         // Scale at maxZ (0-1)
  maxScale: number;         // Scale at minZ (0-1)

  // Links
  linkColor: string;
  linkOpacity: number;
  linkWidth: number;

  // Background
  backgroundColor: string;

  // Glow effect for completed nodes
  glowEnabled: boolean;
  glowColor: string;
  glowRadius: number;
}

// Mouse/touch interaction state
export interface InteractionState {
  mouseX: number;
  mouseY: number;
  isHovering: boolean;
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  isDragging: boolean;
  dragNodeId: string | null;
}

// Parallax configuration
export interface ParallaxConfig {
  enabled: boolean;
  strength: number;         // How much the view shifts (0-100)
  smoothing: number;        // Smoothing factor (0-1)
}

// Stats panel data
export interface StatsData {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  pending: number;
}

// Activity feed item
export interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'blocked';
  nodeId: string;
  nodeLabel: string;
  timestamp: number | Date; // Unix timestamp or Date object
  message?: string;
}

// Main component props
export interface DendriteGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  physics?: Partial<PhysicsConfig>;
  visual?: Partial<VisualConfig>;
  parallax?: Partial<ParallaxConfig>;
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  showStats?: boolean;
  showActivityFeed?: boolean;
  activityItems?: ActivityItem[];
  className?: string;
}

// Default configurations
export const DEFAULT_PHYSICS: PhysicsConfig = {
  centerForce: 0.02,
  repelForce: 150,
  linkForce: 0.3,
  minZ: -500,
  maxZ: 500,
  zDrift: 0.5,
  floatAmplitude: 3,
  floatSpeed: 0.02,
  velocityDecay: 0.92,
};

export const DEFAULT_VISUAL: VisualConfig = {
  nodeSizes: {
    large: 60,
    medium: 40,
    small: 24,
  },
  statusColors: {
    pending: '#6B7280',      // Gray
    in_progress: '#F59E0B',  // Amber
    completed: '#10B981',    // Emerald
    blocked: '#EF4444',      // Red
    not_started: '#374151',  // Dark gray
  },
  minOpacity: 0.4,
  maxOpacity: 1,
  minScale: 0.4,
  maxScale: 1,
  linkColor: '#4B5563',
  linkOpacity: 0.3,
  linkWidth: 1,
  backgroundColor: '#0F172A', // Slate 900
  glowEnabled: true,
  glowColor: '#10B981',
  glowRadius: 20,
};

export const DEFAULT_PARALLAX: ParallaxConfig = {
  enabled: true,
  strength: 30,
  smoothing: 0.1,
};
