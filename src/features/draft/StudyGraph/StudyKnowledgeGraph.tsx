import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

/**
 * StudyKnowledgeGraph - GitNexus-style 3D visualization for study topics
 *
 * Displays topics as glowing nodes with connections based on:
 * - Legal relationships (same law/regulation)
 * - Conceptual relationships (related concepts)
 * - Progress clustering (similar mastery levels)
 */

// Types
export interface TopicNode {
  id: string;
  name: string;
  fullName: string;
  tema: number;
  category: string;
  progress: number; // 0-100
  questionsTotal: number;
  questionsAnswered: number;
  accuracy: number;
  lastStudied?: Date;
  subtopics?: string[];
}

interface GraphNode {
  id: string;
  name: string;
  fullName: string;
  val: number;
  color: string;
  category: string;
  progress: number;
  tema: number;
  __data: TopicNode;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'legal' | 'conceptual' | 'sequence';
  strength: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Color scheme matching GitNexus style
const CATEGORY_COLORS: Record<string, string> = {
  'Constitucion': '#10b981', // emerald
  'Gobierno': '#3b82f6',     // blue
  'LRJSP': '#8b5cf6',        // purple
  'LPAC': '#f59e0b',         // amber
  'EBEP': '#ec4899',         // pink
  'Otros': '#64748b',        // slate
};

const PROGRESS_COLORS = {
  mastered: '#10b981',   // green
  learning: '#3b82f6',   // blue
  started: '#f59e0b',    // amber
  notStarted: '#64748b', // gray
};

// Sample data - Spanish civil service exam topics
const SAMPLE_TOPICS: TopicNode[] = [
  // Constitución Española
  { id: 't1', name: 'Constitución: Principios', fullName: 'Tema 1: La Constitución Española - Principios', tema: 1, category: 'Constitucion', progress: 85, questionsTotal: 45, questionsAnswered: 42, accuracy: 78 },
  { id: 't2', name: 'Derechos Fundamentales', fullName: 'Tema 2: Derechos y Deberes Fundamentales', tema: 2, category: 'Constitucion', progress: 72, questionsTotal: 60, questionsAnswered: 48, accuracy: 82 },
  { id: 't3', name: 'Corona y Cortes', fullName: 'Tema 3: La Corona y Las Cortes Generales', tema: 3, category: 'Constitucion', progress: 45, questionsTotal: 40, questionsAnswered: 20, accuracy: 70 },
  { id: 't4', name: 'Gobierno y TC', fullName: 'Tema 4: Gobierno, Poder Judicial y TC', tema: 4, category: 'Constitucion', progress: 30, questionsTotal: 55, questionsAnswered: 18, accuracy: 65 },

  // Gobierno y Administración
  { id: 't5', name: 'Ley 50/1997', fullName: 'Tema 5: Ley del Gobierno', tema: 5, category: 'Gobierno', progress: 60, questionsTotal: 35, questionsAnswered: 25, accuracy: 75 },
  { id: 't6', name: 'Administración General', fullName: 'Tema 6: Ley 40/2015 LRJSP - Título II', tema: 6, category: 'Gobierno', progress: 40, questionsTotal: 50, questionsAnswered: 22, accuracy: 68 },

  // LRJSP
  { id: 't7', name: 'LRJSP Título III', fullName: 'Tema 7: LRJSP - Órganos Colegiados', tema: 7, category: 'LRJSP', progress: 25, questionsTotal: 30, questionsAnswered: 10, accuracy: 60 },
  { id: 't8', name: 'LRJSP Título IV', fullName: 'Tema 8: LRJSP - Responsabilidad', tema: 8, category: 'LRJSP', progress: 15, questionsTotal: 25, questionsAnswered: 5, accuracy: 55 },

  // LPAC
  { id: 't9', name: 'LPAC Procedimiento', fullName: 'Tema 9: Procedimiento Administrativo Común', tema: 9, category: 'LPAC', progress: 50, questionsTotal: 80, questionsAnswered: 45, accuracy: 72 },

  // EBEP
  { id: 't10', name: 'TREBEP', fullName: 'Tema 10: Estatuto Básico Empleado Público', tema: 10, category: 'EBEP', progress: 35, questionsTotal: 70, questionsAnswered: 28, accuracy: 66 },

  // Sector Público
  { id: 't11', name: 'Sector Público', fullName: 'Tema 11: LRJSP - Sector Público Institucional', tema: 11, category: 'LRJSP', progress: 10, questionsTotal: 40, questionsAnswered: 5, accuracy: 50 },
];

// Generate links based on relationships
function generateLinks(topics: TopicNode[]): GraphLink[] {
  const links: GraphLink[] = [];

  // Sequential links (tema order)
  for (let i = 0; i < topics.length - 1; i++) {
    if (topics[i + 1].tema === topics[i].tema + 1) {
      links.push({
        source: topics[i].id,
        target: topics[i + 1].id,
        type: 'sequence',
        strength: 0.3,
      });
    }
  }

  // Category links (same law/regulation)
  const byCategory = topics.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {} as Record<string, TopicNode[]>);

