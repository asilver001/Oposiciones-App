/**
 * TemasPage
 *
 * Topics list and progress view.
 */

import { useNavigate } from 'react-router-dom';
import TemasListView from '../../components/temas/TemasListView';
import { ROUTES } from '../../router/routes';
import { useTopics } from '../../hooks/useTopics';

export default function TemasPage() {
  const navigate = useNavigate();
  const { topics, topicsByBlock, userProgress, loading } = useTopics();

  const handleTopicSelect = (topic) => {
    navigate(ROUTES.STUDY, { state: { topic, mode: 'practica-tema' } });
  };

  return (
    <TemasListView
      topics={topics}
      topicsByBlock={topicsByBlock}
      userProgress={userProgress}
      loading={loading}
      onTopicSelect={handleTopicSelect}
    />
  );
}
