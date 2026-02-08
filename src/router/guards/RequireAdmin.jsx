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
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-brand-600">Verificando permisos...</div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // User is authenticated but role check hasn't completed yet - wait
  if (userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-brand-600">Verificando permisos...</div>
      </div>
    );
  }

  // Role check completed but user is not admin or reviewer
  if (!userRole?.isAdmin && !userRole?.isReviewer) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
}
