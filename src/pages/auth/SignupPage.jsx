/**
 * SignupPage
 *
 * User registration page.
 */

import { useNavigate } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import HomePage from '../app/HomePage';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithMagicLink } = useAuth();

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
    <>
      <div className="pointer-events-none" aria-hidden="true">
        <HomePage />
      </div>
      <SignUpForm
        onSignUp={handleSignUp}
        onGoogleLogin={signInWithGoogle}
        onMagicLink={signInWithMagicLink}
        onGoToLogin={handleGoToLogin}
        onBack={handleBack}
      />
    </>
  );
}
