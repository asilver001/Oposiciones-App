import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TaskNodeCompact } from './components/TaskNodeCompact';
import { PhaseNodeCompact } from './components/PhaseNodeCompact';
import { X, Sparkles, Orbit, Stars, Brain, TrainFront, Filter, Globe, FolderKanban } from 'lucide-react';
import projectState from './projectState.json';
import oposicionesWorld from './oposicionesWorld.json';
import { constellationLayout } from './layouts/constellation';
import { mindMapLayout } from './layouts/mindMap';
import { metroMapLayout } from './layouts/metroMap';
import { galaxySpiralCompactLayout } from './layouts/galaxySpiralCompact';
import { oposicionesHorizontalLayout } from './layouts/oposicionesWorld';

const nodeTypes = {
  taskCompact: TaskNodeCompact,
  phaseCompact: PhaseNodeCompact,
};

// Layout algorithms - Only compact node layouts
const layoutAlgorithms = {
  constellation: constellationLayout,
  mindMap: mindMapLayout,
  metroMap: metroMapLayout,
  galaxyCompact: galaxySpiralCompactLayout,
};

export default function DendriteNetworkReactFlow({ onClose }) {
  const [viewMode, setViewMode] = useState('project'); // 'project' | 'oposiciones'
  const [layoutType, setLayoutType] = useState('constellation');
  const [filters, setFilters] = useState({
    completed: true,
    inProgress: true,
    pending: true
  });

  // Generate initial layout based on view mode
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (viewMode === 'oposiciones') {
      return oposicionesHorizontalLayout(oposicionesWorld);
    }
    const layout = layoutAlgorithms[layoutType];
    return layout(projectState.phases, projectState.tasks);
  }, [layoutType, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when layout or view mode changes
  React.useEffect(() => {
    let newNodes, newEdges;
    if (viewMode === 'oposiciones') {
      const result = oposicionesHorizontalLayout(oposicionesWorld);
      newNodes = result.nodes;
      newEdges = result.edges;
    } else {
      const layout = layoutAlgorithms[layoutType];
      const result = layout(projectState.phases, projectState.tasks);
      newNodes = result.nodes;
      newEdges = result.edges;
    }
    setNodes(newNodes);
    setEdges(newEdges);
  }, [layoutType, viewMode, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node.data);
  }, []);

  // Filter nodes based on status filters
  const filteredNodes = nodes.filter(node => {
    if (node.type === 'phaseCompact') return true; // Always show phases
    const status = node.data?.status;
    if (status === 'completed' && !filters.completed) return false;
    if (status === 'in-progress' && !filters.inProgress) return false;
    if ((!status || status === 'pending') && !filters.pending) return false;
    return true;
  });

  // Filter edges to only show connections to visible nodes
  const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(edge =>
    visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );

  const completionPercentage = Math.round(
    (projectState.metadata.completedTasks / projectState.metadata.totalTasks) * 100
  );

  const layoutOptions = [
    { id: 'constellation', name: 'Constelación', icon: Stars, description: 'Nodos compactos formando constelaciones' },
    { id: 'mindMap', name: 'MindMap', icon: Brain, description: 'Mapa mental radial desde el centro' },
    { id: 'metroMap', name: 'Metro', icon: TrainFront, description: 'Estilo mapa de metro con estaciones' },
    { id: 'galaxyCompact', name: 'Galaxia', icon: Orbit, description: 'Espiral galáctica con órbitas' },
  ];

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999]">
      <div className="h-full">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          attributionPosition="bottom-right"
        >
          <Background color="#444" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'phaseCompact') {
                return node.data.status === 'completed' ? '#10b981' : node.data.color || '#9333ea';
              }
              if (node.type === 'taskCompact') {
                if (node.data.status === 'completed') return '#10b981';
                if (node.data.status === 'in-progress') return '#9333ea';
                if (node.data.status === 'blocked') return '#ef4444';
                return '#9ca3af';
              }
              return '#fff';
            }}
            className="bg-white/10 backdrop-blur-sm"
          />

          {/* View Mode Toggle */}
          <Panel position="top-center" className="bg-white/10 backdrop-blur-md rounded-xl p-2">
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('project')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'project'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span className="text-sm font-medium">Mi Proyecto</span>
              </button>
              <button
                onClick={() => setViewMode('oposiciones')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'oposiciones'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Mundo Oposiciones</span>
              </button>
            </div>
          </Panel>

          {/* Top Left Panel - Info */}
          <Panel position="top-left" className="bg-white/10 backdrop-blur-md rounded-xl p-5 text-white min-w-[280px]">
            {viewMode === 'project' ? (
              <>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🧬</span>
                  {projectState.metadata.projectName}
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-75">Fases totales:</span>
                    <span className="font-semibold">{projectState.metadata.totalPhases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Tareas totales:</span>
                    <span className="font-semibold">{projectState.metadata.totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Completadas:</span>
                    <span className="font-semibold text-emerald-300">
                      {projectState.metadata.completedTasks}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-3">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Progreso</span>
                      <span className="font-bold">{completionPercentage}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs opacity-60 pt-2">
                    Actualizado: {new Date(projectState.metadata.lastUpdated).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  {oposicionesWorld.metadata.name}
                </h2>

                <div className="space-y-2 text-sm">
                  <p className="text-white/80 text-xs mb-3">
                    {oposicionesWorld.metadata.description}
                  </p>

                  <div className="flex justify-between">
                    <span className="opacity-75">Áreas:</span>
                    <span className="font-semibold">{oposicionesWorld.areas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Posiciones:</span>
                    <span className="font-semibold">{oposicionesWorld.positions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Niveles:</span>
                    <span className="font-semibold">C2 → A1</span>
                  </div>

                  {/* Level legend */}
                  <div className="pt-3 space-y-1">
                    {oposicionesWorld.levels.map(level => (
                      <div key={level.id} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: level.color }}
                        />
                        <span className="font-medium">{level.id}</span>
                        <span className="opacity-60">{level.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Panel>

          {/* Bottom Left Panel - Layout Selector (only for project view) */}
          {viewMode === 'project' && (
            <Panel position="bottom-left" className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="text-white text-xs font-bold mb-3 opacity-75 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Visualizaciones
              </div>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = layoutType === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setLayoutType(option.id)}
                      className={`group relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105 ring-2 ring-purple-300'
                          : 'bg-white/20 text-white/70 hover:bg-white/30 hover:scale-105'
                      }`}
                      title={option.description}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] font-semibold text-center leading-tight">{option.name}</span>

                      {/* Tooltip */}
                      {!isActive && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                            {option.description}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* Bottom Left Panel - Areas (for oposiciones view) */}
          {viewMode === 'oposiciones' && (
            <Panel position="bottom-left" className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="text-white text-xs font-bold mb-3 opacity-75 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Áreas
              </div>
              <div className="space-y-2">
                {oposicionesWorld.areas.map((area) => (
                  <div key={area.id} className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{area.name}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Legend Panel */}
          <Panel position="top-right" className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
            <div className="text-xs font-semibold mb-3 opacity-75">LEYENDA</div>

            <div className="space-y-3">
              {/* Status */}
              <div>
                <div className="text-[10px] opacity-60 mb-1">Estado</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-lg">✅</span>
                    <span>Completado</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-lg">🔄</span>
                    <span>En progreso</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-lg">⏳</span>
                    <span>Pendiente</span>
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <div className="text-[10px] opacity-60 mb-1">Prioridad</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-red-500 px-2 py-0.5 rounded-full text-[10px] font-bold">P0</span>
                    <span>Crítico</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-orange-500 px-2 py-0.5 rounded-full text-[10px] font-bold">P1</span>
                    <span>Alto</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-yellow-500 px-2 py-0.5 rounded-full text-[10px] font-bold">P2</span>
                    <span>Medio</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Filters Panel */}
          <Panel position="bottom-right" className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-white mb-20">
            <div className="text-xs font-semibold mb-2 opacity-75 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              FILTROS
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.completed}
                  onChange={() => setFilters(f => ({ ...f, completed: !f.completed }))}
                  className="rounded border-white/30 bg-white/10 text-emerald-500"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Completado
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.inProgress}
                  onChange={() => setFilters(f => ({ ...f, inProgress: !f.inProgress }))}
                  className="rounded border-white/30 bg-white/10 text-purple-500"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  En progreso
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.pending}
                  onChange={() => setFilters(f => ({ ...f, pending: !f.pending }))}
                  className="rounded border-white/30 bg-white/10 text-gray-400"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Pendiente
                </span>
              </label>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 backdrop-blur-sm transition-all hover:scale-105 shadow-lg"
      >
        <X className="w-5 h-5" />
        <span className="font-semibold">Cerrar</span>
      </button>
    </div>
  );
}
