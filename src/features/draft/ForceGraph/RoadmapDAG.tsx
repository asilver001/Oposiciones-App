import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { RoadmapGraphProps, GraphNode, STATUS_COLORS, PHASE_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapDAG - Directed Acyclic Graph with left-to-right layout
 *
 * Horizontal timeline view with clear phase columns.
 * Tasks flow from left (start) to right (completion).
 * Best for: visualizing task dependencies and project timeline.
 */
export default function RoadmapDAG({
  tasks = roadmapTasks,
  onTaskClick,
  width,
  height,
}: RoadmapGraphProps) {
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
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
  const graphData = useMemo(() => tasksToGraphData(tasks), [tasks]);

  // Track connected links for highlighting
  const nodeLinks = useMemo(() => {
    const map = new Map<string, Set<string>>();
    graphData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      const linkKey = `${sourceId}-${targetId}`;

      if (!map.has(sourceId)) map.set(sourceId, new Set());
      if (!map.has(targetId)) map.set(targetId, new Set());
      map.get(sourceId)!.add(linkKey);
      map.get(targetId)!.add(linkKey);
    });
    return map;
  }, [graphData.links]);

  // Handle hover to highlight connected links
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoverNode(node);
    if (node) {
      setHighlightLinks(nodeLinks.get(node.id) || new Set());
    } else {
      setHighlightLinks(new Set());
    }
  }, [nodeLinks]);

  // Custom node rendering with status colors and glow effects
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = node === hoverNode;
    const baseRadius = Math.sqrt(node.val || 1) * 6;
    const radius = baseRadius * (isHovered ? 1.2 : 1);
    const x = node.x || 0;
    const y = node.y || 0;

    // Draw glow effect for in_progress nodes (pulsing effect)
    if (node.status === 'in_progress') {
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 3);
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '50');
      gradient.addColorStop(0.5, STATUS_COLORS.in_progress + '20');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3, 0, 2 * Math.PI);
      ctx.fill();

      // Inner ring
      ctx.strokeStyle = STATUS_COLORS.in_progress;
      ctx.lineWidth = 2 / globalScale;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4 / globalScale, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw phase-colored background ring
    const phaseColor = PHASE_COLORS[node.phase as keyof typeof PHASE_COLORS] || '#64748b';
    ctx.strokeStyle = phaseColor + '60';
    ctx.lineWidth = 3 / globalScale;
    ctx.beginPath();
    ctx.arc(x, y, radius + 1, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw main circle
    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw hover highlight
    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Draw status icon
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2 / globalScale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (node.status === 'completed') {
      // Checkmark
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.35, y);
      ctx.lineTo(x - radius * 0.05, y + radius * 0.3);
      ctx.lineTo(x + radius * 0.4, y - radius * 0.25);
      ctx.stroke();
    } else if (node.status === 'blocked') {
      // X mark
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.3, y - radius * 0.3);
      ctx.lineTo(x + radius * 0.3, y + radius * 0.3);
      ctx.moveTo(x + radius * 0.3, y - radius * 0.3);
      ctx.lineTo(x - radius * 0.3, y + radius * 0.3);
      ctx.stroke();
    } else if (node.status === 'in_progress') {
      // Half-filled circle (progress indicator)
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.4, 0, Math.PI, true);
      ctx.fill();
    }

    // Draw label below node
    const fontSize = Math.max(11 / globalScale, 4);
    ctx.font = `500 ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isHovered ? '#ffffff' : '#e2e8f0';

    // Truncate long names
    const maxWidth = 100 / globalScale;
    let label = node.name;
    if (ctx.measureText(label).width > maxWidth) {
      while (ctx.measureText(label + '...').width > maxWidth && label.length > 0) {
        label = label.slice(0, -1);
      }
      label += '...';
    }
    ctx.fillText(label, x, y + radius + fontSize * 0.6);
  }, [hoverNode]);

  // Define clickable area
  const nodePointerArea = useCallback((node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
    const radius = Math.sqrt(node.val || 1) * 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  // Link color based on highlight state
  const getLinkColor = useCallback((link: any) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const linkKey = `${sourceId}-${targetId}`;

    if (highlightLinks.has(linkKey)) {
      return 'rgba(139, 92, 246, 0.8)'; // Purple highlight
    }
    return 'rgba(100, 116, 139, 0.35)';
  }, [highlightLinks]);

  // Link width based on highlight state
  const getLinkWidth = useCallback((link: any) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const linkKey = `${sourceId}-${targetId}`;

    return highlightLinks.has(linkKey) ? 2.5 : 1.5;
  }, [highlightLinks]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onTaskClick) {
      onTaskClick(node.__task);
    }
  }, [onTaskClick]);

  // Zoom to fit on load
  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(400, 60);
  }, []);

  // Handle DAG errors (cycles)
  const handleDagError = useCallback((loopNodeIds: string[]) => {
    console.warn('Cycle detected in roadmap:', loopNodeIds);
    return false; // Suppress exception
  }, []);

  // Generate tooltip content
  const getNodeLabel = useCallback((node: GraphNode) => {
    const statusEmoji = {
      completed: '✓',
      in_progress: '◐',
      pending: '○',
      blocked: '✕',
    };
    const deps = tasks.find(t => t.id === node.id)?.dependencies || [];
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
        ${deps.length > 0 ? `
          <div style="
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #334155;
            font-size: 11px;
            color: #64748b;
          ">
            Depends on: ${deps.length} task${deps.length > 1 ? 's' : ''}
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
  }, [tasks]);

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
        right: 12,
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '8px',
        padding: '10px 14px',
        zIndex: 10,
        fontSize: '11px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>Status</div>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: color,
            }} />
            <span style={{ color: '#cbd5e1', textTransform: 'capitalize' }}>
              {status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0f"
        // DAG layout - left to right
        dagMode="lr"
        dagLevelDistance={140}
        onDagError={handleDagError}
        // Force configuration
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        warmupTicks={100}
        cooldownTicks={150}
        // Node styling
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={nodePointerArea}
        nodeLabel={getNodeLabel}
        // Link styling
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkDirectionalArrowLength={7}
        linkDirectionalArrowRelPos={0.95}
        linkDirectionalArrowColor={() => 'rgba(148, 163, 184, 0.7)'}
        linkCurvature={0.15}
        // Animated particles on links
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.008}
        linkDirectionalParticleColor={() => '#8b5cf6'}
        // Interaction
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        enableNodeDrag={true}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
}
