/**
 * RequireAuth Guard
 *
 * Protects routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../routes';

export default function RequireAuth({ children }) {
  const { user, loading, isAnonymous } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  // Allow authenticated users and anonymous users through
  // Unauthenticated users can browse all /app pages but with limited data
  if (!user && !isAnonymous) {
    const isAppPage = location.pathname.startsWith('/app');
    if (!isAppPage) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return children;
}
