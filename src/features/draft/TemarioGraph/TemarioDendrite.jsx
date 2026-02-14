/**
 * TemarioDendrite — Force-directed graph visualization of the 28-tema C2 syllabus
 * Uses react-force-graph-2d (already in package.json)
 */

import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide } from 'd3-force';
import { getTemarioGraphData, STATUS_COLORS, BLOQUES } from './temarioData';

const BG_COLOR = '#0a0a0f';

export default function TemarioDendrite({ userProgress = {}, questionCounts = {} }) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graphData = useMemo(
    () => getTemarioGraphData(userProgress, questionCounts),
    [userProgress, questionCounts]
  );

  // Force configuration — group by bloque
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge').strength(-500);
    fg.d3Force('link').distance(link => {
      const s = graphData.nodes.find(n => n.id === link.source?.id || n.id === link.source);
      const t = graphData.nodes.find(n => n.id === link.target?.id || n.id === link.target);
      return s?.bloque === t?.bloque ? 70 : 140;
    });
    fg.d3Force('collide', forceCollide(30));
    // Zoom to fit all nodes after simulation settles
    setTimeout(() => fg.zoomToFit(400, 60), 1500);
  }, [graphData]);

  // Paint node
  const paintNode = useCallback((node, ctx, globalScale) => {
    const r = 14;
    const isHovered = hoveredNode === node.id;
    const isSelected = selectedNode === node.id;
    const color = node.bloqueColor;
    const statusColor = STATUS_COLORS[node.status] || STATUS_COLORS.nuevo;

    // Glow
    if (isHovered || isSelected || node.status === 'dominado') {
      const glow = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r * 2.5);
      glow.addColorStop(0, (isHovered ? color : statusColor) + '40');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Outer ring (status)
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 2, 0, 2 * Math.PI);
    ctx.fillStyle = statusColor;
    ctx.fill();

    // Main circle (bloque color)
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Progress arc
    if (node.accuracy > 0) {
      const angle = (node.accuracy / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 2, -Math.PI / 2, -Math.PI / 2 + angle);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Label inside
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(10, 12 / globalScale * 2)}px Inter, sans-serif`;
    ctx.fillText(node.label, node.x, node.y);

    // Name below (always visible at reasonable zoom)
    if (isHovered || globalScale > 0.6) {
      ctx.font = `${Math.max(8, 10 / globalScale * 2)}px Inter, sans-serif`;
      ctx.fillStyle = isHovered ? '#e5e7eb' : '#6b7280';
      ctx.fillText(node.shortName, node.x, node.y + r + 10);
    }
  }, [hoveredNode, selectedNode]);

  // Paint link
  const paintLink = useCallback((link, ctx) => {
    const s = link.source;
    const t = link.target;
    if (!s.x || !t.x) return;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);

    // Bezier curve
    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2 - 20;
    ctx.quadraticCurveTo(mx, my, t.x, t.y);

    ctx.strokeStyle = '#ffffff25';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrow
    const angle = Math.atan2(t.y - my, t.x - mx);
    const arrowLen = 6;
    ctx.beginPath();
    ctx.moveTo(t.x, t.y);
    ctx.lineTo(t.x - arrowLen * Math.cos(angle - 0.4), t.y - arrowLen * Math.sin(angle - 0.4));
    ctx.lineTo(t.x - arrowLen * Math.cos(angle + 0.4), t.y - arrowLen * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = '#ffffff30';
    ctx.fill();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ background: BG_COLOR }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={BG_COLOR}
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkCanvasObject={paintLink}
        onNodeHover={node => setHoveredNode(node?.id || null)}
        onNodeClick={node => setSelectedNode(prev => prev === node.id ? null : node.id)}
        cooldownTicks={100}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-black/70 rounded-lg p-2 text-xs space-y-1">
        {Object.entries(BLOQUES).map(([key, b]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-gray-300">{b.name}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selectedNode && (() => {
        const node = graphData.nodes.find(n => n.id === selectedNode);
        if (!node) return null;
        return (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur rounded-xl p-4 w-64 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: node.bloqueColor }} />
              <span className="text-white font-bold">Tema {node.id}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{node.name}</p>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Precision</span>
                <span className="text-white">{node.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sesiones</span>
                <span className="text-white">{node.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Preguntas</span>
                <span className="text-white">{node.questionCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado</span>
                <span style={{ color: STATUS_COLORS[node.status] }}>{node.status}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
