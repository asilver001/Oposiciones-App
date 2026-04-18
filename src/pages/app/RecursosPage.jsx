/**
 * RecursosPage
 *
 * Resources and study materials view.
 */

import { useNavigate } from 'react-router-dom';
import RecursosPage from '../../components/recursos/RecursosPage';
import EditorialRecursos from '../../components/recursos/EditorialRecursos';
import { useAuth } from '../../contexts/AuthContext';
import GuestLock from '../../components/common/GuestLock';
import { ROUTES } from '../../router/routes';

const useEditorial = () =>
  typeof window !== 'undefined' && localStorage.getItem('home-design') !== 'legacy';

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

  const editorial = useEditorial();

  // Editorial design: always show the biblioteca directly (guests included).
  // The items link to BOE and are public; favorites live in localStorage.
  if (editorial) {
    return <EditorialRecursos onNavigate={handleNavigate} />;
  }

  // Legacy design: keep guest fallback with GuestLock overlay
  const content = <RecursosPage onNavigate={handleNavigate} />;

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Disponible</h3>
          <div className="space-y-3">
            <a href="https://www.opositasmart.com/radar" target="_blank" rel="noopener noreferrer"
              className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2D6A4F]/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Radar de Convocatorias</p>
                  <p className="text-xs text-gray-400">Plazas, fechas y enlaces al BOE</p>
                </div>
              </div>
            </a>
            <button onClick={() => navigate(ROUTES.STUDY, { state: { mode: 'practica-tema', topic: { number: 1 }, autoStart: true } })}
              className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2D6A4F]/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Test Tema 1 — CE: Título Preliminar</p>
                  <p className="text-xs text-gray-400">20 preguntas · Acceso libre</p>
                </div>
              </div>
            </button>
            <button onClick={() => navigate(ROUTES.STUDY, { state: { mode: 'practica-tema', topic: { number: 2 }, autoStart: true } })}
              className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-[#2D6A4F]/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Test Tema 2 — CE: Derechos y Libertades</p>
                  <p className="text-xs text-gray-400">20 preguntas · Acceso libre</p>
                </div>
              </div>
            </button>
          </div>
        </div>
        <GuestLock message="Crea una cuenta para acceder a todos los recursos">{content}</GuestLock>
      </div>
    );
  }

  return content;
}
