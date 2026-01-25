import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminPanel } from '../../components/admin';

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // If not admin, redirect to home
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <AdminPanel
      onBack={() => navigate('/')}
    />
  );
}
