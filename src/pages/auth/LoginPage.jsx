/**
 * LoginPage
 *
 * User login page.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

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
      onGoToSignUp={handleGoToSignUp}
      onForgotPassword={handleForgotPassword}
      onBack={handleBack}
    />
  );
}
