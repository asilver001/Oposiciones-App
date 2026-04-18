/**
 * RequireAdmin Guard
 *
 * Protects admin/reviewer routes.
 * Redirects to home if user is not an admin or reviewer.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../routes';

export default function RequireAdmin({ children }) {
  const { user, userRole, loading, roleLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-green-700">Verificando permisos...</div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Role fetch in-flight — wait (bounded by 5s timeout in AuthContext)
  if (roleLoading || userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-green-700">Verificando permisos...</div>
      </div>
    );
  }

  // If role check errored out, treat as non-admin and send home
  if (userRole?.error) {
    console.warn('Role check failed:', userRole.error);
    return <Navigate to={ROUTES.HOME} state={{ from: location, roleError: true }} replace />;
  }

  // Role check completed but user is not admin or reviewer
  if (!userRole?.isAdmin && !userRole?.isReviewer) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
}
