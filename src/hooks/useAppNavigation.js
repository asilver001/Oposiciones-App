import { useState, useCallback } from 'react';

// ============================================================================
// Page Type Constants
// ============================================================================

/** Pages shown during initial onboarding flow */
const ONBOARDING_PAGES = [
  'welcome',
  'onboarding1',
  'onboarding2',
  'onboarding3',
  'onboarding4',
  'onboarding-results'
];

/** Authentication-related pages */
const AUTH_PAGES = ['login', 'signup', 'forgot-password'];

/** Legal and informational pages */
const LEGAL_PAGES = ['terms', 'privacy', 'legal', 'about', 'contact', 'faq'];

/** Admin and reviewer pages */
const ADMIN_PAGES = ['admin-panel', 'reviewer-panel'];

/** Test-related pages */
const TEST_PAGES = ['first-test'];

/** Main application tabs */
const MAIN_TABS = ['inicio', 'temas', 'actividad', 'recursos'];

/** All known pages for validation */
const ALL_PAGES = [
  ...ONBOARDING_PAGES,
  ...AUTH_PAGES,
  ...LEGAL_PAGES,
  ...ADMIN_PAGES,
  ...TEST_PAGES,
  'home'
];

// ============================================================================
// useAppNavigation Hook
// ============================================================================

/**
 * Custom hook for managing application navigation state.
 *
 * Consolidates all navigation logic including page transitions,
 * tab switching, and navigation history management.
 *
 * @param {string} initialPage - The initial page to display (default: 'welcome')
 * @returns {Object} Navigation state and methods
 *
 * @example
 * const { currentPage, navigateTo, goBack, switchTab } = useAppNavigation();
 *
 * // Navigate to a page
 * navigateTo('signup');
 *
 * // Go back to previous page
 * goBack();
 *
 * // Switch tabs (only works on home page)
 * switchTab('temas');
 */
export function useAppNavigation(initialPage = 'welcome') {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeTab, setActiveTab] = useState('inicio');
  const [pageHistory, setPageHistory] = useState([]);

  // -------------------------------------------------------------------------
  // Navigation Actions
  // -------------------------------------------------------------------------

  /**
   * Navigate to a specific page, adding current page to history.
   *
   * @param {string} page - The page identifier to navigate to
   * @returns {void}
   *
   * @example
   * navigateTo('signup');
   * navigateTo('home');
   */
  const navigateTo = useCallback((page) => {
    setPageHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  }, [currentPage]);

  /**
   * Navigate back to the previous page in history.
   * Does nothing if history is empty.
   *
   * @returns {boolean} True if navigation occurred, false if history was empty
   *
   * @example
   * const didGoBack = goBack();
   * if (!didGoBack) {
   *   // Handle case where there's no history
   * }
   */
  const goBack = useCallback(() => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setCurrentPage(prevPage);
      return true;
    }
    return false;
  }, [pageHistory]);

  /**
   * Navigate directly to home page, clearing history and resetting tab.
   * Use this for "go to main menu" style navigation.
   *
   * @returns {void}
   *
   * @example
   * goHome(); // Clears history and goes to home/inicio
   */
  const goHome = useCallback(() => {
    setCurrentPage('home');
    setActiveTab('inicio');
    setPageHistory([]);
  }, []);

  /**
   * Switch the active tab on the home screen.
   * Only accepts valid tab identifiers.
   *
   * @param {string} tab - The tab identifier ('inicio' | 'temas' | 'actividad' | 'recursos')
   * @returns {boolean} True if tab switch was successful, false if invalid tab
   *
   * @example
   * switchTab('temas'); // Switch to themes tab
   * switchTab('actividad'); // Switch to activity tab
   */
  const switchTab = useCallback((tab) => {
    if (MAIN_TABS.includes(tab)) {
      setActiveTab(tab);
      return true;
    }
    return false;
  }, []);

  /**
   * Navigate to home and switch to a specific tab in one action.
   *
   * @param {string} tab - The tab to switch to after going home
   * @returns {void}
   *
   * @example
   * goToTab('temas'); // Goes home and switches to temas tab
   */
  const goToTab = useCallback((tab) => {
    setCurrentPage('home');
    if (MAIN_TABS.includes(tab)) {
      setActiveTab(tab);
    }
    setPageHistory([]);
  }, []);

  /**
   * Clear navigation history without changing current page.
   * Useful after completing a flow (e.g., onboarding).
   *
   * @returns {void}
   */
  const clearHistory = useCallback(() => {
    setPageHistory([]);
  }, []);

  // -------------------------------------------------------------------------
  // Helper Functions (Page Type Checks)
  // -------------------------------------------------------------------------

  /**
   * Check if current page is part of the onboarding flow.
   * @returns {boolean}
   */
  const isOnboarding = useCallback(() => {
    return ONBOARDING_PAGES.includes(currentPage);
  }, [currentPage]);

  /**
   * Check if current page is an authentication page.
   * @returns {boolean}
   */
  const isAuth = useCallback(() => {
    return AUTH_PAGES.includes(currentPage);
  }, [currentPage]);

  /**
   * Check if current page is an admin/reviewer page.
   * @returns {boolean}
   */
  const isAdmin = useCallback(() => {
    return ADMIN_PAGES.includes(currentPage);
  }, [currentPage]);

  /**
   * Check if current page is a legal/informational page.
   * @returns {boolean}
   */
  const isLegal = useCallback(() => {
    return LEGAL_PAGES.includes(currentPage);
  }, [currentPage]);

  /**
   * Check if current page is the home page.
   * @returns {boolean}
   */
  const isHome = useCallback(() => {
    return currentPage === 'home';
  }, [currentPage]);

  /**
   * Check if current page is a test page.
   * @returns {boolean}
   */
  const isTest = useCallback(() => {
    return TEST_PAGES.includes(currentPage);
  }, [currentPage]);

  /**
   * Check if navigation history has entries (can go back).
   * @returns {boolean}
   */
  const canGoBack = useCallback(() => {
    return pageHistory.length > 0;
  }, [pageHistory]);

  // -------------------------------------------------------------------------
  // Return Value
  // -------------------------------------------------------------------------

  return {
    // State
    currentPage,
    activeTab,
    pageHistory,

    // Navigation actions
    navigateTo,
    goBack,
    goHome,
    goToTab,
    switchTab,
    clearHistory,

    // Direct setters (for backward compatibility with existing code)
    setCurrentPage,
    setActiveTab,

    // Helper functions
    isOnboarding,
    isAuth,
    isAdmin,
    isLegal,
    isHome,
    isTest,
    canGoBack,

    // Constants (exported for external use)
    MAIN_TABS,
    ONBOARDING_PAGES,
    AUTH_PAGES,
    LEGAL_PAGES,
    ADMIN_PAGES,
    TEST_PAGES,
    ALL_PAGES,
  };
}

export default useAppNavigation;

// Also export constants for use without the hook
export {
  ONBOARDING_PAGES,
  AUTH_PAGES,
  LEGAL_PAGES,
  ADMIN_PAGES,
  TEST_PAGES,
  MAIN_TABS,
  ALL_PAGES,
};
