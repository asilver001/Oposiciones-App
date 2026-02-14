/**
 * MainLayout - Wraps authenticated app pages with TopBar + BottomTabBar
 *
 * Uses React Router's Outlet to render child routes.
 * Matches the visual layout from OpositaApp.jsx (fixed TopBar, floating BottomTabBar).
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import BottomTabBar from './BottomTabBar';
import SettingsModal from './SettingsModal';
import ProgressModal from './ProgressModal';
import DevPanel from '../../components/dev/DevPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useUserStore } from '../../stores/useUserStore';
import { useActivityData } from '../../hooks/useActivityData';
import { useDarkMode } from '../../hooks/useDarkMode';
import { ROUTES } from '../../router/paths';

// Map route paths to tab IDs
const ROUTE_TO_TAB = {
  [ROUTES.HOME]: 'inicio',
  [ROUTES.TEMAS]: 'temas',
  [ROUTES.ACTIVIDAD]: 'actividad',
  [ROUTES.RECURSOS]: 'recursos',
};

// Tab titles matching the old OpositaApp layout
const TAB_TITLES = {
  'inicio': 'Oposita Smart',
  'temas': 'Temas',
  'actividad': 'Actividad',
  'recursos': 'Recursos',
};

// Map tab IDs to route paths
const TAB_TO_ROUTE = {
  'inicio': ROUTES.HOME,
  'temas': ROUTES.TEMAS,
  'actividad': ROUTES.ACTIVIDAD,
  'recursos': ROUTES.RECURSOS,
  'reviewer-panel': ROUTES.REVIEWER,
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isReviewer: authIsReviewer, user } = useAuth();
  const { isReviewer } = useAdmin();
  const { userData, streakData } = useUserStore();
  const {
    totalStats: activityStats,
    todayStats,
    streak: activityStreak,
    weeklyImprovement,
    fetchActivityData,
  } = useActivityData();

  useDarkMode();

  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [premiumMode, setPremiumMode] = useState(false);

  const isUserReviewer = isReviewer || authIsReviewer;

  // Fetch activity data on mount
  useEffect(() => {
    if (user?.id) {
      fetchActivityData();
    }
  }, [user?.id, fetchActivityData]);

  // Determine active tab from current route
  const activeTab = ROUTE_TO_TAB[location.pathname] || 'inicio';

  // Determine current page for reviewer tab detection
  const currentPage = location.pathname === ROUTES.REVIEWER ? 'reviewer-panel' : '';

  // Hide navigation on study/test pages (full-screen experiences)
  const hideNav = location.pathname.includes('/study') || location.pathname.includes('/first-test');

  // Daily progress data — use TODAY's questions, not lifetime
  const dailyGoal = userData.dailyGoal || 15;
  const todayQuestions = todayStats.questionsAnswered || 0;
  const dailyProgressPercent = Math.min(Math.round((todayQuestions / dailyGoal) * 100), 100);
  const displayStreak = activityStats.testsCompleted > 0 ? (activityStreak.current || 0) : (streakData.current || 0);

  // Days until exam
  const daysUntilExam = userData.examDate
    ? Math.max(0, Math.ceil((new Date(userData.examDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleTabChange = (tabId) => {
    const route = TAB_TO_ROUTE[tabId];
    if (route) {
      navigate(route);
    }
  };

  const handlePageChange = (page) => {
    const route = TAB_TO_ROUTE[page];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      {/* Skip to content link - visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Saltar al contenido
      </a>

      {/* Fixed TopBar - matches OpositaApp.jsx style */}
      {!hideNav && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Left - Daily progress circle */}
              <button
                onClick={() => setShowProgress(true)}
                aria-label={`Progreso diario: ${dailyProgressPercent}% completado`}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-50 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                <svg className="w-9 h-9 transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none" stroke="var(--color-brand-100)" strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none" stroke="var(--color-brand-500)" strokeWidth="3"
                    strokeDasharray={`${(dailyProgressPercent / 100) * 88} 88`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-brand-600" aria-hidden="true">
                  {dailyProgressPercent}
                </span>
              </button>

              {/* Center - Contextual title */}
              <h1 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                {TAB_TITLES[activeTab] || 'Oposita Smart'}
              </h1>

              {/* Right - Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                aria-label="Abrir ajustes"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
              >
                <Settings className="w-[18px] h-[18px] text-gray-500" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Page content - pt-16 to account for fixed TopBar */}
      <main id="main-content" className={hideNav ? '' : 'max-w-4xl mx-auto px-4 pt-16'}>
        <div className={hideNav ? '' : 'pt-4 mb-6'}>
          <Outlet />
        </div>
      </main>

      {/* Aria-live region for session progress announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="progress-announcer" />

      {/* DevPanel - visible for admins and dev mode */}
      {!hideNav && (
        <DevPanel
          onReset={() => {}}
          onShowPremium={() => {}}
          onShowAdminLogin={() => navigate(ROUTES.ADMIN)}
          onShowPlayground={() => {}}
          onShowDraftFeatures={() => {}}
          onGoToOnboarding={() => navigate(ROUTES.WELCOME)}
          premiumMode={premiumMode}
          onTogglePremium={() => setPremiumMode(!premiumMode)}
          streakCount={displayStreak}
          testsCount={activityStats.testsCompleted || 0}
        />
      )}

      {/* Floating BottomTabBar */}
      {!hideNav && (
        <BottomTabBar
          activeTab={activeTab}
          currentPage={currentPage}
          isUserReviewer={isUserReviewer}
          onTabChange={handleTabChange}
          onPageChange={handlePageChange}
        />
      )}

      {/* Settings panel - slides from right */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Progress panel - slides from left */}
      <AnimatePresence>
        {showProgress && (
          <ProgressModal
            onClose={() => setShowProgress(false)}
            todayQuestions={todayQuestions}
            dailyGoal={dailyGoal}
            testsCompleted={activityStats.testsCompleted || 0}
            accuracyRate={activityStats.accuracyRate || 0}
            daysUntilExam={daysUntilExam}
            totalProgress={0}
            onContinueStudying={() => navigate(ROUTES.STUDY)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
