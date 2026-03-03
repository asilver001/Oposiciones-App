/**
 * TemasPage
 *
 * Topics list and progress view with optional roadmap visualization.
 */

import { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Network, Hexagon, Globe } from 'lucide-react';
import TemasListView from '../../components/temas/TemasListView';
import TopicRoadmap from '../../components/temas/TopicRoadmap';
import { TemarioDendrite } from '../../features/draft/TemarioGraph';
import { ROUTES } from '../../router/routes';
import { useTopics } from '../../hooks/useTopics';

// Lazy load the 3D graph to avoid bundle size impact
const StudyKnowledgeGraph = lazy(() =>
  import('../../features/draft/StudyGraph/StudyKnowledgeGraph').then(m => ({ default: m.default }))
);

export default function TemasPage() {
  const navigate = useNavigate();
  const { topics, topicsByBlock, userProgress, loading } = useTopics();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'roadmap' | 'dendrite' | 'graph3d'

  const handleTopicSelect = (topic) => {
    navigate(ROUTES.STUDY, { state: { topic, mode: 'practica-tema' } });
  };

  // Question counts for the dendrite view (topicNumber -> count)
  const questionCounts = useMemo(() => {
    const counts = {};
    topics.forEach(t => {
      if (t.number != null) {
        counts[t.number] = (counts[t.number] || 0) + (t.questionCount || 0);
      }
    });
    return counts;
  }, [topics]);

  const handleDendriteStudy = (node) => {
    const topic = topics.find(t => t.number === node.id);
    if (topic) handleTopicSelect(topic);
  };

  // Transform topics for 3D graph visualization
  const graphTopics = useMemo(() => {
    // Map topic blocks to categories
    const blockToCategory = {
      'Constitución Española': 'Constitucion',
      'Administración General': 'Gobierno',
      'LRJSP': 'LRJSP',
      'LPAC': 'LPAC',
      'Empleo Público': 'EBEP',
    };

    return topics.map(topic => {
      const progressKey = topic.number ?? topic.id;
      const progress = userProgress[progressKey] || {};
      const questionsAnswered = progress.answered || progress.sessionQuestions || 0;
      const questionsTotal = topic.questionCount || 20;
      const accuracy = progress.accuracy || 0;

      // Determine category from block name
      let category = 'Otros';
      if (topic.block) {
        for (const [blockPattern, cat] of Object.entries(blockToCategory)) {
          if (topic.block.includes(blockPattern) || topic.name?.includes(blockPattern)) {
            category = cat;
            break;
          }
        }
      }
      // Also check topic name for category hints
      if (category === 'Otros' && topic.name) {
        if (topic.name.includes('Constitución') || topic.name.includes('Corona') || topic.name.includes('Cortes')) {
          category = 'Constitucion';
        } else if (topic.name.includes('LPAC') || topic.name.includes('Procedimiento')) {
          category = 'LPAC';
        } else if (topic.name.includes('LRJSP')) {
          category = 'LRJSP';
        } else if (topic.name.includes('EBEP') || topic.name.includes('TREBEP') || topic.name.includes('Empleo')) {
          category = 'EBEP';
        } else if (topic.name.includes('Gobierno') || topic.name.includes('Ley 50') || topic.name.includes('Ley 40')) {
          category = 'Gobierno';
        }
      }

      return {
        id: `t${topic.number || topic.id}`,
        name: topic.name?.length > 25 ? topic.name.substring(0, 22) + '...' : (topic.name || `Tema ${topic.number}`),
        fullName: topic.name || `Tema ${topic.number}`,
        tema: topic.number || 0,
        category,
        progress: questionsTotal > 0 ? Math.round((questionsAnswered / questionsTotal) * 100) : 0,
        questionsTotal,
        questionsAnswered,
        accuracy,
      };
    });
  }, [topics, userProgress]);

  // Enrich topics with progress for roadmap (session-based)
  const enrichedTopics = useMemo(() => {
    return topics.map(topic => {
      const progressKey = topic.number ?? topic.id;
      const progress = userProgress[progressKey] || {};
      const questionsAnswered = progress.answered || progress.sessionQuestions || 0;

      // Status based on session accuracy
      let status = 'nuevo';
      if (questionsAnswered === 0 && !progress.sessionsCompleted) {
        status = 'nuevo';
      } else if (progress.accuracy >= 80) {
        status = 'dominado';
      } else if (progress.accuracy >= 60) {
        status = 'avanzando';
      } else if (progress.accuracy < 50 && questionsAnswered > 0) {
        status = 'riesgo';
      } else {
        status = 'progreso';
      }

      return {
        ...topic,
        progress: progress.accuracy || 0,
        status,
        accuracy: progress.accuracy || 0,
        questionsAnswered,
        questionsTotal: topic.questionCount || 20,
        sessionsCompleted: progress.sessionsCompleted || 0
      };
    });
  }, [topics, userProgress]);

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista lista"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('roadmap')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'roadmap'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista roadmap"
        >
          <Network className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('dendrite')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'dendrite'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista mapa"
        >
          <Hexagon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('graph3d')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'graph3d'
              ? 'bg-brand-100 text-brand-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista 3D"
        >
          <Globe className="w-5 h-5" />
        </button>
      </div>

      {viewMode === 'list' && (
        <TemasListView
          topics={topics}
          topicsByBlock={topicsByBlock}
          userProgress={userProgress}
          loading={loading}
          onTopicSelect={handleTopicSelect}
        />
      )}
      {viewMode === 'roadmap' && (
        <TopicRoadmap
          topics={enrichedTopics}
          userProgress={userProgress}
          onTopicSelect={handleTopicSelect}
        />
      )}
      {viewMode === 'dendrite' && (
        <div className="h-[650px] bg-slate-50 rounded-2xl overflow-hidden border border-gray-200">
          <TemarioDendrite
            userProgress={userProgress}
            questionCounts={questionCounts}
            onStudy={handleDendriteStudy}
          />
        </div>
      )}
      {viewMode === 'graph3d' && (
        <Suspense fallback={
          <div className="h-[650px] bg-slate-900 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Cargando grafo 3D...</p>
            </div>
          </div>
        }>
          <div className="h-[650px] rounded-2xl overflow-hidden">
            <StudyKnowledgeGraph
              topics={graphTopics}
              onTopicClick={(topic) => {
                const originalTopic = topics.find(t => t.number === topic.tema);
                if (originalTopic) handleTopicSelect(originalTopic);
              }}
              height={650}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}
