/**
 * TemasPage
 *
 * Topics list and progress view with optional roadmap visualization.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Network } from 'lucide-react';
import TemasListView from '../../components/temas/TemasListView';
import TopicRoadmap from '../../components/temas/TopicRoadmap';
import { ROUTES } from '../../router/routes';
import { useTopics } from '../../hooks/useTopics';

export default function TemasPage() {
  const navigate = useNavigate();
  const { topics, topicsByBlock, userProgress, loading } = useTopics();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'roadmap'

  const handleTopicSelect = (topic) => {
    navigate(ROUTES.STUDY, { state: { topic, mode: 'practica-tema' } });
  };

  // Enrich topics with progress for roadmap
  const enrichedTopics = useMemo(() => {
    return topics.map(topic => {
      const progressKey = topic.number ?? topic.id;
      const progress = userProgress[progressKey] || {};
      const totalCards = (progress.new || 0) + (progress.learning || 0) +
        (progress.review || 0) + (progress.relearning || 0);

      let status = 'nuevo';
      if (totalCards === 0 && !progress.sessionsCompleted) {
        status = 'nuevo';
      } else if (progress.masteryRate >= 80 && progress.accuracy >= 75) {
        status = 'dominado';
      } else if (progress.masteryRate >= 50 || progress.accuracy >= 65) {
        status = 'avanzando';
      } else if (progress.relearning > 0 || progress.accuracy < 50) {
        status = totalCards > 0 ? 'riesgo' : 'progreso';
      } else {
        status = 'progreso';
      }

      return {
        ...topic,
        progress: progress.masteryRate || 0,
        status,
        accuracy: progress.accuracy || 0,
        questionsAnswered: totalCards,
        questionsTotal: topic.questionCount || 20
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
      </div>

      {viewMode === 'list' ? (
        <TemasListView
          topics={topics}
          topicsByBlock={topicsByBlock}
          userProgress={userProgress}
          loading={loading}
          onTopicSelect={handleTopicSelect}
        />
      ) : (
        <TopicRoadmap
          topics={enrichedTopics}
          userProgress={userProgress}
          onTopicSelect={handleTopicSelect}
        />
      )}
    </div>
  );
}
