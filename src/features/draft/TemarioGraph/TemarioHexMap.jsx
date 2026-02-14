/**
 * TemarioHexMap — Canvas 2D hex grid visualization inspired by Gradient Bang
 * Pure Canvas API, no external dependencies
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { getTemarioNodes, getTemarioLinks, STATUS_COLORS, BLOQUES } from './temarioData';

const BG_COLOR = '#0a0a0f';
const GRID_COLOR = '#ffffff08';
const HEX_SIZE = 42;
const HEX_GAP = 12;

// Hex grid positions: row-based layout grouped by bloque
const HEX_POSITIONS = {
  // Row 0: Constitución (5 temas)
  1:  { col: 0, row: 0 }, 2:  { col: 1, row: 0 }, 3:  { col: 2, row: 0 },
  4:  { col: 3, row: 0 }, 5:  { col: 4, row: 0 },
  // Row 1: Organización (5 temas)
  6:  { col: 0, row: 1 }, 7:  { col: 1, row: 1 }, 8:  { col: 2, row: 1 },
  9:  { col: 3, row: 1 }, 10: { col: 4, row: 1 },
  // Row 2: Función Pública (3 temas, centered)
  11: { col: 1, row: 2 }, 12: { col: 2, row: 2 }, 13: { col: 3, row: 2 },
  // Row 3: Procedimiento (5 temas)
  14: { col: 0, row: 3 }, 15: { col: 1, row: 3 }, 16: { col: 2, row: 3 },
  17: { col: 3, row: 3 }, 18: { col: 4, row: 3 },
  // Row 4-5: Ofimática (10 temas, 2 rows)
  19: { col: 0, row: 4 }, 20: { col: 1, row: 4 }, 21: { col: 2, row: 4 },
  22: { col: 3, row: 4 }, 23: { col: 4, row: 4 },
  24: { col: 0, row: 5 }, 25: { col: 1, row: 5 }, 26: { col: 2, row: 5 },
  27: { col: 3, row: 5 }, 28: { col: 4, row: 5 },
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

export default function TemarioHexMap({ userProgress = {}, questionCounts = {} }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const nodes = getTemarioNodes(userProgress, questionCounts);
  const links = getTemarioLinks();

  // Calculate world positions for each node
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

  // Render
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

      // Center the grid
      const allPos = Object.values(positions);
      const minX = Math.min(...allPos.map(p => p.wx));
      const maxX = Math.max(...allPos.map(p => p.wx));
      const minY = Math.min(...allPos.map(p => p.wy));
      const maxY = Math.max(...allPos.map(p => p.wy));
      const gridW = maxX - minX;
      const gridH = maxY - minY;
      const offsetX = (width - gridW * cam.zoom) / 2 - minX * cam.zoom + cam.x;
      const offsetY = (height - gridH * cam.zoom) / 2 - minY * cam.zoom + cam.y + 10;

      // Background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = 0.5;
      const gridStep = 40 * cam.zoom;
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
      }

      // Transform helper
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

        // Gradient line
        const grad = ctx.createLinearGradient(sp.x, sp.y, tp.x, tp.y);
        grad.addColorStop(0, s.bloqueColor + '40');
        grad.addColorStop(1, t.bloqueColor + '60');

        ctx.beginPath();
        const mx = (sp.x + tp.x) / 2;
        const my = (sp.y + tp.y) / 2 - 15 * cam.zoom;
        ctx.moveTo(sp.x, sp.y);
        ctx.quadraticCurveTo(mx, my, tp.x, tp.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 * cam.zoom;

        // Animated dash for locked prereqs
        if (t.status === 'nuevo' && t.sessions === 0) {
          const dashOffset = (Date.now() / 50) % 20;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -dashOffset;
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(tp.y - my, tp.x - mx);
        const aLen = 5 * cam.zoom;
        ctx.beginPath();
        ctx.moveTo(tp.x, tp.y);
        ctx.lineTo(tp.x - aLen * Math.cos(angle - 0.4), tp.y - aLen * Math.sin(angle - 0.4));
        ctx.lineTo(tp.x - aLen * Math.cos(angle + 0.4), tp.y - aLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = t.bloqueColor + '80';
        ctx.fill();
      }

      // Draw nodes
      for (const node of Object.values(positions)) {
        const sp = toScreen(node.wx, node.wy);
        const sz = HEX_SIZE * cam.zoom;
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        const effectiveSize = isHovered ? sz * 1.1 : sz;

        // Glow effect
        if (isHovered || isSelected || node.status === 'dominado') {
          const glow = ctx.createRadialGradient(sp.x, sp.y, effectiveSize * 0.5, sp.x, sp.y, effectiveSize * 1.8);
          glow.addColorStop(0, node.bloqueColor + '30');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, effectiveSize * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hex shape
        drawHex(ctx, sp.x, sp.y, effectiveSize);
        ctx.fillStyle = node.bloqueColor + (node.status === 'nuevo' ? '30' : '60');
        ctx.fill();

        // Border
        drawHex(ctx, sp.x, sp.y, effectiveSize);
        ctx.strokeStyle = STATUS_COLORS[node.status] || '#4b5563';
        ctx.lineWidth = isHovered || isSelected ? 3 : 2;
        ctx.stroke();

        // Progress arc overlay
        if (node.accuracy > 0) {
          const arcAngle = (node.accuracy / 100) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, effectiveSize + 4, -Math.PI / 2, -Math.PI / 2 + arcAngle);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Label "T{num}"
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, 13 * cam.zoom)}px Inter, sans-serif`;
        ctx.fillText(node.label, sp.x, sp.y - 4 * cam.zoom);

        // Short name below
        ctx.font = `${Math.max(7, 8 * cam.zoom)}px Inter, sans-serif`;
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(node.shortName, sp.x, sp.y + 12 * cam.zoom);

        // Question count badge
        if (node.questionCount > 0) {
          const badgeY = sp.y + 22 * cam.zoom;
          ctx.font = `${Math.max(6, 7 * cam.zoom)}px Inter, sans-serif`;
          ctx.fillStyle = '#6b7280';
          ctx.fillText(`${node.questionCount}q`, sp.x, badgeY);
        }
      }

      // Bloque labels on the left
      const bloqueRows = { constitucion: 0, organizacion: 1, funcion: 2, procedimiento: 3, ofimatica: 4 };
      for (const [key, bloque] of Object.entries(BLOQUES)) {
        const row = bloqueRows[key];
        const refPos = hexToWorld(0, row, HEX_SIZE);
        const sp = toScreen(refPos.x - HEX_SIZE * 2.5, refPos.y);
        ctx.save();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.max(8, 10 * cam.zoom)}px Inter, sans-serif`;
        ctx.fillStyle = bloque.color + 'aa';
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

    // Handle drag
    if (dragRef.current.dragging) {
      cameraRef.current.x += (mx - dragRef.current.lastX);
      cameraRef.current.y += (my - dragRef.current.lastY);
      dragRef.current.lastX = mx;
      dragRef.current.lastY = my;
      return;
    }

    // Hit test
    const cam = cameraRef.current;
    const positions = nodePositions();
    const { width, height } = container.getBoundingClientRect();
    const allPos = Object.values(positions);
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
  }, [nodePositions]);

  const handleClick = useCallback((e) => {
    if (hoveredNode) {
      setSelectedNode(prev => prev === hoveredNode ? null : hoveredNode);
    }
  }, [hoveredNode]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    cameraRef.current.zoom = Math.max(0.3, Math.min(3, cameraRef.current.zoom * delta));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!hoveredNode) {
      dragRef.current = { dragging: true, lastX: e.clientX - canvasRef.current.getBoundingClientRect().left, lastY: e.clientY - canvasRef.current.getBoundingClientRect().top };
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [hoveredNode]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.dragging = false;
    canvasRef.current.style.cursor = hoveredNode ? 'pointer' : 'grab';
  }, [hoveredNode]);

  const selectedData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ background: BG_COLOR }}>
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

      {/* Detail panel */}
      {selectedData && (
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur rounded-xl p-4 w-64 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedData.bloqueColor }} />
            <span className="text-white font-bold">Tema {selectedData.id}</span>
            <button onClick={() => setSelectedNode(null)} className="ml-auto text-gray-500 hover:text-white text-sm">X</button>
          </div>
          <p className="text-gray-300 text-sm mb-3">{selectedData.name}</p>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Bloque</span>
              <span className="text-white">{selectedData.bloqueLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>Precision</span>
              <span className="text-white">{selectedData.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Sesiones</span>
              <span className="text-white">{selectedData.sessions}</span>
            </div>
            <div className="flex justify-between">
              <span>Preguntas</span>
              <span className="text-white">{selectedData.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado</span>
              <span style={{ color: STATUS_COLORS[selectedData.status] }}>{selectedData.status}</span>
            </div>
            {selectedData.dependencies.length > 0 && (
              <div className="flex justify-between">
                <span>Prerequisitos</span>
                <span className="text-white">{selectedData.dependencies.map(d => `T${d}`).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
