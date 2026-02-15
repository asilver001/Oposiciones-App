/**
 * TemarioHexMap — Canvas 2D hex grid visualization for 28-tema C2 syllabus.
 * Light theme, 6 bloques layout, integrated NodeDetailSheet.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { getTemarioNodes, getTemarioLinks, STATUS_COLORS, BLOQUES } from './temarioData';
import NodeDetailSheet from './NodeDetailSheet';

const BG = '#f8fafc';
const GRID_COLOR = '#e5e7eb20';
const HEX_SIZE = 38;
const HEX_GAP = 10;

// Hex grid positions: rows grouped by bloque (6 bloques, 28 temas)
const HEX_POSITIONS = {
  // Row 0: Constitución y Poderes (5)
  1:  { col: 0, row: 0 }, 8:  { col: 1, row: 0 }, 11: { col: 2, row: 0 },
  14: { col: 3, row: 0 }, 15: { col: 4, row: 0 },
  // Row 1: Organización y Transparencia (5)
  2:  { col: 0, row: 1 }, 3:  { col: 1, row: 1 }, 4:  { col: 2, row: 1 },
  5:  { col: 3, row: 1 }, 16: { col: 4, row: 1 },
  // Row 2: Procedimiento y Protección (2, centered)
  6:  { col: 1.5, row: 2 }, 7:  { col: 2.5, row: 2 },
  // Row 3: Función Pública e Igualdad (4)
  9:  { col: 0.5, row: 3 }, 10: { col: 1.5, row: 3 },
  12: { col: 2.5, row: 3 }, 13: { col: 3.5, row: 3 },
  // Row 4: Atención Ciudadana (4)
  17: { col: 0.5, row: 4 }, 18: { col: 1.5, row: 4 },
  19: { col: 2.5, row: 4 }, 20: { col: 3.5, row: 4 },
  // Row 5-6: Ofimática (8)
  21: { col: 0.5, row: 5 }, 22: { col: 1.5, row: 5 },
  23: { col: 2.5, row: 5 }, 24: { col: 3.5, row: 5 },
  25: { col: 0.5, row: 6 }, 26: { col: 1.5, row: 6 },
  27: { col: 2.5, row: 6 }, 28: { col: 3.5, row: 6 },
};

const BLOQUE_ROWS = {
  constitucion: 0,
  organizacion: 1,
  procedimiento: 2,
  funcion: 3,
  atencion: 4,
  ofimatica: 5,
};

function hexToWorld(col, row, size) {
  const w = size * 2 + HEX_GAP;
  const h = Math.sqrt(3) * size + HEX_GAP;
  const x = col * w + (row % 2 === 1 ? w / 2 : 0);
  const y = row * h;
  return { x, y };
}

function drawHex(ctx, cx, cy, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function hitTestHex(mx, my, cx, cy, size) {
  const dx = mx - cx;
  const dy = my - cy;
  return Math.sqrt(dx * dx + dy * dy) <= size;
}

export default function TemarioHexMap({ userProgress = {}, questionCounts = {}, onStudy }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const nodes = getTemarioNodes(userProgress, questionCounts);
  const links = getTemarioLinks();

  const selectedData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  // Calculate world positions
  const nodePositions = useCallback(() => {
    const positions = {};
    for (const node of nodes) {
      const pos = HEX_POSITIONS[node.id];
      if (!pos) continue;
      const world = hexToWorld(pos.col, pos.row, HEX_SIZE);
      positions[node.id] = { ...node, wx: world.x, wy: world.y };
    }
    return positions;
  }, [nodes]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;

    function render() {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cam = cameraRef.current;
      const positions = nodePositions();

      const allPos = Object.values(positions);
      if (allPos.length === 0) { animRef.current = requestAnimationFrame(render); return; }
      const minX = Math.min(...allPos.map(p => p.wx));
      const maxX = Math.max(...allPos.map(p => p.wx));
      const minY = Math.min(...allPos.map(p => p.wy));
      const maxY = Math.max(...allPos.map(p => p.wy));
      const gridW = maxX - minX;
      const gridH = maxY - minY;
      const offsetX = (width - gridW * cam.zoom) / 2 - minX * cam.zoom + cam.x;
      const offsetY = (height - gridH * cam.zoom) / 2 - minY * cam.zoom + cam.y + 10;

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5;
      const gridStep = 40 * cam.zoom;
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
      }

      const toScreen = (wx, wy) => ({
        x: wx * cam.zoom + offsetX,
        y: wy * cam.zoom + offsetY
      });

      // Draw links
      for (const link of links) {
        const s = positions[link.source];
        const t = positions[link.target];
        if (!s || !t) continue;
        const sp = toScreen(s.wx, s.wy);
        const tp = toScreen(t.wx, t.wy);

        const grad = ctx.createLinearGradient(sp.x, sp.y, tp.x, tp.y);
        grad.addColorStop(0, s.bloqueColor + '30');
        grad.addColorStop(1, t.bloqueColor + '50');

        const mx = (sp.x + tp.x) / 2;
        const my = (sp.y + tp.y) / 2 - 12 * cam.zoom;

        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.quadraticCurveTo(mx, my, tp.x, tp.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 * cam.zoom;

        if (t.status === 'nuevo' && t.sessions === 0) {
          const dashOffset = (Date.now() / 60) % 20;
          ctx.setLineDash([5, 4]);
          ctx.lineDashOffset = -dashOffset;
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(tp.y - my, tp.x - mx);
        const aLen = 4 * cam.zoom;
        ctx.beginPath();
        ctx.moveTo(tp.x, tp.y);
        ctx.lineTo(tp.x - aLen * Math.cos(angle - 0.4), tp.y - aLen * Math.sin(angle - 0.4));
        ctx.lineTo(tp.x - aLen * Math.cos(angle + 0.4), tp.y - aLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = t.bloqueColor + '60';
        ctx.fill();
      }

      // Draw nodes
      for (const node of Object.values(positions)) {
        const sp = toScreen(node.wx, node.wy);
        const sz = HEX_SIZE * cam.zoom;
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        const effectiveSize = isHovered ? sz * 1.08 : sz;
        const statusColor = STATUS_COLORS[node.status] || STATUS_COLORS.nuevo;

        // Glow
        if (isHovered || isSelected || node.status === 'dominado') {
          const glow = ctx.createRadialGradient(sp.x, sp.y, effectiveSize * 0.5, sp.x, sp.y, effectiveSize * 1.6);
          glow.addColorStop(0, node.bloqueColor + '18');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, effectiveSize * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hex — white fill
        drawHex(ctx, sp.x, sp.y, effectiveSize);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Hex — bloque tinted fill
        drawHex(ctx, sp.x, sp.y, effectiveSize);
        ctx.fillStyle = node.bloqueColor + (node.status === 'nuevo' ? '08' : '12');
        ctx.fill();

        // Hex border
        drawHex(ctx, sp.x, sp.y, effectiveSize);
        ctx.strokeStyle = isSelected ? node.bloqueColor : statusColor;
        ctx.lineWidth = isHovered || isSelected ? 3 : 2;
        ctx.stroke();

        // Progress arc
        if (node.accuracy > 0) {
          const arcAngle = (node.accuracy / 100) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, effectiveSize + 4, -Math.PI / 2, -Math.PI / 2 + arcAngle);
          ctx.strokeStyle = STATUS_COLORS.dominado;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.lineCap = 'butt';
        }

        // Label "T{num}"
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1f2937';
        ctx.font = `bold ${Math.max(10, 12 * cam.zoom)}px Inter, system-ui, sans-serif`;
        ctx.fillText(node.label, sp.x, sp.y - 4 * cam.zoom);

        // Short name
        ctx.font = `${Math.max(7, 8 * cam.zoom)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = '#6b7280';
        ctx.fillText(node.shortName, sp.x, sp.y + 10 * cam.zoom);

        // Question count badge
        if (node.questionCount > 0) {
          ctx.font = `${Math.max(6, 7 * cam.zoom)}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = '#9ca3af';
          ctx.fillText(`${node.questionCount}q`, sp.x, sp.y + 20 * cam.zoom);
        }

        // Dominado checkmark
        if (node.status === 'dominado') {
          const cx = sp.x + effectiveSize * 0.65;
          const cy = sp.y - effectiveSize * 0.65;
          ctx.fillStyle = STATUS_COLORS.dominado;
          ctx.beginPath();
          ctx.arc(cx, cy, 7 * cam.zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(7, 8 * cam.zoom)}px sans-serif`;
          ctx.fillText('\u2713', cx, cy + 1);
        }
      }

      // Bloque labels on the left
      for (const [key, bloque] of Object.entries(BLOQUES)) {
        const row = BLOQUE_ROWS[key];
        if (row === undefined) continue;
        const refPos = hexToWorld(0, row, HEX_SIZE);
        const sp = toScreen(refPos.x - HEX_SIZE * 2.8, refPos.y);
        ctx.save();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = `600 ${Math.max(8, 9 * cam.zoom)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = bloque.color + 'cc';
        ctx.fillText(bloque.name, sp.x, sp.y);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(render);
    }

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes, links, nodePositions, hoveredNode, selectedNode]);

  // Mouse interaction
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragRef.current.dragging) {
      cameraRef.current.x += (mx - dragRef.current.lastX);
      cameraRef.current.y += (my - dragRef.current.lastY);
      dragRef.current.lastX = mx;
      dragRef.current.lastY = my;
      return;
    }

    const cam = cameraRef.current;
    const positions = nodePositions();
    const { width, height } = container.getBoundingClientRect();
    const allPos = Object.values(positions);
    if (allPos.length === 0) return;
    const minX = Math.min(...allPos.map(p => p.wx));
    const maxX = Math.max(...allPos.map(p => p.wx));
    const minY = Math.min(...allPos.map(p => p.wy));
    const maxY = Math.max(...allPos.map(p => p.wy));
    const gridW = maxX - minX;
    const gridH = maxY - minY;
    const offsetX = (width - gridW * cam.zoom) / 2 - minX * cam.zoom + cam.x;
    const offsetY = (height - gridH * cam.zoom) / 2 - minY * cam.zoom + cam.y + 10;

    let found = null;
    for (const node of Object.values(positions)) {
      const sx = node.wx * cam.zoom + offsetX;
      const sy = node.wy * cam.zoom + offsetY;
      if (hitTestHex(mx, my, sx, sy, HEX_SIZE * cam.zoom)) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
    canvas.style.cursor = found ? 'pointer' : 'grab';
  }, [nodePositions, setHoveredNode]);

  const handleClick = useCallback(() => {
    if (hoveredNode) {
      setSelectedNode(prev => prev === hoveredNode ? null : hoveredNode);
    }
  }, [hoveredNode, setSelectedNode]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    cameraRef.current.zoom = Math.max(0.4, Math.min(2.5, cameraRef.current.zoom * delta));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!hoveredNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragRef.current = { dragging: true, lastX: e.clientX - rect.left, lastY: e.clientY - rect.top };
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [hoveredNode]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.dragging = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  }, [hoveredNode]);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ background: BG }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Bottom sheet */}
      <NodeDetailSheet
        node={selectedData}
        userProgress={userProgress}
        onStudy={onStudy}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
