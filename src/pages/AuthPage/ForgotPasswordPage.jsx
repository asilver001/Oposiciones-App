import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async (email) => {
    setLoading(true);
    setError(null);

    const result = await resetPassword(email);

    setLoading(false);

    // ForgotPasswordForm handles success state internally
    return result;
  };

  const handleGoToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <ForgotPasswordForm
      onResetPassword={handleResetPassword}
      onGoToLogin={handleGoToLogin}
      loading={loading}
      error={error}
    />
  );
}