  Object.values(byCategory).forEach(group => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        links.push({
          source: group[i].id,
          target: group[j].id,
          type: 'legal',
          strength: 0.7,
        });
      }
    }
  });

  // Conceptual links (manually defined relationships)
  const conceptualLinks = [
    ['t1', 't2'], // Constitución -> Derechos
    ['t4', 't5'], // Gobierno TC -> Ley Gobierno
    ['t6', 't7'], // LRJSP -> Órganos
    ['t7', 't8'], // Órganos -> Responsabilidad
    ['t9', 't6'], // LPAC -> LRJSP (procedimiento relacionado)
  ];

  conceptualLinks.forEach(([source, target]) => {
    if (topics.find(t => t.id === source) && topics.find(t => t.id === target)) {
      links.push({ source, target, type: 'conceptual', strength: 0.5 });
    }
  });

  return links;
}

// Convert topics to graph data
function topicsToGraphData(topics: TopicNode[]): GraphData {
  const nodes: GraphNode[] = topics.map(topic => {
    const progressColor = topic.progress >= 80
      ? PROGRESS_COLORS.mastered
      : topic.progress >= 50
        ? PROGRESS_COLORS.learning
        : topic.progress > 0
          ? PROGRESS_COLORS.started
          : PROGRESS_COLORS.notStarted;

    return {
      id: topic.id,
      name: topic.name,
      fullName: topic.fullName,
      val: Math.max(topic.questionsTotal / 10, 2), // Node size based on content
      color: CATEGORY_COLORS[topic.category] || CATEGORY_COLORS.Otros,
      category: topic.category,
      progress: topic.progress,
      tema: topic.tema,
      __data: topic,
    };
  });

  return {
    nodes,
    links: generateLinks(topics),
  };
}

