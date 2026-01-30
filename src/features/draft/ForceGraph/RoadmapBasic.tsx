import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { RoadmapGraphProps, GraphNode, STATUS_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapBasic - Basic force-directed layout
 *
 * Organic, exploratory view with physics-based positioning.
 * Nodes naturally cluster based on connections.
 */
export default function RoadmapBasic({
  tasks = roadmapTasks,
  onTaskClick,
  width,
  height,
}: RoadmapGraphProps) {
  // SSR check - ForceGraph requires window
  if (typeof window === 'undefined') {
    return <div style={{ width: '100%', height: '100%', background: '#0a0a0f' }} />;
  }

  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 600 });

  useEffect(() => {
    if (!containerRef.current || width || height) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 600,
        });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [width, height]);

  const graphData = useMemo(() => tasksToGraphData(tasks), [tasks]);

  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = node === hoverNode;
    const baseRadius = Math.sqrt(node.val || 1) * 5;
    const radius = baseRadius * (isHovered ? 1.3 : 1);
    const x = node.x || 0;
    const y = node.y || 0;

    if (node.status === 'in_progress') {
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5);
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '60');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    if (node.status === 'completed') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - radius * 0.4, y);
      ctx.lineTo(x - radius * 0.1, y + radius * 0.3);
      ctx.lineTo(x + radius * 0.4, y - radius * 0.25);
      ctx.stroke();
    }

    const fontSize = Math.max(10 / globalScale, 3);
    ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = isHovered ? '#ffffff' : '#94a3b8';
    ctx.fillText(node.name, x, y + radius + fontSize * 0.5);
  }, [hoverNode]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onTaskClick) onTaskClick(node.__task);
  }, [onTaskClick]);

  const handleEngineStop = useCallback(() => {
    graphRef.current?.zoomToFit(400, 50);
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
        d3VelocityDecay={0.4}
        d3AlphaDecay={0.02}
        warmupTicks={100}
        cooldownTicks={200}
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        linkColor={() => 'rgba(100, 116, 139, 0.4)'}
        linkWidth={1.5}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        onNodeHover={setHoverNode}
        enableNodeDrag={true}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
}
