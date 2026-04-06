/**
 * RecursosPage
 *
 * Resources and study materials view.
 */

import { useNavigate } from 'react-router-dom';
import RecursosPage from '../../components/recursos/RecursosPage';
import { useAuth } from '../../contexts/AuthContext';
import GuestLock from '../../components/common/GuestLock';
import { ROUTES } from '../../router/routes';

export default function RecursosPageWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (page) => {
    const routeMap = {
      home: ROUTES.HOME,
      temas: ROUTES.TEMAS,
      actividad: ROUTES.ACTIVIDAD,
      study: ROUTES.STUDY,
    };
    navigate(routeMap[page] || ROUTES.HOME);
  };

  const content = (
    <RecursosPage
      onNavigate={handleNavigate}
    />
  );

  if (!user) {
    return <GuestLock message="Crea una cuenta para acceder a todos los recursos de estudio">{content}</GuestLock>;
  }

  return content;
}
