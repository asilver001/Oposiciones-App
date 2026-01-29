import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ForceGraph2D, ForceGraphMethods } from 'react-force-graph';
import { RoadmapGraphProps, GraphNode, GraphData, STATUS_COLORS, PHASE_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapTree - Force Tree with top-down layout
 *
 * Hierarchical view with tree-like structure.
 * Larger parent nodes, clear parent-child relationships.
 * Best for: understanding project hierarchy and structure.
 */
export default function RoadmapTree({
  tasks = roadmapTasks,
  onTaskClick,
  width,
  height,
}: RoadmapGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 600 });

  // Handle responsive sizing
  useEffect(() => {
    if (!containerRef.current || width || height) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 800,
          height: clientHeight || 600,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [width, height]);

  // Convert tasks to graph data
  const baseGraphData = useMemo(() => tasksToGraphData(tasks), [tasks]);

  // Calculate node depth (for sizing) and children count
  const nodeMetadata = useMemo(() => {
    const childrenCount = new Map<string, number>();
    const depth = new Map<string, number>();

    // Count children for each node
    baseGraphData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      childrenCount.set(sourceId, (childrenCount.get(sourceId) || 0) + 1);
    });

    // Calculate depth using BFS
    const visited = new Set<string>();
    const queue: Array<{ id: string; d: number }> = [];

    // Find root nodes (nodes with no incoming edges)
    const hasIncoming = new Set(baseGraphData.links.map(l =>
      typeof l.target === 'object' ? (l.target as any).id : l.target
    ));
    baseGraphData.nodes.forEach(node => {
      if (!hasIncoming.has(node.id)) {
        queue.push({ id: node.id, d: 0 });
      }
    });

    while (queue.length > 0) {
      const { id, d } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      depth.set(id, d);

      baseGraphData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sourceId === id && !visited.has(targetId)) {
          queue.push({ id: targetId, d: d + 1 });
        }
      });
    }

    return { childrenCount, depth };
  }, [baseGraphData]);

  // Filter graph data based on collapsed nodes
  const graphData: GraphData = useMemo(() => {
    if (collapsedNodes.size === 0) return baseGraphData;

    // Find all nodes that should be hidden (descendants of collapsed nodes)
    const hiddenNodes = new Set<string>();

    const findDescendants = (nodeId: string) => {
      baseGraphData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sourceId === nodeId && !hiddenNodes.has(targetId)) {
          hiddenNodes.add(targetId);
          findDescendants(targetId);
        }
      });
    };

    collapsedNodes.forEach(nodeId => findDescendants(nodeId));

    return {
      nodes: baseGraphData.nodes.filter(n => !hiddenNodes.has(n.id)),
      links: baseGraphData.links.filter(l => {
        const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return !hiddenNodes.has(targetId);
      }),
    };
  }, [baseGraphData, collapsedNodes]);

  // Toggle node collapse on double-click
  const handleNodeDoubleClick = useCallback((node: GraphNode) => {
    const hasChildren = (nodeMetadata.childrenCount.get(node.id) || 0) > 0;
    if (!hasChildren) return;

    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }, [nodeMetadata.childrenCount]);

  // Custom node rendering with hierarchy emphasis
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = node === hoverNode;
    const isCollapsed = collapsedNodes.has(node.id);
    const childCount = nodeMetadata.childrenCount.get(node.id) || 0;
    const depth = nodeMetadata.depth.get(node.id) || 0;

    // Size based on children count and depth (parents are larger)
    const baseSize = 5 + (childCount * 1.5) + Math.max(0, (3 - depth) * 2);
    const radius = baseSize * (isHovered ? 1.2 : 1);
    const x = node.x || 0;
    const y = node.y || 0;

    // Draw glow for in_progress
    if (node.status === 'in_progress') {
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5);
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '50');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw shadow for depth
    if (childCount > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
    }

    // Draw main node
    const phaseColor = PHASE_COLORS[node.phase as keyof typeof PHASE_COLORS] || '#64748b';

    // Gradient fill for parent nodes
    if (childCount > 0) {
      const gradient = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, 0,
        x, y, radius
      );
      gradient.addColorStop(0, STATUS_COLORS[node.status]);
      gradient.addColorStop(1, adjustColor(STATUS_COLORS[node.status], -30));
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = STATUS_COLORS[node.status];
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw phase color ring for parent nodes
    if (childCount > 0) {
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }

    // Draw hover ring
    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Draw collapse indicator for nodes with children
    if (childCount > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10 / globalScale, 5)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isCollapsed ? '+' : '-', x, y);
    } else {
      // Draw status icon for leaf nodes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 / globalScale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (node.status === 'completed') {
        ctx.beginPath();
        ctx.moveTo(x - radius * 0.35, y);
        ctx.lineTo(x - radius * 0.05, y + radius * 0.3);
        ctx.lineTo(x + radius * 0.35, y - radius * 0.25);
        ctx.stroke();
      } else if (node.status === 'blocked') {
        ctx.beginPath();
        ctx.moveTo(x - radius * 0.25, y - radius * 0.25);
        ctx.lineTo(x + radius * 0.25, y + radius * 0.25);
        ctx.moveTo(x + radius * 0.25, y - radius * 0.25);
        ctx.lineTo(x - radius * 0.25, y + radius * 0.25);
        ctx.stroke();
      }
    }

    // Draw label
    const fontSize = Math.max(10 / globalScale, 4);
    ctx.font = `${childCount > 0 ? '600' : '400'} ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isHovered ? '#ffffff' : (childCount > 0 ? '#f1f5f9' : '#94a3b8');

    // Truncate and wrap if needed
    let label = node.name;
    const maxWidth = (childCount > 0 ? 120 : 90) / globalScale;
    if (ctx.measureText(label).width > maxWidth) {
      while (ctx.measureText(label + '...').width > maxWidth && label.length > 0) {
        label = label.slice(0, -1);
      }
      label += '...';
    }
    ctx.fillText(label, x, y + radius + fontSize * 0.5);

    // Draw children count badge
    if (childCount > 0 && !isCollapsed) {
      const badgeX = x + radius * 0.7;
      const badgeY = y - radius * 0.7;
      const badgeRadius = Math.max(7 / globalScale, 4);

      ctx.fillStyle = phaseColor;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(8 / globalScale, 3)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(childCount), badgeX, badgeY);
    }
  }, [hoverNode, collapsedNodes, nodeMetadata]);

  // Define clickable area
  const nodePointerArea = useCallback((node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
    const childCount = nodeMetadata.childrenCount.get(node.id) || 0;
    const depth = nodeMetadata.depth.get(node.id) || 0;
    const baseSize = 5 + (childCount * 1.5) + Math.max(0, (3 - depth) * 2);
    const radius = baseSize + 5;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 * Math.PI);
    ctx.fill();
  }, [nodeMetadata]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onTaskClick) {
      onTaskClick(node.__task);
    }
  }, [onTaskClick]);

  // Zoom to fit on load
  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(400, 80);
  }, []);

  // Handle DAG errors
  const handleDagError = useCallback((loopNodeIds: string[]) => {
    console.warn('Cycle detected in tree:', loopNodeIds);
    return false;
  }, []);

  // Generate tooltip content
  const getNodeLabel = useCallback((node: GraphNode) => {
    const childCount = nodeMetadata.childrenCount.get(node.id) || 0;
    const isCollapsed = collapsedNodes.has(node.id);
    const statusEmoji = {
      completed: '✓',
      in_progress: '◐',
      pending: '○',
      blocked: '✕',
    };

    return `
      <div style="
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 12px;
        max-width: 280px;
        font-family: Inter, system-ui, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      ">
        <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 4px; font-size: 14px;">
          ${statusEmoji[node.status]} ${node.name}
        </div>
        <div style="
          display: inline-block;
          font-size: 11px;
          color: #cbd5e1;
          background: ${PHASE_COLORS[node.phase as keyof typeof PHASE_COLORS] || '#64748b'}30;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        ">
          ${node.phase}
        </div>
        ${node.description ? `
          <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
            ${node.description}
          </div>
        ` : ''}
        ${childCount > 0 ? `
          <div style="
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #334155;
            font-size: 11px;
            color: #64748b;
          ">
            ${childCount} dependent task${childCount > 1 ? 's' : ''} ${isCollapsed ? '(collapsed)' : ''}
            <br/>
            <span style="color: #94a3b8;">Double-click to ${isCollapsed ? 'expand' : 'collapse'}</span>
          </div>
        ` : ''}
        <div style="
          margin-top: 8px;
          font-size: 12px;
          font-weight: 500;
          color: ${STATUS_COLORS[node.status]};
        ">
          ${node.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>
    `;
  }, [nodeMetadata, collapsedNodes]);

  return (
    <div
      ref={containerRef}
      style={{
        width: width || '100%',
        height: height || '100%',
        minHeight: 400,
        background: '#0a0a0f',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '8px',
        padding: '10px 14px',
        zIndex: 10,
        fontSize: '11px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>Phases</div>
        {Object.entries(PHASE_COLORS).slice(0, 5).map(([phase, color]) => (
          <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
            }} />
            <span style={{ color: '#cbd5e1', fontSize: '10px' }}>
              {phase.replace(/Phase \d+: /, '')}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '6px',
        padding: '6px 12px',
        zIndex: 10,
        fontSize: '11px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#64748b',
      }}>
        Double-click parent nodes to collapse/expand
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0f"
        // Tree layout - top to bottom
        dagMode="td"
        dagLevelDistance={120}
        onDagError={handleDagError}
        // Force configuration for tree-like appearance
        d3VelocityDecay={0.4}
        d3AlphaDecay={0.025}
        warmupTicks={120}
        cooldownTicks={200}
        // Node styling
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={nodePointerArea}
        nodeLabel={getNodeLabel}
        // Link styling
        linkColor={() => 'rgba(100, 116, 139, 0.3)'}
        linkWidth={1.5}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={0.9}
        linkDirectionalArrowColor={() => 'rgba(148, 163, 184, 0.5)'}
        linkCurvature={0}
        // Interaction
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        onNodeDblClick={handleNodeDoubleClick}
        enableNodeDrag={true}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
