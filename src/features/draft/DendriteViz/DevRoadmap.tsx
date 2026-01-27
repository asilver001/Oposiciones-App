/**
 * DevRoadmap Component
 *
 * Internal development dashboard showing project progress
 * using the DendriteGraph visualization.
 */

import { useState, useMemo, useCallback } from 'react';
import { DendriteGraph } from './DendriteGraph';
import type { GraphData, GraphNode, ActivityItem } from './types';

// Project phases and tasks
const PROJECT_DATA: GraphData = {
  nodes: [
    // Core - Center
    {
      id: 'core',
      label: 'OpositaSmart',
      description: 'Aplicación principal',
      size: 'large',
      status: 'in_progress',
      icon: '🎯',
      progress: 65,
    },

    // Phase 1 - Authentication
    {
      id: 'auth',
      label: 'Autenticación',
      description: 'Login, registro, recuperación',
      size: 'medium',
      status: 'completed',
      parentId: 'core',
      icon: '🔐',
      progress: 100,
    },
    {
      id: 'auth-login',
      label: 'Login',
      size: 'small',
      status: 'completed',
      parentId: 'auth',
    },
    {
      id: 'auth-signup',
      label: 'Registro',
      size: 'small',
      status: 'completed',
      parentId: 'auth',
    },
    {
      id: 'auth-recovery',
      label: 'Recuperar contraseña',
      size: 'small',
      status: 'completed',
      parentId: 'auth',
    },

    // Phase 2 - Onboarding
    {
      id: 'onboarding',
      label: 'Onboarding',
      description: 'Flujo de bienvenida',
      size: 'medium',
      status: 'completed',
      parentId: 'core',
      icon: '👋',
      progress: 100,
    },
    {
      id: 'onb-oposicion',
      label: 'Selección oposición',
      size: 'small',
      status: 'completed',
      parentId: 'onboarding',
    },
    {
      id: 'onb-tiempo',
      label: 'Tiempo disponible',
      size: 'small',
      status: 'completed',
      parentId: 'onboarding',
    },
    {
      id: 'onb-fecha',
      label: 'Fecha examen',
      size: 'small',
      status: 'completed',
      parentId: 'onboarding',
    },

    // Phase 3 - Study System
    {
      id: 'study',
      label: 'Sistema de Estudio',
      description: 'Sesiones y algoritmo FSRS',
      size: 'medium',
      status: 'in_progress',
      parentId: 'core',
      icon: '📚',
      progress: 75,
    },
    {
      id: 'study-session',
      label: 'Sesión híbrida',
      size: 'small',
      status: 'completed',
      parentId: 'study',
    },
    {
      id: 'study-fsrs',
      label: 'Algoritmo FSRS',
      size: 'small',
      status: 'completed',
      parentId: 'study',
    },
    {
      id: 'study-review',
      label: 'Repaso espaciado',
      size: 'small',
      status: 'in_progress',
      parentId: 'study',
      progress: 60,
    },

    // Phase 4 - Questions Bank
    {
      id: 'questions',
      label: 'Banco de Preguntas',
      description: 'Gestión y contenido',
      size: 'medium',
      status: 'in_progress',
      parentId: 'core',
      icon: '❓',
      progress: 40,
    },
    {
      id: 'q-import',
      label: 'Importador',
      size: 'small',
      status: 'completed',
      parentId: 'questions',
    },
    {
      id: 'q-review',
      label: 'Panel de revisión',
      size: 'small',
      status: 'completed',
      parentId: 'questions',
    },
    {
      id: 'q-content',
      label: 'Contenido CE',
      size: 'small',
      status: 'in_progress',
      parentId: 'questions',
      progress: 35,
    },

    // Phase 5 - Progress & Stats
    {
      id: 'progress',
      label: 'Progreso',
      description: 'Estadísticas y visualización',
      size: 'medium',
      status: 'in_progress',
      parentId: 'core',
      icon: '📊',
      progress: 50,
    },
    {
      id: 'prog-stats',
      label: 'Estadísticas',
      size: 'small',
      status: 'completed',
      parentId: 'progress',
    },
    {
      id: 'prog-fortaleza',
      label: 'Fortaleza visual',
      size: 'small',
      status: 'in_progress',
      parentId: 'progress',
      progress: 70,
    },
    {
      id: 'prog-dendrite',
      label: 'Dendrite Network',
      size: 'small',
      status: 'in_progress',
      parentId: 'progress',
      progress: 30,
    },

    // Phase 6 - Admin
    {
      id: 'admin',
      label: 'Administración',
      description: 'Panel de gestión',
      size: 'medium',
      status: 'completed',
      parentId: 'core',
      icon: '⚙️',
      progress: 100,
    },
    {
      id: 'admin-panel',
      label: 'Panel admin',
      size: 'small',
      status: 'completed',
      parentId: 'admin',
    },
    {
      id: 'admin-reviewer',
      label: 'Panel revisión',
      size: 'small',
      status: 'completed',
      parentId: 'admin',
    },

    // Phase 7 - Future
    {
      id: 'future',
      label: 'Próximas Features',
      description: 'En planificación',
      size: 'medium',
      status: 'pending',
      parentId: 'core',
      icon: '🚀',
    },
    {
      id: 'future-premium',
      label: 'Sistema Premium',
      size: 'small',
      status: 'pending',
      parentId: 'future',
    },
    {
      id: 'future-social',
      label: 'Features sociales',
      size: 'small',
      status: 'pending',
      parentId: 'future',
    },
    {
      id: 'future-ai',
      label: 'Tutor IA',
      size: 'small',
      status: 'pending',
      parentId: 'future',
    },
  ],
  links: [
    // Core connections
    { source: 'core', target: 'auth' },
    { source: 'core', target: 'onboarding' },
    { source: 'core', target: 'study' },
    { source: 'core', target: 'questions' },
    { source: 'core', target: 'progress' },
    { source: 'core', target: 'admin' },
    { source: 'core', target: 'future' },

    // Auth children
    { source: 'auth', target: 'auth-login' },
    { source: 'auth', target: 'auth-signup' },
    { source: 'auth', target: 'auth-recovery' },

    // Onboarding children
    { source: 'onboarding', target: 'onb-oposicion' },
    { source: 'onboarding', target: 'onb-tiempo' },
    { source: 'onboarding', target: 'onb-fecha' },

    // Study children
    { source: 'study', target: 'study-session' },
    { source: 'study', target: 'study-fsrs' },
    { source: 'study', target: 'study-review' },

    // Questions children
    { source: 'questions', target: 'q-import' },
    { source: 'questions', target: 'q-review' },
    { source: 'questions', target: 'q-content' },

    // Progress children
    { source: 'progress', target: 'prog-stats' },
    { source: 'progress', target: 'prog-fortaleza' },
    { source: 'progress', target: 'prog-dendrite' },

    // Admin children
    { source: 'admin', target: 'admin-panel' },
    { source: 'admin', target: 'admin-reviewer' },

    // Future children
    { source: 'future', target: 'future-premium' },
    { source: 'future', target: 'future-social' },
    { source: 'future', target: 'future-ai' },

    // Cross-dependencies
    { source: 'auth', target: 'onboarding' },
    { source: 'onboarding', target: 'study' },
    { source: 'questions', target: 'study' },
    { source: 'study', target: 'progress' },
    { source: 'admin', target: 'questions' },
  ],
};

