/**
 * RequireAdmin Guard
 *
 * Protects admin routes.
 * Redirects to home if user is not an admin.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../routes';

export default function RequireAdmin({ children }) {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="animate-pulse text-purple-600">Verificando permisos...</div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || userRole !== 'admin') {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return children;
}