interface StudyKnowledgeGraphProps {
  topics?: TopicNode[];
  onTopicClick?: (topic: TopicNode) => void;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export default function StudyKnowledgeGraph({
  topics = SAMPLE_TOPICS,
  onTopicClick,
  width,
  height,
  showLabels = true,
}: StudyKnowledgeGraphProps) {
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 600 });
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // SSR check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive sizing
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

  const graphData = useMemo(() => topicsToGraphData(topics), [topics]);

  // Filter by category if selected
  const filteredData = useMemo(() => {
    if (!selectedCategory) return graphData;

    const filteredNodes = graphData.nodes.filter(n => n.category === selectedCategory);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(
      l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, selectedCategory]);

  // Custom node rendering with glow
  const nodeThreeObject = useCallback((node: GraphNode) => {
    const isHovered = node === hoverNode;
    const baseSize = Math.sqrt(node.val) * 4;
    const size = baseSize * (isHovered ? 1.4 : 1);

    // Create group for node + glow
    const group = new THREE.Group();

    // Glow sphere (outer)
    const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: node.color,
      transparent: true,
      opacity: isHovered ? 0.3 : 0.15,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glowMesh);

    // Main sphere
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: node.color,
      emissive: node.color,
      emissiveIntensity: isHovered ? 0.6 : 0.3,
      shininess: 100,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Progress ring
    if (node.progress > 0) {
      const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 1.4, 32, 1, 0, (node.progress / 100) * Math.PI * 2);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: PROGRESS_COLORS.mastered,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Label
    if (showLabels) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;

      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 24px Inter, system-ui, sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(40, 10, 1);
      sprite.position.set(0, -size - 8, 0);
      group.add(sprite);
    }

    return group;
  }, [hoverNode, showLabels]);

  // Link styling
  const linkColor = useCallback((link: GraphLink) => {
    switch (link.type) {
      case 'legal': return 'rgba(99, 102, 241, 0.6)'; // indigo
      case 'conceptual': return 'rgba(16, 185, 129, 0.4)'; // emerald
      case 'sequence': return 'rgba(100, 116, 139, 0.3)'; // slate
      default: return 'rgba(100, 116, 139, 0.2)';
    }
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (onTopicClick) {
      onTopicClick(node.__data);
    }
    // Zoom to node
    graphRef.current?.centerAt(node.x, node.y, node.z, 1000);
    graphRef.current?.cameraPosition(
      { x: node.x! + 100, y: node.y!, z: node.z! + 100 },
      { x: node.x, y: node.y, z: node.z },
      1000
    );
  }, [onTopicClick]);

  // Categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(topics.map(t => t.category)));
  }, [topics]);

  return (
    <div className="relative" style={{ width: width || '100%', height: height || '100%' }}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-black/60 backdrop-blur-lg rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">Filtrar por Ley</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                ${!selectedCategory
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                  ${selectedCategory === cat
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-lg rounded-xl p-3">
        <p className="text-xs text-slate-400 mb-2 font-medium">Progreso</p>
        <div className="flex gap-3">
          {Object.entries(PROGRESS_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-slate-400 capitalize">
                {key === 'mastered' ? 'Dominado' :
                 key === 'learning' ? 'Aprendiendo' :
                 key === 'started' ? 'Iniciado' : 'Nuevo'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats panel */}
      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-lg rounded-xl p-4 min-w-[200px]">
        <p className="text-xs text-slate-400 mb-3 font-medium">Resumen</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">Temas</span>
            <span className="text-sm font-bold text-white">{topics.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">Preguntas</span>
            <span className="text-sm font-bold text-white">
              {topics.reduce((sum, t) => sum + t.questionsTotal, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">Progreso medio</span>
            <span className="text-sm font-bold text-emerald-400">
              {Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length)}%
            </span>
          </div>
        </div>
      </div>

      {/* Hover info */}
      {hoverNode && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-lg rounded-xl p-4 min-w-[240px] border border-white/10">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: hoverNode.color }}
            >
              {hoverNode.tema}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">{hoverNode.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{hoverNode.fullName}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{hoverNode.progress}%</p>
              <p className="text-[10px] text-slate-500">Progreso</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{hoverNode.__data.questionsAnswered}</p>
              <p className="text-[10px] text-slate-500">Respondidas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">{hoverNode.__data.accuracy}%</p>
              <p className="text-[10px] text-slate-500">Precisión</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${hoverNode.progress}%`,
                  backgroundColor: hoverNode.color,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Graph container */}
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)',
          minHeight: 500,
        }}
      >
        {isClient && (
          <ForceGraph3D
            ref={graphRef}
            graphData={filteredData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeThreeObject={nodeThreeObject}
            nodeThreeObjectExtend={false}
            linkColor={linkColor}
            linkWidth={1.5}
            linkOpacity={0.6}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.1}
            onNodeClick={handleNodeClick}
            onNodeHover={setHoverNode as any}
            enableNodeDrag={true}
            enableNavigationControls={true}
            controlType="orbit"
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={50}
            cooldownTicks={100}
          />
        )}
      </div>
    </div>
  );
}

// Named export for the sample data converter
export { topicsToGraphData, SAMPLE_TOPICS, CATEGORY_COLORS, PROGRESS_COLORS };
