/**
 * MainLayout - Dual layout shell for authenticated app pages.
 *
 * Desktop (>=1024px): Persistent sidebar + scrollable main content
 * Mobile  (<1024px):  Fixed TopBar + scrollable content + BottomTabBar
 *
 * Uses React Router's Outlet to render child routes.
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import BottomTabBar from './BottomTabBar';
import DesktopSidebar from './DesktopSidebar';
import SettingsModal from './SettingsModal';
import ProgressModal from './ProgressModal';
import DevPanel from '../../components/dev/DevPanel';
import DraftFeatures from '../../components/dev/DraftFeatures';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useUserStore } from '../../stores/useUserStore';
import { useActivityData } from '../../hooks/useActivityData';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ROUTES } from '../../router/paths';
import { ROUTE_TO_TAB, TAB_TO_ROUTE, TAB_TITLES } from '../../config/navigation';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile(1024);
  const { isReviewer: authIsReviewer, user } = useAuth();
  const { isReviewer } = useAdmin();
  const { userData, streakData } = useUserStore();
  const {
    totalStats: activityStats,
    todayStats,
    streak: activityStreak,
    fetchActivityData,
  } = useActivityData();

  useDarkMode();

  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showDraftFeatures, setShowDraftFeatures] = useState(false);
  const [premiumMode, setPremiumMode] = useState(false);

  const isUserReviewer = isReviewer || authIsReviewer;

  // Fetch activity data on mount
  useEffect(() => {
    if (user?.id) {
      fetchActivityData();
    }
  }, [user?.id, fetchActivityData]);

  // Active tab from current route
  const activeTab = ROUTE_TO_TAB[location.pathname] || 'inicio';
  const currentPage = location.pathname === ROUTES.REVIEWER ? 'reviewer-panel' : '';

  const [searchParams] = useSearchParams();
  // Full-screen experiences hide all nav chrome
  // Show nav again when session is complete (signalled by ?complete=1 search param)
  const sessionComplete = searchParams.get('complete') === '1';
  const hideNav = !sessionComplete && (location.pathname.includes('/study') || location.pathname.includes('/first-test'));

  // Daily progress
  const dailyGoal = userData.dailyGoal || 15;
  const todayQuestions = todayStats.questionsAnswered || 0;
  const dailyProgressPercent = Math.min(Math.round((todayQuestions / dailyGoal) * 100), 100);
  const displayStreak = activityStats.testsCompleted > 0 ? (activityStreak.current || 0) : (streakData.current || 0);

  const daysUntilExam = userData.examDate
    ? Math.max(0, Math.ceil((new Date(userData.examDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleTabChange = (tabId) => {
    const route = TAB_TO_ROUTE[tabId];
    if (route) navigate(route);
  };

  const handlePageChange = (page) => {
    const route = TAB_TO_ROUTE[page];
    if (route) navigate(route);
  };

  // Full-screen mode (study sessions): no layout chrome at all
  if (hideNav) {
    return (
      <div className="min-h-screen dark:bg-gray-950" style={{ background: '#FAFAF7' }}>
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-dvh dark:bg-gray-950" style={{ background: '#FAFAF7' }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Saltar al contenido
      </a>

      {/* Desktop: Persistent sidebar */}
      {!isMobile && (
        <DesktopSidebar
          isUserReviewer={isUserReviewer}
          dailyProgressPercent={dailyProgressPercent}
          onOpenSettings={() => setShowSettings(true)}
          onOpenProgress={() => setShowProgress(true)}
          user={user}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile: Fixed TopBar */}
        {isMobile && (
          <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shrink-0">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center justify-between h-14">
                <button
                  onClick={() => setShowProgress(true)}
                  aria-label={`Progreso diario: ${dailyProgressPercent}% completado`}
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                >
                  <span className="text-[13px] font-semibold text-gray-500" aria-hidden="true">
                    {dailyProgressPercent}%
                  </span>
                </button>
                <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                  {TAB_TITLES[activeTab] || 'Oposita Smart'}
                </h1>
                <button
                  onClick={() => setShowSettings(true)}
                  aria-label="Abrir ajustes"
                  className="w-12 h-12 flex items-center justify-center rounded-full"
                >
                  <Settings className="w-[18px] h-[18px] text-gray-500" />
                </button>
              </div>
            </div>
            <div className="h-0.5 bg-gray-100">
              <div
                className="h-full bg-gray-900 transition-all duration-500"
                style={{ width: `${dailyProgressPercent}%` }}
                aria-hidden="true"
              />
            </div>
          </header>
        )}

        {/* Scrollable page content */}
        <main
          id="main-content"
          className={`flex-1 overflow-y-auto ${isMobile ? 'pb-20' : ''}`}
        >
          <div className="px-4 lg:px-10 py-4 lg:py-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile: BottomTabBar */}
        {isMobile && (
          <BottomTabBar
            activeTab={activeTab}
            currentPage={currentPage}
            isUserReviewer={isUserReviewer}
            onTabChange={handleTabChange}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Aria-live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="progress-announcer" />

      {/* DevPanel */}
      <DevPanel
        onReset={() => {}}
        onShowPremium={() => {}}
        onShowAdminLogin={() => navigate(ROUTES.ADMIN)}
        onShowPlayground={() => {}}
        onShowDraftFeatures={() => setShowDraftFeatures(true)}
        onGoToOnboarding={() => navigate(ROUTES.LOGIN, { state: { devOverride: true } })}
        premiumMode={premiumMode}
        onTogglePremium={() => setPremiumMode(!premiumMode)}
        streakCount={displayStreak}
        testsCount={activityStats.testsCompleted || 0}
      />

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Progress panel */}
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

      {/* DraftFeatures overlay */}
      {showDraftFeatures && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 overflow-y-auto">
          <DraftFeatures
            onClose={() => setShowDraftFeatures(false)}
            onStartTopicStudy={(topic) => {
              setShowDraftFeatures(false);
              navigate(ROUTES.STUDY, {
                state: { mode: 'practica-tema', topic, temaId: topic.id }
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
