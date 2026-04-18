/**
 * HomePage
 *
 * Main dashboard page showing stats, streak, and session CTA.
 * Integrates StudyPlanEngine to show "Tu sesion de hoy" with
 * AI-recommended study activities.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftFortHome from '../../components/home/SoftFortHome';
import EditorialHome from '../../components/home/EditorialHome';
import GuestModal from '../../features/guest/components/GuestModal';

// Feature flag: set localStorage 'home-design' to 'legacy' to use old SoftFortHome
const useEditorialDesign = () => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('home-design') !== 'legacy';
};
import { getGuestData, isGuestModalDismissed, reopenGuestModal } from '../../features/guest/guestStorage';
import GuestProgressStrip from '../../features/guest/components/GuestProgressStrip';
import { ROUTES } from '../../router/routes';
import { useActivityData } from '../../hooks/useActivityData';
import { useTopics } from '../../hooks/useTopics';
import { useStudyPlan } from '../../hooks/useStudyPlan';
import { useCompositeReadiness } from '../../hooks/useCompositeReadiness';
import { useAuth } from '../../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Guest modal state
  const guestData = getGuestData();
  const shouldShowModal = !user && (!guestData || guestData.totalSessions === 0) && !isGuestModalDismissed();
  const canShowFloating = !user && guestData && guestData.totalSessions < (guestData.maxSessions || 5);
  const [showGuestModal, setShowGuestModal] = useState(shouldShowModal);
  const [modalDismissed, setModalDismissed] = useState(isGuestModalDismissed());
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
    // Guest users go to guest session flow
    if (!user) {
      navigate(ROUTES.GUEST_SESSION);
      return;
    }
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

  const userName = user ? (user.user_metadata?.name || (() => {
    const raw = user.email?.split('@')[0] || 'Usuario';
    return raw.charAt(0).toUpperCase() + raw.slice(1).replace(/[0-9]+$/, '');
  })()) : 'bienvenido/a';

  // Guest mini-progress: only rendered by the editorial home slot,
  // only shown when there's at least one completed session.
  const guestSlot = !user ? (
    <GuestProgressStrip
      onSignup={() => navigate(ROUTES.SIGNUP)}
      onStartSession={() => navigate(ROUTES.GUEST_SESSION)}
    />
  ) : null;

  const homeProps = {
    showTopBar: false,
    userName,
    totalStats,
    weeklyImprovement,
    weeklyData,
    todayStats,
    streakData: streak,
    fortalezaData,
    studyPlan: { activities, examCountdown, dailyInsight },
    onStartSession: handleStartSession,
    onStartActivity: handleStartActivity,
    onTopicSelect: handleTopicSelect,
    onViewAllTopics: handleViewAllTopics,
    onNavigate: handleNavigate,
    readiness,
    guestSlot,
  };

  const useEditorial = useEditorialDesign();

  return (
    <>
      {showGuestModal && (
        <GuestModal
          onClose={() => { setShowGuestModal(false); setModalDismissed(true); }}
          onSignup={() => navigate(ROUTES.SIGNUP)}
        />
      )}
      {useEditorial ? <EditorialHome {...homeProps} /> : <SoftFortHome {...homeProps} />}
    </>
  );
}
