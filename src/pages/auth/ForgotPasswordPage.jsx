/**
 * ForgotPasswordPage
 *
 * Password recovery page.
 */

import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../router/routes';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleResetPassword = async (email) => {
    const result = await resetPassword(email);
    return result;
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleBack = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <ForgotPasswordForm
      onResetPassword={handleResetPassword}
      onGoToLogin={handleGoToLogin}
      onBack={handleBack}
    />
  );
}
