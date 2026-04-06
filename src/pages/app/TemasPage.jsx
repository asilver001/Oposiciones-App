/**
 * TemasPage
 *
 * Topics list and progress view with optional roadmap visualization.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Network, Hexagon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GuestLock from '../../components/common/GuestLock';
import TemasListView from '../../components/temas/TemasListView';
import TopicRoadmap from '../../components/temas/TopicRoadmap';
import { TemarioDendrite } from '../../features/draft/TemarioGraph';
import { ROUTES } from '../../router/routes';
import { useTopics } from '../../hooks/useTopics';

export default function TemasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { topics, topicsByBlock, userProgress, loading } = useTopics();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'roadmap' | 'dendrite'

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

  const pageContent = (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* View Toggle */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setViewMode('list')}
          className="p-2 rounded-lg transition-colors"
          style={viewMode === 'list' ? { background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' } : { color: '#9CA3AF' }}
          title="Vista lista"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('roadmap')}
          className="p-2 rounded-lg transition-colors"
          style={viewMode === 'roadmap' ? { background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' } : { color: '#9CA3AF' }}
          title="Vista roadmap"
        >
          <Network className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('dendrite')}
          className="p-2 rounded-lg transition-colors"
          style={viewMode === 'dendrite' ? { background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' } : { color: '#9CA3AF' }}
          title="Vista mapa"
        >
          <Hexagon className="w-5 h-5" />
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
    </div>
  );

  if (!user) {
    return <GuestLock message="Crea una cuenta para estudiar por temas y ver tu progreso">{pageContent}</GuestLock>;
  }

  return pageContent;
}
