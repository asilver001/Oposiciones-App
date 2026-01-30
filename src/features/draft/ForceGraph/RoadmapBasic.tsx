import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { RoadmapGraphProps, GraphNode, STATUS_COLORS } from './types';
import { roadmapTasks, tasksToGraphData } from './data';

/**
 * RoadmapBasic - Basic force-directed layout
 */
export default function RoadmapBasic({
  tasks = roadmapTasks,
  width,
  height,
}: RoadmapGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 600,
        });
      }
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const graphData = useMemo(() => tasksToGraphData(tasks), [tasks]);

  const nodeColor = useCallback((node: any) => {
    return STATUS_COLORS[node.status as keyof typeof STATUS_COLORS] || '#6b7280';
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: width || '100%',
        height: height || '100%',
        minHeight: 500,
        background: '#0a0a0f',
      }}
    >
      {isClient && dimensions.width > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#0a0a0f"
          nodeColor={nodeColor}
          nodeLabel={(node: any) => node.name}
          linkColor={() => 'rgba(100, 116, 139, 0.5)'}
          linkWidth={2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
        />
      )}
    </div>
  );
}
