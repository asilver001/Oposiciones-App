import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ForceGraph2D, ForceGraphMethods } from 'react-force-graph';
import { RoadmapGraphProps, GraphNode, STATUS_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapBasic - Basic force-directed layout
 *
 * Organic, exploratory view with physics-based positioning.
 * Nodes naturally cluster based on connections.
 * Best for: exploring relationships without strict hierarchy.
 */
export default function RoadmapBasic({
  tasks = roadmapTasks,
  onTaskClick,
  width,
  height,
}: RoadmapGraphProps) {
  const graphRef = useRef<ForceGraphMethods>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
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

  // Custom node rendering with status colors and hover states
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = node === hoverNode;
    const baseRadius = Math.sqrt(node.val || 1) * 5;
    const radius = baseRadius * (isHovered ? 1.3 : 1);
    const x = node.x || 0;
    const y = node.y || 0;

    // Draw glow effect for in_progress nodes
    if (node.status === 'in_progress') {
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5);
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '60');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw main circle
    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw hover ring
    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Draw checkmark for completed nodes
    if (node.status === 'completed') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.4, y);
      ctx.lineTo(x - radius * 0.1, y + radius * 0.3);
      ctx.lineTo(x + radius * 0.4, y - radius * 0.25);
      ctx.stroke();
    }

    // Draw X for blocked nodes
    if (node.status === 'blocked') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.3, y - radius * 0.3);
      ctx.lineTo(x + radius * 0.3, y + radius * 0.3);
      ctx.moveTo(x + radius * 0.3, y - radius * 0.3);
      ctx.lineTo(x - radius * 0.3, y + radius * 0.3);
      ctx.stroke();
    }

    // Draw label
    const fontSize = Math.max(10 / globalScale, 3);
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isHovered ? '#ffffff' : '#94a3b8';
    ctx.fillText(node.name, x, y + radius + fontSize * 0.5);
  }, [hoverNode]);

  // Define clickable area
  const nodePointerArea = useCallback((node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
    const radius = Math.sqrt(node.val || 1) * 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onTaskClick) {
      onTaskClick(node.__task);
    }
  }, [onTaskClick]);

  // Zoom to fit on load
  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(400, 50);
  }, []);

  // Generate tooltip content
  const getNodeLabel = useCallback((node: GraphNode) => {
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
        max-width: 250px;
        font-family: Inter, system-ui, sans-serif;
      ">
        <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 4px;">
          ${statusEmoji[node.status]} ${node.name}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
          ${node.phase}
        </div>
        ${node.description ? `
          <div style="font-size: 12px; color: #cbd5e1;">
            ${node.description}
          </div>
        ` : ''}
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #334155;
          font-size: 11px;
          color: ${STATUS_COLORS[node.status]};
          text-transform: uppercase;
        ">
          ${node.status.replace('_', ' ')}
        </div>
      </div>
    `;
  }, []);

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
      }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0f"
        // Force configuration for organic layout
        d3VelocityDecay={0.4}
        d3AlphaDecay={0.02}
        warmupTicks={100}
        cooldownTicks={200}
        // Node styling
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={nodePointerArea}
        nodeLabel={getNodeLabel}
        // Link styling
        linkColor={() => 'rgba(100, 116, 139, 0.4)'}
        linkWidth={1.5}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={() => 'rgba(148, 163, 184, 0.6)'}
        linkCurvature={0.1}
        // Interaction
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        enableNodeDrag={true}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
}
