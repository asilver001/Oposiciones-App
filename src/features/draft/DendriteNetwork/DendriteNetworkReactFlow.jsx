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
import { X, LayoutGrid, Calendar, Network } from 'lucide-react';
import projectState from './projectState.json';

const nodeTypes = {
  phase: PhaseNode,
  task: TaskNode,
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
    { id: 'hierarchical', name: 'Jerárquico', icon: LayoutGrid },
    { id: 'timeline', name: 'Timeline', icon: Calendar },
    { id: 'forceDirected', name: 'Red', icon: Network },
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
              if (node.type === 'phase') {
                return node.data.status === 'completed' ? '#10b981' : node.data.color;
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
          <Panel position="bottom-left" className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="text-white text-xs font-semibold mb-2 opacity-75">LAYOUT</div>
            <div className="flex gap-2">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                const isActive = layoutType === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setLayoutType(option.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-white/20 text-white/70 hover:bg-white/30'
                    }`}
                    title={option.name}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{option.name}</span>
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
