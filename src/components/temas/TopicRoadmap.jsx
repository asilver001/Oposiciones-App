import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPIC_PREREQUISITES, isTopicUnlocked } from '../../data/topicPrerequisites';

// Node status colors
const STATUS_COLORS = {
  dominado: '#10b981',   // green
  avanzando: '#3b82f6',  // blue
  progreso: '#a855f7',   // purple
  nuevo: '#9ca3af',      // gray
  riesgo: '#f59e0b',     // amber
  en_riesgo: '#ef4444',  // red
  locked: '#d1d5db'      // light gray
};

/**
 * Build a top-to-bottom graph layout from topic prerequisites.
 * Uses BFS layering (Sugiyama-style) - rows by depth, columns within each row.
 * Only includes topics that have entries in TOPIC_PREREQUISITES.
 */
function buildLayout(topics, userProgress, containerWidth, containerHeight) {
  const nodes = [];
  const links = [];

  // Only include topics that exist in TOPIC_PREREQUISITES, deduplicated by number
  const prerequisiteNums = new Set(Object.keys(TOPIC_PREREQUISITES).map(Number));
  const topicMap = new Map();
  topics.forEach(t => {
    if (prerequisiteNums.has(t.number) && !topicMap.has(t.number)) {
      topicMap.set(t.number, t);
    }
  });

  const allNums = Array.from(topicMap.keys());
  if (allNums.length === 0) return { nodes, links };

  // Calculate depths using BFS from roots
  const depths = {};
  const queue = [];

  // Initialize roots (no prereqs)
  allNums.forEach(num => {
    const prereqs = (TOPIC_PREREQUISITES[num] || []).filter(p => topicMap.has(p));
    if (prereqs.length === 0) {
      depths[num] = 0;
      queue.push(num);
    }
  });

  // BFS to set max depths (longest path)
  const visited = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    // Find all topics that have `current` as a prerequisite
    allNums.forEach(num => {
      const prereqs = (TOPIC_PREREQUISITES[num] || []).filter(p => topicMap.has(p));
      if (prereqs.includes(current)) {
        const newDepth = (depths[current] || 0) + 1;
        if (depths[num] === undefined || newDepth > depths[num]) {
          depths[num] = newDepth;
          queue.push(num);
        }
      }
    });
  }

  // Standalone topics (no depth assigned) get depth 0
  allNums.forEach(num => {
    if (depths[num] === undefined) depths[num] = 0;
  });

  // Group by depth level
  const levels = {};
  allNums.forEach(num => {
    const d = depths[num];
    if (!levels[d]) levels[d] = [];
    levels[d].push(num);
  });

  // Sort within each level for consistent ordering
  Object.values(levels).forEach(nums => nums.sort((a, b) => a - b));

  const maxDepth = Math.max(...Object.keys(levels).map(Number), 0);
  const nodeRadius = 26;
  const paddingX = 50;
  const paddingY = 50;

  // Top-to-bottom layout: depth = row (Y), position within level = column (X)
  const usableWidth = containerWidth - paddingX * 2;
  const usableHeight = containerHeight - paddingY * 2;

  Object.entries(levels).forEach(([depthStr, nums]) => {
    const depth = parseInt(depthStr);
    // Y: top-to-bottom by depth
    const y = maxDepth > 0
      ? paddingY + (depth / maxDepth) * usableHeight
      : containerHeight / 2;

    nums.forEach((num, idx) => {
      const count = nums.length;
      // X: spread evenly across width
      const x = count === 1
        ? containerWidth / 2
        : paddingX + (idx / (count - 1)) * usableWidth;

      const topic = topicMap.get(num);
      if (!topic) return;

      const unlocked = isTopicUnlocked(num, userProgress);

      nodes.push({
        id: num,
        x,
        y,
        label: `T${num}`,
        name: topic.name,
        status: topic.status || 'nuevo',
        progress: topic.progress || 0,
        accuracy: topic.accuracy || 0,
        unlocked,
        questionsAnswered: topic.questionsAnswered || 0,
        questionsTotal: topic.questionsTotal || 0
      });
    });
  });

  // Build links from prerequisites (only between existing nodes)
  const nodeIds = new Set(nodes.map(n => n.id));
  allNums.forEach(num => {
    const prereqs = (TOPIC_PREREQUISITES[num] || []).filter(p => nodeIds.has(p));
    prereqs.forEach(prereq => {
      links.push({ source: prereq, target: num });
    });
  });

  return { nodes, links };
}

/**
 * TopicRoadmap - Interactive topic dependency visualization (canvas-based)
 */
