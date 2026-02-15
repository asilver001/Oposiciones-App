/**
 * TemarioDendrite — Force-directed graph visualization of the 28-tema C2 syllabus.
 * Light theme, integrated NodeDetailSheet, real data via props.
 */

import { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide, forceX, forceY } from 'd3-force';
import { getTemarioGraphData, STATUS_COLORS, BLOQUES } from './temarioData';
import NodeDetailSheet from './NodeDetailSheet';

const BG = '#f8fafc';

export default function TemarioDendrite({ userProgress = {}, questionCounts = {}, onStudy }) {
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
    // Bloque anchor positions (hexagonal arrangement)
    const bloqueAnchors = {
      constitucion: { x: 0, y: -200 },
      organizacion: { x: 190, y: -80 },
      procedimiento: { x: 190, y: 100 },
      funcion: { x: 0, y: 200 },
      atencion: { x: -190, y: 100 },
      ofimatica: { x: -190, y: -80 },
    };
    const nodeMap = {};
    graphData.nodes.forEach(n => { nodeMap[n.id] = n; });

    fg.d3Force('charge').strength(-1200);
    fg.d3Force('link').distance(link => {
      const s = nodeMap[link.source?.id || link.source];
      const t = nodeMap[link.target?.id || link.target];
      return s?.bloque === t?.bloque ? 60 : 160;
    });
    fg.d3Force('collide', forceCollide(42));
    // Pull nodes toward their bloque anchor
    fg.d3Force('bloqueX', forceX(d => bloqueAnchors[d.bloque]?.x || 0).strength(0.15));
    fg.d3Force('bloqueY', forceY(d => bloqueAnchors[d.bloque]?.y || 0).strength(0.15));
    setTimeout(() => fg.zoomToFit(400, 30), 2000);
  }, [graphData]);

  const selectedNodeData = useMemo(
    () => graphData.nodes.find(n => n.id === selectedNode) || null,
    [graphData.nodes, selectedNode]
  );

  // Paint node
  const paintNode = useCallback((node, ctx, globalScale) => {
    const r = 16;
    const isHovered = hoveredNode === node.id;
    const isSelected = selectedNode === node.id;
    const bloqueColor = node.bloqueColor;
    const statusColor = STATUS_COLORS[node.status] || STATUS_COLORS.nuevo;

    // Glow
    if (isHovered || isSelected || node.status === 'dominado') {
      const glow = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r * 2.2);
      glow.addColorStop(0, bloqueColor + '25');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 2.2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // White fill
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Status border
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? bloqueColor : statusColor;
    ctx.lineWidth = isSelected || isHovered ? 3.5 : 2.5;
    ctx.stroke();

    // Progress arc
    if (node.accuracy > 0) {
      const angle = (node.accuracy / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 3, -Math.PI / 2, -Math.PI / 2 + angle);
      ctx.strokeStyle = STATUS_COLORS.dominado;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    // Bloque color inner dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = bloqueColor;
    ctx.fill();

    // Label
    const fontSize = Math.max(10, 11 / globalScale * 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1f2937';
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.fillText(node.label, node.x, node.y + r + 10);

    // Name (on hover or good zoom)
    if (isHovered || globalScale > 0.7) {
      ctx.font = `${Math.max(8, 9 / globalScale * 2)}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = isHovered ? '#374151' : '#9ca3af';
      ctx.fillText(node.shortName, node.x, node.y + r + 22);
    }

    // Dominado checkmark
    if (node.status === 'dominado') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(node.x + r - 2, node.y - r + 2, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = STATUS_COLORS.dominado;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('\u2713', node.x + r - 2, node.y - r + 3);
    }
  }, [hoveredNode, selectedNode]);

  // Paint link
  const paintLink = useCallback((link, ctx) => {
    const s = link.source;
    const t = link.target;
    if (!s.x || !t.x) return;

    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2 - 15;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.quadraticCurveTo(mx, my, t.x, t.y);
    ctx.strokeStyle = '#d1d5db80';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrow
    const angle = Math.atan2(t.y - my, t.x - mx);
    const aLen = 5;
    ctx.beginPath();
    ctx.moveTo(t.x, t.y);
    ctx.lineTo(t.x - aLen * Math.cos(angle - 0.4), t.y - aLen * Math.sin(angle - 0.4));
    ctx.lineTo(t.x - aLen * Math.cos(angle + 0.4), t.y - aLen * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = '#d1d5dba0';
    ctx.fill();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ background: BG }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={BG}
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
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
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-sm border border-gray-100 text-xs space-y-1.5">
        {Object.entries(BLOQUES).map(([key, b]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
            <span className="text-gray-600">{b.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom sheet */}
      <NodeDetailSheet
        node={selectedNodeData}
        userProgress={userProgress}
        onStudy={onStudy}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
