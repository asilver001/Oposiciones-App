/**
 * AdminPage
 *
 * Admin panel for managing questions and content.
 */

import { useNavigate } from 'react-router-dom';
import AdminPanel from '../../components/admin/AdminPanel';
import { ROUTES } from '../../router/routes';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <AdminPanel
      onBack={handleBack}
    />
  );
}
