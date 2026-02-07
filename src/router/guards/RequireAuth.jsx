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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="animate-pulse text-purple-600">Cargando...</div>
      </div>
    );
  }

  // Allow authenticated users and anonymous users through
  if (!user && !isAnonymous) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
