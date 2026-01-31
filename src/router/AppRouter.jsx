/**
 * AppRouter
 *
 * Main application router component.
 * Uses HashRouter for GitHub Pages compatibility.
 * Wraps routes with Suspense for lazy loading.
 */

import { Suspense } from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import { routeConfig } from './routes';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-purple-600 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

// Routes component that uses the route config
function Routes() {
  const element = useRoutes(routeConfig);
  return element;
}

/**
 * Main Router Component
 *
 * Provides routing context for the entire application.
 * Includes error boundary and suspense for robustness.
 */
export default function AppRouter() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes />
        </Suspense>
      </ErrorBoundary>
    </HashRouter>
  );
}

// Export for use in main.jsx
export { AppRouter };
