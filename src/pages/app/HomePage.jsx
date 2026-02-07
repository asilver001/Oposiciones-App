/**
 * HomePage
 *
 * Main dashboard page showing stats, streak, and session CTA.
 */

import { useNavigate } from 'react-router-dom';
import SoftFortHome from '../../components/home/SoftFortHome';
import { ROUTES } from '../../router/routes';

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate(ROUTES.STUDY);
  };

  const handleTopicSelect = (topic) => {
    // Navigate to study with topic context
    navigate(ROUTES.STUDY, { state: { topic } });
  };

  const handleViewAllTopics = () => {
    navigate(ROUTES.TEMAS);
  };

  const handleNavigate = (page) => {
    // Map old page names to routes
    const routeMap = {
      temas: ROUTES.TEMAS,
      actividad: ROUTES.ACTIVIDAD,
      recursos: ROUTES.RECURSOS,
      admin: ROUTES.ADMIN,
    };
    navigate(routeMap[page] || ROUTES.HOME);
  };

  return (
    <SoftFortHome
      showTopBar={false}
      onStartSession={handleStartSession}
      onTopicSelect={handleTopicSelect}
      onViewAllTopics={handleViewAllTopics}
      onNavigate={handleNavigate}
    />
  );
}
