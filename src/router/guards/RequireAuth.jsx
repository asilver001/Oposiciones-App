/**
 * RequireAuth Guard
 *
 * Protects routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../routes';
import PageLoader from '../../components/common/PageLoader';

export default function RequireAuth({ children }) {
  const { user, loading, isAnonymous } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
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
