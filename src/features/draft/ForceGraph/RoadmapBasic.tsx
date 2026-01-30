import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { RoadmapGraphProps, GraphNode, STATUS_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapBasic - Force-directed layout with optional queue mode
 *
 * layoutMode:
 * - 'force': Organic physics-based positioning (default)
 * - 'queue': Topological layout by dependency levels (columns)
 */
export default function RoadmapBasic({
  tasks = roadmapTasks,
  onTaskClick,
  width,
  height,
  layoutMode = 'queue',
}: RoadmapGraphProps & { layoutMode?: 'force' | 'queue' }) {
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 600 });
  const [isClient, setIsClient] = useState(false);

  // SSR check
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Calculate topological layout for queue mode
  const laidOutGraphData = useMemo(() => {
    if (layoutMode !== 'queue') {
      return graphData;
    }

    const taskById = new Map(tasks.map(task => [task.id, task]));
    const levelCache = new Map<string, number>();
    const visiting = new Set<string>();

    const getLevel = (taskId: string): number => {
      if (levelCache.has(taskId)) {
        return levelCache.get(taskId) ?? 0;
      }

      if (visiting.has(taskId)) {
        return 0; // Cycle detected
      }

      visiting.add(taskId);
      const task = taskById.get(taskId);
      const dependencies = task?.dependencies ?? [];
      const dependencyLevels = dependencies
        .filter(depId => taskById.has(depId))
        .map(depId => getLevel(depId));
      const level = dependencyLevels.length > 0 ? Math.max(...dependencyLevels) + 1 : 0;
      levelCache.set(taskId, level);
      visiting.delete(taskId);
      return level;
    };

    const nodesWithLevels = graphData.nodes.map(node => ({
      node,
      level: getLevel(node.id),
    }));
    const maxLevel = nodesWithLevels.reduce((max, item) => Math.max(max, item.level), 0);
    const levelGroups = new Map<number, GraphNode[]>();

    nodesWithLevels.forEach(({ node, level }) => {
      const group = levelGroups.get(level) ?? [];
      group.push(node);
      levelGroups.set(level, group);
    });

    // Sort within levels by phase and priority
    const phaseOrder = Array.from(new Set(tasks.map(task => task.phase)));
    const phaseIndex = new Map(phaseOrder.map((phase, index) => [phase, index]));

    levelGroups.forEach((group) => {
      group.sort((a, b) => {
        const taskA = taskById.get(a.id);
        const taskB = taskById.get(b.id);
        const phaseA = phaseIndex.get(taskA?.phase ?? '') ?? 0;
        const phaseB = phaseIndex.get(taskB?.phase ?? '') ?? 0;
        if (phaseA !== phaseB) return phaseA - phaseB;
        const priorityA = taskA?.priority ?? 0;
        const priorityB = taskB?.priority ?? 0;
        if (priorityA !== priorityB) return priorityB - priorityA;
        return (taskA?.title ?? '').localeCompare(taskB?.title ?? '');
      });
    });

    // Position nodes in columns
    const padding = 60;
    const availableWidth = Math.max(dimensions.width - padding * 2, 200);
    const availableHeight = Math.max(dimensions.height - padding * 2, 200);
    const columns = Math.max(maxLevel + 1, 1);
    const columnWidth = availableWidth / columns;

    const positionedNodes = graphData.nodes.map((node) => {
      const level = getLevel(node.id);
      const group = levelGroups.get(level) ?? [];
      const index = group.findIndex(groupNode => groupNode.id === node.id);
      const rows = Math.max(group.length, 1);
      const rowHeight = availableHeight / rows;
      return {
        ...node,
        fx: padding + columnWidth * level + columnWidth / 2,
        fy: padding + rowHeight * index + rowHeight / 2,
      };
    });

    return {
      ...graphData,
      nodes: positionedNodes,
    };
  }, [graphData, layoutMode, tasks, dimensions.height, dimensions.width]);

  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = node === hoverNode;
    const baseRadius = Math.sqrt(node.val || 1) * 5;
    const radius = baseRadius * (isHovered ? 1.3 : 1);
    const x = node.x || 0;
    const y = node.y || 0;

    // Glow for in_progress nodes
    if (node.status === 'in_progress') {
      const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2.5);
      gradient.addColorStop(0, STATUS_COLORS.in_progress + '60');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Main circle
    ctx.fillStyle = STATUS_COLORS[node.status];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Hover ring
    if (isHovered) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Checkmark for completed
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

    // Label
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
      {isClient && (
        <ForceGraph2D
          ref={graphRef}
          graphData={laidOutGraphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#0a0a0f"
          d3VelocityDecay={layoutMode === 'queue' ? 0.6 : 0.4}
          d3AlphaDecay={layoutMode === 'queue' ? 0.2 : 0.02}
          warmupTicks={layoutMode === 'queue' ? 10 : 100}
          cooldownTicks={layoutMode === 'queue' ? 0 : 200}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          linkColor={() => 'rgba(100, 116, 139, 0.4)'}
          linkWidth={1.5}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoverNode}
          enableNodeDrag={layoutMode !== 'queue'}
          onEngineStop={handleEngineStop}
        />
      )}
    </div>
  );
}
