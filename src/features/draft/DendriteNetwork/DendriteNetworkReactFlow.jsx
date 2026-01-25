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
import { PhaseNode } from './components/PhaseNode';
import { TaskNode } from './components/TaskNode';
import { PhaseNodeEnhanced } from './components/PhaseNodeEnhanced';
import { TaskNodeEnhanced } from './components/TaskNodeEnhanced';
import { TaskNodeCompact } from './components/TaskNodeCompact';
import { PhaseNodeCompact } from './components/PhaseNodeCompact';
import { X, LayoutGrid, Calendar, Network, Sparkles, Orbit, Droplets, Rows, Share2, Grid3x3, Stars, Brain, TrainFront } from 'lucide-react';
import projectState from './projectState.json';
import { radialBurstLayout } from './layouts/radialBurst';
import { galaxySpiralLayout } from './layouts/galaxySpiral';
import { organicClustersLayout } from './layouts/organicClusters';
import { swimLanesLayout } from './layouts/swimLanes';
import { networkGraphLayout } from './layouts/networkGraph';
import { matrixViewLayout } from './layouts/matrixView';
import { constellationLayout } from './layouts/constellation';
import { mindMapLayout } from './layouts/mindMap';
import { metroMapLayout } from './layouts/metroMap';
import { galaxySpiralCompactLayout } from './layouts/galaxySpiralCompact';

const nodeTypes = {
  phase: PhaseNode,
  task: TaskNode,
  phaseEnhanced: PhaseNodeEnhanced,
  taskEnhanced: TaskNodeEnhanced,
  taskCompact: TaskNodeCompact,
  phaseCompact: PhaseNodeCompact,
};

// Layout algorithms
const layoutAlgorithms = {
  hierarchical: (phases, tasks) => {
    const nodes = [];
    const edges = [];

    let yOffset = 0;
    const xPhaseSpacing = 450;
    const yPhaseSpacing = 400;

    phases.forEach((phase, phaseIndex) => {
      // Add phase node
      nodes.push({
        id: phase.id,
        type: 'phase',
        data: phase,
        position: { x: phaseIndex * xPhaseSpacing, y: yOffset },
      });

      // Add task nodes for this phase
      const tasksInPhase = tasks.filter((t) => t.phase === phase.id);
      const taskYStart = yOffset + 150;

      tasksInPhase.forEach((task, taskIndex) => {
        const tasksPerRow = 3;
        const taskXOffset = (taskIndex % tasksPerRow) * 280;
        const taskYOffset = Math.floor(taskIndex / tasksPerRow) * 180;
        const taskX = phaseIndex * xPhaseSpacing - 280 + taskXOffset;
        const taskY = taskYStart + taskYOffset;

        nodes.push({
          id: task.id,
          type: 'task',
          data: task,
          position: { x: taskX, y: taskY },
        });

        // Connect task to phase
        edges.push({
          id: `${phase.id}-${task.id}`,
          source: phase.id,
          target: task.id,
          type: 'smoothstep',
          animated: task.status === 'in-progress',
          style: {
            stroke: task.status === 'completed' ? '#10b981' : phase.color,
            strokeWidth: 2,
          },
        });
      });

      yOffset += yPhaseSpacing + Math.ceil(tasksInPhase.length / 3) * 180;
    });

    return { nodes, edges };
  },

  timeline: (phases, tasks) => {
    const nodes = [];
    const edges = [];

    const xPhaseSpacing = 600;
    const yPhaseY = 200;
    const yTasksStart = 400;

    phases.forEach((phase, phaseIndex) => {
      const phaseX = phaseIndex * xPhaseSpacing + 300;

      // Add phase node
      nodes.push({
        id: phase.id,
        type: 'phase',
        data: phase,
        position: { x: phaseX, y: yPhaseY },
      });

      // Add task nodes vertically below phase
      const tasksInPhase = tasks.filter((t) => t.phase === phase.id);

      tasksInPhase.forEach((task, taskIndex) => {
        const taskY = yTasksStart + taskIndex * 160;

        nodes.push({
          id: task.id,
          type: 'task',
          data: task,
          position: { x: phaseX - 100, y: taskY },
        });

        // Connect task to phase
        edges.push({
          id: `${phase.id}-${task.id}`,
          source: phase.id,
          target: task.id,
          type: 'smoothstep',
          animated: task.status === 'in-progress',
          style: {
            stroke: task.status === 'completed' ? '#10b981' : phase.color,
            strokeWidth: 2,
          },
        });
      });

      // Connect phases horizontally
      if (phaseIndex > 0) {
        edges.push({
          id: `phase-${phaseIndex - 1}-${phaseIndex}`,
          source: phases[phaseIndex - 1].id,
          target: phase.id,
          type: 'smoothstep',
          animated: phase.status === 'in-progress',
          style: {
            stroke: '#9333ea',
            strokeWidth: 3,
            strokeDasharray: '5,5',
          },
        });
      }
    });

    return { nodes, edges };
  },

  forceDirected: (phases, tasks) => {
    const nodes = [];
    const edges = [];

    // Center point
    const centerX = 800;
    const centerY = 400;
    const phaseRadius = 400;

    phases.forEach((phase, phaseIndex) => {
      const angle = (phaseIndex / phases.length) * 2 * Math.PI;
      const phaseX = centerX + Math.cos(angle) * phaseRadius;
      const phaseY = centerY + Math.sin(angle) * phaseRadius;

      // Add phase node
      nodes.push({
        id: phase.id,
        type: 'phase',
        data: phase,
        position: { x: phaseX, y: phaseY },
      });

      // Add task nodes in a cluster around phase
      const tasksInPhase = tasks.filter((t) => t.phase === phase.id);
      const taskRadius = 250;

      tasksInPhase.forEach((task, taskIndex) => {
        const taskAngle = (taskIndex / tasksInPhase.length) * 2 * Math.PI;
        const taskX = phaseX + Math.cos(taskAngle) * taskRadius;
        const taskY = phaseY + Math.sin(taskAngle) * taskRadius;

        nodes.push({
          id: task.id,
          type: 'task',
          data: task,
          position: { x: taskX, y: taskY },
        });

        // Connect task to phase
        edges.push({
          id: `${phase.id}-${task.id}`,
          source: phase.id,
          target: task.id,
          type: 'straight',
          animated: task.status === 'in-progress',
          style: {
            stroke: task.status === 'completed' ? '#10b981' : phase.color,
            strokeWidth: 2,
            opacity: 0.6,
          },
        });
      });

      // Connect phases in a circle
      const nextPhaseIndex = (phaseIndex + 1) % phases.length;
      edges.push({
        id: `phase-${phaseIndex}-${nextPhaseIndex}`,
        source: phase.id,
        target: phases[nextPhaseIndex].id,
        type: 'smoothstep',
        animated: phases[nextPhaseIndex].status === 'in-progress',
        style: {
          stroke: '#9333ea',
          strokeWidth: 3,
          strokeDasharray: '5,5',
          opacity: 0.4,
        },
      });
    });

    return { nodes, edges };
  },

  // New layouts
  radialBurst: radialBurstLayout,
  galaxySpiral: galaxySpiralLayout,
  organicClusters: organicClustersLayout,
  swimLanes: swimLanesLayout,
  networkGraph: networkGraphLayout,
  matrixView: matrixViewLayout,
  // Compact node layouts
  constellation: constellationLayout,
  mindMap: mindMapLayout,
  metroMap: metroMapLayout,
  galaxyCompact: galaxySpiralCompactLayout,
};

