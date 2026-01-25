import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);

    setLoading(false);

    if (result && !result.error) {
      navigate('/');
    }

    return result;
  };

  const handleNavigateToSignup = () => {
    navigate('/auth/signup');
  };

  const handleNavigateToForgot = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onGoToSignUp={handleNavigateToSignup}
      onForgotPassword={handleNavigateToForgot}
      loading={loading}
      error={error}
    />
  );
}
