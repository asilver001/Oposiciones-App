import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpForm } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (email, password, metadata) => {
    setLoading(true);
    setError(null);

    const result = await signUp(email, password, metadata);

    setLoading(false);

    // SignUpForm handles success state internally
    return result;
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleShowPrivacy = (type) => {
    // Navigate to legal page with specific section
    navigate(`/legal?section=${type}`);
  };

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onGoToLogin={handleNavigateToLogin}
      onShowPrivacy={handleShowPrivacy}
      loading={loading}
      error={error}
    />
  );
}
