/**
 * RecursosPage
 *
 * Resources and study materials view.
 */

import { useNavigate } from 'react-router-dom';
import RecursosPage from '../../components/recursos/RecursosPage';
import { ROUTES } from '../../router/routes';

export default function RecursosPageWrapper() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <RecursosPage
      onBack={handleBack}
    />
  );
}
