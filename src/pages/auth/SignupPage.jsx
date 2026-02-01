/**
 * SignupPage
 *
 * User registration page.
 */

import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (email, password, metadata) => {
    const result = await signUp(email, password, metadata);
    if (!result.error) {
      navigate(ROUTES.HOME, { replace: true });
    }
    return result;
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleBack = () => {
    navigate(ROUTES.WELCOME);
  };

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onGoToLogin={handleGoToLogin}
      onBack={handleBack}
    />
  );
}
