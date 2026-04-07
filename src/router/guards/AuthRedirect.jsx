/**
 * AuthRedirect Guard
 *
 * Smart root redirect that checks auth state:
 * - Authenticated users → /app/inicio (skip welcome/login)
 * - Everyone else → /welcome (onboarding or login)
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getGuestData } from '../../features/guest/guestStorage';
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

  // Authenticated users → dashboard
  if (user && !isAnonymous) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Returning guest (has sessions) → dashboard with "Continúa tu prueba"
  const guestData = getGuestData();
  if (guestData && guestData.totalSessions > 0) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // New visitor → dashboard (guest modal opens automatically)
  return <Navigate to={ROUTES.HOME} replace />;
}
