/**
 * DendriteGraph Component
 *
 * A Dendrite-style force-directed graph visualization with:
 * - Fake 3D depth effect using scale and opacity
 * - Organic floating animation
 * - Mouse parallax
 * - Interactive nodes with hover/click
 */

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useGraphPhysics } from './useGraphPhysics';
import { useParallax } from './useParallax';
import type {
  DendriteGraphProps,
  GraphNode,
  PhysicsConfig,
  VisualConfig,
  StatsData,
  ActivityItem,
} from './types';
import { DEFAULT_PHYSICS, DEFAULT_VISUAL, DEFAULT_PARALLAX } from './types';

// Stats Panel Component
function StatsPanel({ stats }: { stats: StatsData }) {
  return (
    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-6 text-sm font-mono">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wider">Total</div>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wider">Completados</div>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wider">En Progreso</div>
        </div>
        {stats.blocked > 0 && (
          <>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.blocked}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Bloqueados</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Activity Feed Component
function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed': return '✓';
      case 'created': return '+';
      case 'updated': return '↻';
      case 'blocked': return '⚠';
      default: return '•';
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed': return 'text-emerald-400';
      case 'created': return 'text-cyan-400';
      case 'updated': return 'text-amber-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10 max-w-xs">
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Actividad Reciente</div>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {items.slice(0, 5).map(item => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <span className={`font-bold ${getActivityColor(item.type)}`}>
              {getActivityIcon(item.type)}
            </span>
            <span className="text-white truncate">{item.nodeLabel}</span>
            <span className="text-gray-500 text-[10px]">
              {new Date(item.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Node tooltip
function NodeTooltip({
  node,
  x,
  y,
}: {
  node: GraphNode;
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute pointer-events-none z-50 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 text-sm transform -translate-x-1/2 -translate-y-full"
      style={{ left: x, top: y - 10 }}
    >
      <div className="font-semibold text-white">{node.label}</div>
      {node.description && (
        <div className="text-gray-400 text-xs mt-0.5">{node.description}</div>
      )}
      {node.progress !== undefined && (
        <div className="mt-1.5">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${node.progress}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">{node.progress}% completado</div>
        </div>
      )}
    </div>
  );
}

// Main DendriteGraph Component
export function DendriteGraph({
  data,
  width: propWidth,
  height: propHeight,
  physics: physicsConfig,
  visual: visualConfig,
  parallax: parallaxConfig,
  onNodeClick,
  onNodeHover,
  showStats = false,
  showActivityFeed = false,
  activityItems = [],
  className = '',
}: DendriteGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Merge configs with defaults
  const physics: PhysicsConfig = useMemo(
    () => ({ ...DEFAULT_PHYSICS, ...physicsConfig }),
    [physicsConfig]
  );
  const visual: VisualConfig = useMemo(
    () => ({ ...DEFAULT_VISUAL, ...visualConfig }),
    [visualConfig]
  );
  const parallax = useMemo(
    () => ({ ...DEFAULT_PARALLAX, ...parallaxConfig }),
    [parallaxConfig]
  );

  // Container dimensions
  const [dimensions, setDimensions] = useState({ width: propWidth || 800, height: propHeight || 600 });

  // Track nodes with positions
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  // Interaction state
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Setup parallax
  const { getNodeOffset } = useParallax({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    config: parallax,
  });

  // Setup physics
  const { setNodePosition } = useGraphPhysics({
    nodes: data.nodes,
    links: data.links,
    width: dimensions.width,
    height: dimensions.height,
    config: physics,
    onUpdate: setNodes,
  });

  // Calculate stats
  const stats: StatsData = useMemo(() => {
    return data.nodes.reduce(
      (acc, node) => {
        acc.total++;
        switch (node.status) {
          case 'completed':
            acc.completed++;
            break;
          case 'in_progress':
            acc.inProgress++;
            break;
          case 'blocked':
            acc.blocked++;
            break;
          case 'pending':
            acc.pending++;
            break;
        }
        return acc;
      },
      { total: 0, completed: 0, inProgress: 0, blocked: 0, pending: 0 }
    );
  }, [data.nodes]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || propWidth || propHeight) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  // Get visual properties based on Z depth
  const getNodeVisuals = useCallback(
    (node: GraphNode) => {
      const z = node.z ?? 0;
      const zRange = physics.maxZ - physics.minZ || 1;
      const normalizedZ = (z - physics.minZ) / zRange; // 0 = back, 1 = front

      const scale = visual.minScale + normalizedZ * (visual.maxScale - visual.minScale);
      const opacity = visual.minOpacity + normalizedZ * (visual.maxOpacity - visual.minOpacity);

      const baseSize = visual.nodeSizes[node.size];
      const size = baseSize * scale;

      const color = node.color || visual.statusColors[node.status];

      return { size, opacity, color, scale };
    },
    [physics.minZ, physics.maxZ, visual]
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = visual.backgroundColor;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Sort nodes by Z (back to front)
    const sortedNodes = [...nodes].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

    // Draw links first
    ctx.strokeStyle = visual.linkColor;
    ctx.lineWidth = visual.linkWidth;
    ctx.globalAlpha = visual.linkOpacity;

    data.links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;

      const sourceOffset = getNodeOffset(source.z ?? 0, physics.minZ, physics.maxZ);
      const targetOffset = getNodeOffset(target.z ?? 0, physics.minZ, physics.maxZ);

      ctx.beginPath();
      ctx.moveTo((source.x ?? 0) + sourceOffset.x, (source.y ?? 0) + sourceOffset.y);
      ctx.lineTo((target.x ?? 0) + targetOffset.x, (target.y ?? 0) + targetOffset.y);
      ctx.stroke();
    });

    // Draw nodes
    sortedNodes.forEach(node => {
      const { size, opacity, color } = getNodeVisuals(node);
      const offset = getNodeOffset(node.z ?? 0, physics.minZ, physics.maxZ);

      const x = (node.x ?? 0) + offset.x;
      const y = (node.y ?? 0) + offset.y;

      ctx.globalAlpha = opacity;

      // Glow effect for completed nodes
      if (visual.glowEnabled && node.status === 'completed') {
        const gradient = ctx.createRadialGradient(x, y, size / 2, x, y, size + visual.glowRadius);
        gradient.addColorStop(0, visual.glowColor + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size + visual.glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Icon/emoji in center
      if (node.icon) {
        ctx.globalAlpha = opacity * 0.9;
        ctx.font = `${size * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(node.icon, x, y);
      }
    });

    ctx.globalAlpha = 1;
  }, [nodes, data.links, dimensions, visual, physics, getNodeVisuals, getNodeOffset]);

  // Handle mouse events
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Check if hovering over a node
      const hovered = nodes.find(node => {
        const { size } = getNodeVisuals(node);
        const offset = getNodeOffset(node.z ?? 0, physics.minZ, physics.maxZ);
        const nodeX = (node.x ?? 0) + offset.x;
        const nodeY = (node.y ?? 0) + offset.y;
        const dist = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
        return dist < size / 2;
      });

      setHoveredNode(hovered || null);
      onNodeHover?.(hovered || null);
    },
    [nodes, getNodeVisuals, getNodeOffset, physics.minZ, physics.maxZ, onNodeHover]
  );

  const handleClick = useCallback(() => {
    if (hoveredNode) {
      onNodeClick?.(hoveredNode);
    }
  }, [hoveredNode, onNodeClick]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: propWidth || '100%',
        height: propHeight || '100%',
        cursor: hoveredNode ? 'pointer' : 'default',
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      />

      {/* Stats Panel */}
      {showStats && <StatsPanel stats={stats} />}

      {/* Activity Feed */}
      {showActivityFeed && activityItems.length > 0 && (
        <ActivityFeed items={activityItems} />
      )}

      {/* Tooltip */}
      {hoveredNode && (
        <NodeTooltip node={hoveredNode} x={mousePos.x} y={mousePos.y} />
      )}
    </div>
  );
}

export default DendriteGraph;