export default function TopicRoadmap({ topics = [], userProgress = {}, onTopicSelect }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Responsive dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDims = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth || 600;
        // Count prerequisite-defined topics to estimate height
        const prerequisiteNums = new Set(Object.keys(TOPIC_PREREQUISITES).map(Number));
        const seen = new Set();
        const relevantCount = topics.filter(t => {
          if (prerequisiteNums.has(t.number) && !seen.has(t.number)) {
            seen.add(t.number);
            return true;
          }
          return false;
        }).length;
        const neededHeight = Math.max(400, Math.min(relevantCount * 55 + 120, 700));
        setDimensions({ width, height: neededHeight });
      }
    };
    updateDims();
    const observer = new ResizeObserver(updateDims);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [topics.length]);

  const { nodes, links } = useMemo(
    () => buildLayout(topics, userProgress, dimensions.width, dimensions.height),
    [topics, userProgress, dimensions.width, dimensions.height]
  );

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Build nodeMap for link rendering
    const nodeMap = new Map();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // Draw links (top-to-bottom bezier curves)
    links.forEach(link => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);

      // Vertical bezier curve (top to bottom)
      const midY = (source.y + target.y) / 2;
      ctx.bezierCurveTo(source.x, midY, target.x, midY, target.x, target.y);

      ctx.strokeStyle = target.unlocked ? '#c4b5fd' : '#e5e7eb';
      ctx.lineWidth = target.unlocked ? 2 : 1;
      ctx.setLineDash(target.unlocked ? [] : [4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow pointing down
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const arrowSize = 6;
      const arrowX = target.x - Math.cos(angle) * 30;
      const arrowY = target.y - Math.sin(angle) * 30;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
        arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
        arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = target.unlocked ? '#c4b5fd' : '#e5e7eb';
      ctx.fill();
    });

    // Draw nodes
    const radius = 26;
    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const color = STATUS_COLORS[node.status] || STATUS_COLORS.nuevo;
      const r = isHovered ? radius + 4 : radius;

      // Glow for hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
      }

      // Background circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.unlocked ? '#ffffff' : '#f9fafb';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = node.unlocked ? 3 : 1.5;
      ctx.stroke();

      // Progress arc
      if (node.progress > 0) {
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (node.progress / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 2, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = node.unlocked ? '#111827' : '#9ca3af';
      ctx.font = `bold 12px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Checkmark for dominado
      if (node.status === 'dominado') {
        ctx.fillStyle = STATUS_COLORS.dominado;
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('\u2713', node.x + r - 4, node.y - r + 4);
      }

      // Lock icon for locked
      if (!node.unlocked) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px sans-serif';
        ctx.fillText('\uD83D\uDD12', node.x + r - 6, node.y - r + 6);
      }
    });
  }, [nodes, links, dimensions, hoveredNode]);

  // Mouse interaction
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    for (const node of nodes) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        found = node;
        break;
      }
    }

    setHoveredNode(found ? found.id : null);
    canvas.style.cursor = found ? 'pointer' : 'default';

    if (found) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 10,
        node: found
      });
    } else {
      setTooltip(null);
    }
  }, [nodes]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodes) {
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30 && node.unlocked) {
        const topic = topics.find(t => t.number === node.id);
        if (topic && onTopicSelect) onTopicSelect(topic);
        break;
      }
    }
  }, [nodes, topics, onTopicSelect]);

  // Touch support
  const handleTouch = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((e) => {
    if (hoveredNode) {
      const node = nodes.find(n => n.id === hoveredNode);
      if (node && node.unlocked) {
        const topic = topics.find(t => t.number === node.id);
        if (topic && onTopicSelect) onTopicSelect(topic);
      }
    }
    setTooltip(null);
    setHoveredNode(null);
  }, [hoveredNode, nodes, topics, onTopicSelect]);

  if (topics.length === 0) return null;

  return (
    <div ref={containerRef} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs text-gray-500 mb-2">
          Mapa de dependencias entre temas. Los temas bloqueados requieren dominar sus prerequisitos.
        </p>
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Estado:</span>
          {Object.entries({
            dominado: 'Dominado',
            avanzando: 'Avanzando',
            progreso: 'En progreso',
            nuevo: 'Nuevo',
            riesgo: 'Repasar'
          }).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className="w-3 h-3 rounded-full border-2"
                style={{ borderColor: STATUS_COLORS[key], backgroundColor: STATUS_COLORS[key] + '20' }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: dimensions.width, height: dimensions.height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoveredNode(null); setTooltip(null); }}
        onClick={handleClick}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-[200px]"
            style={{
              left: Math.min(tooltip.x, dimensions.width - 180),
              top: Math.max(tooltip.y - 70, 10)
            }}
          >
            <p className="font-semibold">T{tooltip.node.id}. {tooltip.node.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span>{tooltip.node.questionsAnswered}/{tooltip.node.questionsTotal}</span>
              {tooltip.node.accuracy > 0 && (
                <span className="text-green-400">{tooltip.node.accuracy}% acierto</span>
              )}
            </div>
            <div className="mt-0.5">
              <span style={{ color: STATUS_COLORS[tooltip.node.status] }}>
                {tooltip.node.progress}% dominio
              </span>
            </div>
            {!tooltip.node.unlocked && (
              <p className="text-amber-300 mt-0.5">Completa prerequisitos</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
