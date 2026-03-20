/**
 * HomePage
 *
 * Main dashboard page showing stats, streak, and session CTA.
 * Integrates StudyPlanEngine to show "Tu sesion de hoy" with
 * AI-recommended study activities.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftFortHome from '../../components/home/SoftFortHome';
import { ROUTES } from '../../router/routes';
import { useActivityData } from '../../hooks/useActivityData';
import { useTopics } from '../../hooks/useTopics';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useCompositeReadiness } from '../../hooks/useCompositeReadiness';
import { useAuth } from '../../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { totalStats, streak, weeklyImprovement, weeklyData, todayStats, fsrsStats, simulacroAvg, fetchActivityData } = useActivityData();
  const { getFortalezaData, topicsWithQuestions, userProgress } = useTopics();

  // Fetch activity data on mount
  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const fortalezaData = getFortalezaData();

  // Composite readiness index (cobertura 30% + precisión 40% + simulacros 30%)
  const readiness = useCompositeReadiness({ fortalezaData, totalStats, simulacroAvg });

  // Compute today's study plan from the engine
  const { activities, examCountdown, dailyInsight } = useStudyPlan({
    dueReviewCount: fsrsStats?.mastered > 0 ? Math.max(0, fsrsStats.learning) : 0,
    topicProgress: fortalezaData,
    userProgress,
    availableTopics: topicsWithQuestions,
    todayStats,
    totalStats,
    streak,
  });

  const handleStartSession = (topic) => {
    if (topic?.number) {
      navigate(ROUTES.STUDY, { state: { topic, mode: 'practica-tema' } });
    } else {
      navigate(ROUTES.STUDY);
    }
  };

  // Handle starting a study plan activity (1-click, skip preview)
  const handleStartActivity = (activity) => {
    if (!activity.config) return;
    navigate(ROUTES.STUDY, { state: { ...activity.config, autoStart: true } });
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
      weeklyData={weeklyData}
      todayStats={todayStats}
      streakData={streak}
      fortalezaData={fortalezaData}
      studyPlan={{ activities, examCountdown, dailyInsight }}
      onStartSession={handleStartSession}
      onStartActivity={handleStartActivity}
      onTopicSelect={handleTopicSelect}
      onViewAllTopics={handleViewAllTopics}
      onNavigate={handleNavigate}
      readiness={readiness}
    />
  );
}