export default function DendriteNetworkReactFlow({ onClose }) {
  const [layoutType, setLayoutType] = useState('hierarchical');

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
    { id: 'hierarchical', name: 'Jerárquico', icon: LayoutGrid, description: 'Vista clásica por fases' },
    { id: 'timeline', name: 'Timeline', icon: Calendar, description: 'Línea temporal horizontal' },
    { id: 'forceDirected', name: 'Red Circular', icon: Network, description: 'Fases en círculo' },
    { id: 'radialBurst', name: 'Radial', icon: Sparkles, description: 'Explosión radial desde el centro' },
    { id: 'galaxySpiral', name: 'Galaxia', icon: Orbit, description: 'Espiral galáctica' },
    { id: 'organicClusters', name: 'Orgánico', icon: Droplets, description: 'Agrupación física natural' },
    { id: 'swimLanes', name: 'Carriles', icon: Rows, description: 'Carriles por estado' },
    { id: 'networkGraph', name: 'Grafo Red', icon: Share2, description: 'Red social completa' },
    { id: 'matrixView', name: 'Matriz', icon: Grid3x3, description: 'Vista de cuadrícula' },
    // New compact layouts
    { id: 'constellation', name: 'Constelación', icon: Stars, description: 'Nodos compactos en forma de estrellas' },
    { id: 'mindMap', name: 'MindMap', icon: Brain, description: 'Mapa mental radial desde el centro' },
    { id: 'metroMap', name: 'Metro', icon: TrainFront, description: 'Estilo mapa de metro/subway' },
    { id: 'galaxyCompact', name: 'Galaxia Pro', icon: Orbit, description: 'Galaxia mejorada con nodos compactos' },
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
              if (node.type === 'phase' || node.type === 'phaseEnhanced' || node.type === 'phaseCompact') {
                return node.data.status === 'completed' ? '#10b981' : node.data.color || '#9333ea';
              }
              if (node.type === 'task' || node.type === 'taskEnhanced' || node.type === 'taskCompact') {
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
          <Panel position="bottom-left" className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-w-[800px]">
            <div className="text-white text-xs font-bold mb-3 opacity-75 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Visualizaciones
            </div>
            <div className="grid grid-cols-4 gap-2">
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
