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
  const { topics, topicsByBlock, loading } = useTopics();

  const handleTopicSelect = (topic) => {
    navigate(ROUTES.STUDY, { state: { topic } });
  };

  return (
    <TemasListView
      topics={topics}
      topicsByBlock={topicsByBlock}
      loading={loading}
      onTopicSelect={handleTopicSelect}
    />
  );
}
