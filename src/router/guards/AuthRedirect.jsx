/**
 * AuthRedirect Guard
 *
 * Smart root redirect that checks auth state:
 * - Authenticated users → /app/inicio (skip welcome/login)
 * - Everyone else → /welcome (onboarding or login)
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../paths';

export default function AuthRedirect() {
  const { user, loading, isAnonymous } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  // Authenticated users (with account) go directly to app
  if (user && !isAnonymous) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Not authenticated → guest welcome (try before signup)
  return <Navigate to={ROUTES.WELCOME} replace />;
}
