/**
 * MainLayout - Wraps authenticated app pages with TopBar + BottomTabBar
 *
 * Uses React Router's Outlet to render child routes.
 * Matches the visual layout from OpositaApp.jsx (fixed TopBar, floating BottomTabBar).
 */

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import BottomTabBar from './BottomTabBar';
import SettingsModal from './SettingsModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
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
  const { isReviewer: authIsReviewer } = useAuth();
  const { isReviewer } = useAdmin();
  const [showSettings, setShowSettings] = useState(false);

  const isUserReviewer = isReviewer || authIsReviewer;

  // Determine active tab from current route
  const activeTab = ROUTE_TO_TAB[location.pathname] || 'inicio';

  // Determine current page for reviewer tab detection
  const currentPage = location.pathname === ROUTES.REVIEWER ? 'reviewer-panel' : '';

  // Hide navigation on study/test pages (full-screen experiences)
  const hideNav = location.pathname.includes('/study') || location.pathname.includes('/first-test');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pb-32">
      {/* Fixed TopBar - matches OpositaApp.jsx style */}
      {!hideNav && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Left - Daily progress circle */}
              <button
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 active:scale-95 transition-all duration-200"
              >
                <svg className="w-9 h-9 transform -rotate-90">
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none" stroke="#F3E8FF" strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none" stroke="#8B5CF6" strokeWidth="3"
                    strokeDasharray="0 88" strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-purple-600">0</span>
              </button>

              {/* Center - Contextual title */}
              <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">
                {TAB_TITLES[activeTab] || 'Oposita Smart'}
              </h1>

              {/* Right - Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200"
              >
                <Settings className="w-[18px] h-[18px] text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content - pt-16 to account for fixed TopBar */}
      <div className={hideNav ? '' : 'max-w-4xl mx-auto px-4 pt-16'}>
        <div className={hideNav ? '' : 'pt-4 mb-6'}>
          <Outlet />
        </div>
      </div>

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

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
