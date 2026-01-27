/**
 * OpositaUniverse Component
 *
 * User-facing study progress visualization showing their
 * learning journey through the oposición topics.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { DendriteGraph } from './DendriteGraph';
import type { GraphData, GraphNode, NodeStatus, ActivityItem } from './types';

// Topic data structure for AGE oposición
interface TopicProgress {
  id: string;
  title: string;
  shortTitle: string;
  parent?: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  masteryLevel: number; // 0-100
}

// Convert mastery level to node status
function getMasteryStatus(mastery: number): NodeStatus {
  if (mastery >= 90) return 'completed';
  if (mastery >= 50) return 'in_progress';
  if (mastery > 0) return 'in_progress';
  return 'pending';
}

// Generate graph data from topic progress
function generateGraphFromTopics(topics: TopicProgress[]): GraphData {
  const nodes: GraphNode[] = [
    // Central node
    {
      id: 'oposicion',
      label: 'Tu Oposición',
      description: 'Auxiliar Administrativo AGE',
      size: 'large',
      status: 'in_progress',
      icon: '🎯',
    },
  ];

  const links: GraphData['links'] = [];

  // Add topic nodes
  topics.forEach(topic => {
    const status = getMasteryStatus(topic.masteryLevel);

    nodes.push({
      id: topic.id,
      label: topic.shortTitle,
      description: topic.title,
      size: topic.parent ? 'small' : 'medium',
      status,
      parentId: topic.parent || 'oposicion',
      progress: topic.masteryLevel,
      metadata: {
        totalQuestions: topic.totalQuestions,
        answeredQuestions: topic.answeredQuestions,
        correctAnswers: topic.correctAnswers,
      },
    });

    // Link to parent
    links.push({
      source: topic.parent || 'oposicion',
      target: topic.id,
    });
  });

  return { nodes, links };
}

// Sample topic data (would come from props/API in production)
const SAMPLE_TOPICS: TopicProgress[] = [
  // Constitución
  {
    id: 'ce',
    title: 'La Constitución Española',
    shortTitle: 'Constitución',
    totalQuestions: 150,
    answeredQuestions: 120,
    correctAnswers: 96,
    masteryLevel: 80,
  },
  {
    id: 'ce-titulo-preliminar',
    title: 'Título Preliminar',
    shortTitle: 'T. Preliminar',
    parent: 'ce',
    totalQuestions: 30,
    answeredQuestions: 30,
    correctAnswers: 28,
    masteryLevel: 93,
  },
  {
    id: 'ce-titulo-1',
    title: 'Derechos Fundamentales',
    shortTitle: 'Derechos Fund.',
    parent: 'ce',
    totalQuestions: 40,
    answeredQuestions: 35,
    correctAnswers: 28,
    masteryLevel: 70,
  },
  {
    id: 'ce-titulo-2',
    title: 'La Corona',
    shortTitle: 'Corona',
    parent: 'ce',
    totalQuestions: 20,
    answeredQuestions: 18,
    correctAnswers: 15,
    masteryLevel: 75,
  },
  {
    id: 'ce-titulo-3',
    title: 'Las Cortes Generales',
    shortTitle: 'Cortes',
    parent: 'ce',
    totalQuestions: 30,
    answeredQuestions: 20,
    correctAnswers: 12,
    masteryLevel: 40,
  },
  {
    id: 'ce-titulo-4',
    title: 'Gobierno y Administración',
    shortTitle: 'Gobierno',
    parent: 'ce',
    totalQuestions: 30,
    answeredQuestions: 17,
    correctAnswers: 13,
    masteryLevel: 43,
  },

  // Procedimiento Administrativo
  {
    id: 'lpac',
    title: 'Procedimiento Administrativo',
    shortTitle: 'LPAC',
    totalQuestions: 100,
    answeredQuestions: 45,
    correctAnswers: 32,
    masteryLevel: 32,
  },
  {
    id: 'lpac-principios',
    title: 'Principios Generales',
    shortTitle: 'Principios',
    parent: 'lpac',
    totalQuestions: 20,
    answeredQuestions: 15,
    correctAnswers: 12,
    masteryLevel: 60,
  },
  {
    id: 'lpac-interesados',
    title: 'Interesados',
    shortTitle: 'Interesados',
    parent: 'lpac',
    totalQuestions: 15,
    answeredQuestions: 10,
    correctAnswers: 7,
    masteryLevel: 47,
  },
  {
    id: 'lpac-actos',
    title: 'Actos Administrativos',
    shortTitle: 'Actos Admin.',
    parent: 'lpac',
    totalQuestions: 25,
    answeredQuestions: 12,
    correctAnswers: 8,
    masteryLevel: 27,
  },
  {
    id: 'lpac-silencio',
    title: 'Silencio Administrativo',
    shortTitle: 'Silencio',
    parent: 'lpac',
    totalQuestions: 15,
    answeredQuestions: 5,
    correctAnswers: 3,
    masteryLevel: 20,
  },
  {
    id: 'lpac-recursos',
    title: 'Recursos',
    shortTitle: 'Recursos',
    parent: 'lpac',
    totalQuestions: 25,
    answeredQuestions: 3,
    correctAnswers: 2,
    masteryLevel: 8,
  },

  // Régimen Jurídico
  {
    id: 'lrjsp',
    title: 'Régimen Jurídico Sector Público',
    shortTitle: 'LRJSP',
    totalQuestions: 80,
    answeredQuestions: 20,
    correctAnswers: 14,
    masteryLevel: 18,
  },
  {
    id: 'lrjsp-org',
    title: 'Organización',
    shortTitle: 'Organización',
    parent: 'lrjsp',
    totalQuestions: 30,
    answeredQuestions: 12,
    correctAnswers: 9,
    masteryLevel: 30,
  },
  {
    id: 'lrjsp-func',
    title: 'Funcionamiento',
    shortTitle: 'Funcionamiento',
    parent: 'lrjsp',
    totalQuestions: 25,
    answeredQuestions: 5,
    correctAnswers: 3,
    masteryLevel: 12,
  },
  {
    id: 'lrjsp-resp',
    title: 'Responsabilidad',
    shortTitle: 'Responsabilidad',
    parent: 'lrjsp',
    totalQuestions: 25,
    answeredQuestions: 3,
    correctAnswers: 2,
    masteryLevel: 8,
  },

  // EBEP
  {
    id: 'ebep',
    title: 'Estatuto Básico Empleado Público',
    shortTitle: 'EBEP',
    totalQuestions: 70,
    answeredQuestions: 0,
    correctAnswers: 0,
    masteryLevel: 0,
  },
  {
    id: 'ebep-derechos',
    title: 'Derechos y Deberes',
    shortTitle: 'Derechos',
    parent: 'ebep',
    totalQuestions: 25,
    answeredQuestions: 0,
    correctAnswers: 0,
    masteryLevel: 0,
  },
  {
    id: 'ebep-situaciones',
    title: 'Situaciones Administrativas',
    shortTitle: 'Situaciones',
    parent: 'ebep',
    totalQuestions: 20,
    answeredQuestions: 0,
    correctAnswers: 0,
    masteryLevel: 0,
  },
  {
    id: 'ebep-disciplinario',
    title: 'Régimen Disciplinario',
    shortTitle: 'Disciplinario',
    parent: 'ebep',
    totalQuestions: 25,
    answeredQuestions: 0,
    correctAnswers: 0,
    masteryLevel: 0,
  },
];

interface OpositaUniverseProps {
  topics?: TopicProgress[];
  onTopicClick?: (topicId: string) => void;
  className?: string;
}

export function OpositaUniverse({
  topics = SAMPLE_TOPICS,
  onTopicClick,
  className = '',
}: OpositaUniverseProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Generate graph data
  const graphData = useMemo(() => generateGraphFromTopics(topics), [topics]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totals = topics.reduce(
      (acc, topic) => {
        if (!topic.parent) {
          // Only count main topics, not subtopics
          acc.totalQuestions += topic.totalQuestions;
          acc.answeredQuestions += topic.answeredQuestions;
          acc.correctAnswers += topic.correctAnswers;
        }
        return acc;
      },
      { totalQuestions: 0, answeredQuestions: 0, correctAnswers: 0 }
    );

    const overallMastery =
      totals.totalQuestions > 0
        ? Math.round((totals.correctAnswers / totals.totalQuestions) * 100)
        : 0;

    const completedTopics = topics.filter(
      t => !t.parent && t.masteryLevel >= 90
    ).length;
    const totalTopics = topics.filter(t => !t.parent).length;

    return {
      ...totals,
      overallMastery,
      completedTopics,
      totalTopics,
    };
  }, [topics]);

  // Generate recent activity from topic data
  const recentActivity: ActivityItem[] = useMemo(() => {
    return topics
      .filter(t => t.answeredQuestions > 0)
      .sort((a, b) => b.masteryLevel - a.masteryLevel)
      .slice(0, 5)
      .map((topic, index) => ({
        id: `activity-${topic.id}`,
        type: topic.masteryLevel >= 90 ? 'completed' : 'updated',
        nodeId: topic.id,
        nodeLabel: topic.shortTitle,
        timestamp: Date.now() - index * 1000 * 60 * 60 * 24, // Simulate days
      }));
  }, [topics]);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNode(node);
      if (node.id !== 'oposicion') {
        onTopicClick?.(node.id);
      }
    },
    [onTopicClick]
  );

  return (
    <div
      className={`h-full flex flex-col bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 ${className}`}
    >
      {/* Header with overall progress */}
      <div
        className={`flex-shrink-0 p-4 transition-all duration-700 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">
            Tu Universo de Estudio
          </h1>
          <p className="text-sm text-purple-300/70">
            Explora tu progreso en cada tema
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Dominio general</span>
            <span className="text-purple-300 font-medium">
              {overallStats.overallMastery}%
            </span>
          </div>
          <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full transition-all duration-1000"
              style={{
                width: animateIn ? `${overallStats.overallMastery}%` : '0%',
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {overallStats.completedTopics}/{overallStats.totalTopics} temas
              dominados
            </span>
            <span>
              {overallStats.answeredQuestions}/{overallStats.totalQuestions}{' '}
              preguntas
            </span>
          </div>
        </div>
      </div>

      {/* Graph visualization */}
      <div
        className={`flex-1 relative transition-all duration-1000 delay-300 ${
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <DendriteGraph
          data={graphData}
          onNodeClick={handleNodeClick}
          showActivityFeed={false}
          visual={{
            backgroundColor: 'transparent',
            glowEnabled: true,
            glowColor: '#a855f7',
            statusColors: {
              completed: '#10b981',
              in_progress: '#8b5cf6',
              pending: '#4b5563',
              blocked: '#ef4444',
            },
          }}
          physics={{
            centerForce: 0.02,
            repelForce: 160,
            floatAmplitude: 4,
            floatSpeed: 0.015,
          }}
          parallax={{
            enabled: true,
            strength: 30,
            smoothing: 0.08,
          }}
        />

        {/* Selected topic detail */}
        {selectedNode && selectedNode.id !== 'oposicion' && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm
                       bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/20
                       p-4 shadow-2xl shadow-purple-500/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {selectedNode.description || selectedNode.label}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedNode.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedNode.status === 'in_progress'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {selectedNode.status === 'completed'
                    ? '✓ Dominado'
                    : selectedNode.status === 'in_progress'
                      ? 'En progreso'
                      : 'Por empezar'}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Progress */}
            {selectedNode.progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Dominio</span>
                  <span className="text-white font-medium">
                    {selectedNode.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                    style={{ width: `${selectedNode.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            {selectedNode.metadata && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-white">
                    {selectedNode.metadata.totalQuestions}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase">
                    Preguntas
                  </div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-purple-400">
                    {selectedNode.metadata.answeredQuestions}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase">
                    Respondidas
                  </div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">
                    {selectedNode.metadata.correctAnswers}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase">
                    Correctas
                  </div>
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={() => onTopicClick?.(selectedNode.id)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600
                       text-white font-medium rounded-xl hover:from-purple-500
                       hover:to-pink-500 transition-all active:scale-[0.98]"
            >
              {selectedNode.status === 'pending'
                ? 'Empezar tema'
                : 'Continuar estudiando'}
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className={`flex-shrink-0 p-3 transition-all duration-700 delay-500 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Dominado (≥90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Por empezar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpositaUniverse;
