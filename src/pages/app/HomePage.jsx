/**
 * HomePage
 *
 * Main dashboard page showing stats, streak, and session CTA.
 * Fetches real user data from Supabase via hooks.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftFortHome from '../../components/home/SoftFortHome';
import { ROUTES } from '../../router/routes';
import { useActivityData } from '../../hooks/useActivityData';
import { useTopics } from '../../hooks/useTopics';
import { useAuth } from '../../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalStats, streak, weeklyImprovement, fetchActivityData } = useActivityData();
  const { getFortalezaData } = useTopics();

  // Fetch activity data on mount
  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const fortalezaData = getFortalezaData();

  const handleStartSession = () => {
    navigate(ROUTES.STUDY);
  };

  const handleTopicSelect = (topic) => {
    navigate(ROUTES.STUDY, { state: { topic, mode: 'practica-tema' } });
  };

  const handleViewAllTopics = () => {
    navigate(ROUTES.TEMAS);
  };

  const handleNavigate = (page) => {
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
      userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'}
      totalStats={totalStats}
      weeklyImprovement={weeklyImprovement}
      streakData={{ current: streak, longest: streak }}
      fortalezaData={fortalezaData}
      onStartSession={handleStartSession}
      onTopicSelect={handleTopicSelect}
      onViewAllTopics={handleViewAllTopics}
      onNavigate={handleNavigate}
    />
  );
}