// Simulated recent activity
const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'completed',
    nodeId: 'admin-reviewer',
    nodeLabel: 'Panel revisión',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  {
    id: '2',
    type: 'updated',
    nodeId: 'prog-dendrite',
    nodeLabel: 'Dendrite Network',
    timestamp: Date.now() - 1000 * 60 * 60,
  },
  {
    id: '3',
    type: 'created',
    nodeId: 'future-ai',
    nodeLabel: 'Tutor IA',
    timestamp: Date.now() - 1000 * 60 * 120,
  },
  {
    id: '4',
    type: 'completed',
    nodeId: 'q-review',
    nodeLabel: 'Panel de revisión',
    timestamp: Date.now() - 1000 * 60 * 180,
  },
];

export function DevRoadmap() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Filter nodes by status
  const filteredData = useMemo(() => {
    if (!filterStatus) return PROJECT_DATA;

    const filteredNodes = PROJECT_DATA.nodes.filter(
      node => node.status === filterStatus
    );
    const nodeIds = new Set(filteredNodes.map(n => n.id));

    // Keep links where both source and target are in filtered nodes
    const filteredLinks = PROJECT_DATA.links.filter(
      link => nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [filterStatus]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dev Roadmap</h1>
            <p className="text-sm text-gray-400">
              Visualización del progreso del proyecto
            </p>
          </div>

          {/* Status filters */}
          <div className="flex gap-2">
            {[
              { value: null, label: 'Todos', color: 'gray' },
              { value: 'completed', label: 'Completado', color: 'emerald' },
              { value: 'in_progress', label: 'En progreso', color: 'amber' },
              { value: 'pending', label: 'Pendiente', color: 'gray' },
            ].map(filter => (
              <button
                key={filter.value ?? 'all'}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === filter.value
                    ? `bg-${filter.color}-500/20 text-${filter.color}-400 ring-1 ring-${filter.color}-500/50`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <DendriteGraph
          data={filteredData}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          showStats
          showActivityFeed
          activityItems={RECENT_ACTIVITY}
          visual={{
            backgroundColor: '#0a0a0f',
            glowEnabled: true,
          }}
          physics={{
            centerForce: 0.015,
            repelForce: 180,
          }}
        />

        {/* Selected node panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-72 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {selectedNode.icon && (
                  <span className="text-2xl">{selectedNode.icon}</span>
                )}
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedNode.label}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedNode.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : selectedNode.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-400'
                          : selectedNode.status === 'blocked'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {selectedNode.status === 'completed'
                      ? 'Completado'
                      : selectedNode.status === 'in_progress'
                        ? 'En progreso'
                        : selectedNode.status === 'blocked'
                          ? 'Bloqueado'
                          : 'Pendiente'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {selectedNode.description && (
              <p className="text-sm text-gray-400 mb-3">
                {selectedNode.description}
              </p>
            )}

            {selectedNode.progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progreso</span>
                  <span className="text-white">{selectedNode.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${selectedNode.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Connected nodes */}
            <div className="text-xs">
              <div className="text-gray-500 uppercase tracking-wider mb-1">
                Conexiones
              </div>
              <div className="flex flex-wrap gap-1">
                {PROJECT_DATA.links
                  .filter(
                    l =>
                      l.source === selectedNode.id ||
                      l.target === selectedNode.id
                  )
                  .map(link => {
                    const connectedId =
                      link.source === selectedNode.id
                        ? link.target
                        : link.source;
                    const connectedNode = PROJECT_DATA.nodes.find(
                      n => n.id === connectedId
                    );
                    return connectedNode ? (
                      <button
                        key={connectedId}
                        onClick={() => setSelectedNode(connectedNode)}
                        className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-gray-300"
                      >
                        {connectedNode.label}
                      </button>
                    ) : null;
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 p-3 border-t border-white/10 bg-black/40">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Bloqueado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevRoadmap;
