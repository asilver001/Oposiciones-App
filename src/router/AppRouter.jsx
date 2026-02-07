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
import { ToastProvider } from '../components/common/Toast';
import PageSkeleton from '../components/common/Skeleton';

// Routes component that uses the route config
function Routes() {
  const element = useRoutes(routeConfig);
  return element;
}

/**
 * Main Router Component
 *
 * Provides routing context for the entire application.
 * Includes error boundary, toast notifications, and suspense for robustness.
 */
export default function AppRouter() {
  return (
    <HashRouter>
      <ToastProvider>
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Routes />
          </Suspense>
        </ErrorBoundary>
      </ToastProvider>
    </HashRouter>
  );
}

// Export for use in main.jsx
export { AppRouter };
