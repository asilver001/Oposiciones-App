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

  const handleNavigate = (page) => {
    const routeMap = {
      home: ROUTES.HOME,
      temas: ROUTES.TEMAS,
      actividad: ROUTES.ACTIVIDAD,
      study: ROUTES.STUDY,
    };
    navigate(routeMap[page] || ROUTES.HOME);
  };

  return (
    <RecursosPage
      onNavigate={handleNavigate}
    />
  );
}
