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
import { X, Sparkles, Orbit, Stars, Brain, TrainFront } from 'lucide-react';
import projectState from './projectState.json';
import { constellationLayout } from './layouts/constellation';
import { mindMapLayout } from './layouts/mindMap';
import { metroMapLayout } from './layouts/metroMap';
import { galaxySpiralCompactLayout } from './layouts/galaxySpiralCompact';

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
  const [layoutType, setLayoutType] = useState('constellation');

  // Generate initial layout
  const { initialNodes, initialEdges } = useMemo(() => {
    const layout = layoutAlgorithms[layoutType];
    return layout(projectState.phases, projectState.tasks);
  }, [layoutType]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when layout changes
  React.useEffect(() => {
    const layout = layoutAlgorithms[layoutType];
    const { nodes: newNodes, edges: newEdges } = layout(
      projectState.phases,
      projectState.tasks
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [layoutType, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node.data);
  }, []);

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
          nodes={nodes}
          edges={edges}
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

          {/* Top Left Panel - Project Info */}
          <Panel position="top-left" className="bg-white/10 backdrop-blur-md rounded-xl p-5 text-white min-w-[280px]">
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
          </Panel>

          {/* Bottom Left Panel - Layout Selector */}
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
