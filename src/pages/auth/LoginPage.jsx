/**
 * LoginPage
 *
 * User login page.
 */

import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, signInWithMagicLink, user, isAnonymous } = useAuth();
  const devOverride = location.state?.devOverride;

  // Already authenticated — redirect to app (unless dev override)
  if (user && !isAnonymous && !devOverride) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleLogin = async (email, password) => {
    const result = await signIn(email, password);
    if (!result.error) {
      navigate(from, { replace: true });
    }
    return result;
  };

  const handleGoToSignUp = () => {
    navigate(ROUTES.SIGNUP);
  };

  const handleForgotPassword = () => {
    navigate(ROUTES.FORGOT_PASSWORD);
  };

  const handleBack = () => {
    navigate(ROUTES.WELCOME);
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onGoogleLogin={signInWithGoogle}
      onMagicLink={signInWithMagicLink}
      onGoToSignUp={handleGoToSignUp}
      onForgotPassword={handleForgotPassword}
      onBack={handleBack}
    />
  );
}
