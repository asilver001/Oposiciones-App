/**
 * LoginPage
 *
 * User login page.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { ROUTES } from '../../router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSignup = () => {
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
      onSuccess={handleSuccess}
      onSignup={handleSignup}
      onForgotPassword={handleForgotPassword}
      onBack={handleBack}
    />
  );
}
