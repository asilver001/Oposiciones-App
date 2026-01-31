/**
 * ForgotPasswordPage
 *
 * Password recovery page.
 */

import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { ROUTES } from '../../router/routes';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <ForgotPasswordForm
      onBack={handleBack}
    />
  );
}
