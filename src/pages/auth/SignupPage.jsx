/**
 * SignupPage
 *
 * User registration page.
 */

import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import { ROUTES } from '../../router/routes';

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleBack = () => {
    navigate(ROUTES.WELCOME);
  };

  return (
    <SignUpForm
      onSuccess={handleSuccess}
      onLogin={handleLogin}
      onBack={handleBack}
    />
  );
}
