import { useNavigate } from 'react-router-dom';
import { getGuestData, initGuestData } from '../guestStorage';

export default function GuestWelcome() {
  const navigate = useNavigate();
  const guestData = getGuestData();

  const handleStart = () => {
    if (!guestData) {
      initGuestData('2026-06-13');
    }
    navigate('/guest/session');
  };

  // Returning user
  if (guestData && guestData.totalSessions > 0 && guestData.totalSessions < guestData.maxSessions) {
    const avgScore = Math.round(
      guestData.sessions.reduce((s, ses) => s + (ses.score / ses.total) * 100, 0) / guestData.sessions.length
    );
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{ background: '#FAFAF7' }}>
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">OS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <div className="space-y-1">
            <p className="text-gray-500">Llevas {guestData.totalSessions} sesion{guestData.totalSessions === 1 ? '' : 'es'} completada{guestData.totalSessions === 1 ? '' : 's'}.</p>
            <p className="text-gray-500">Tu media: <span className="font-semibold text-[#2D6A4F]">{avgScore}%</span></p>
          </div>
          <button onClick={handleStart} className="w-full py-4 rounded-xl bg-[#2D6A4F] text-white font-semibold text-lg active:scale-[0.98] transition-all">
            Continuar sesion {guestData.totalSessions + 1} →
          </button>
          <p className="text-sm text-gray-400">
            Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} className="text-[#2D6A4F] hover:underline">Inicia sesion</button>
          </p>
        </div>
      </div>
    );
  }

  // Maxed out
  if (guestData && guestData.totalSessions >= guestData.maxSessions) {
    navigate('/guest/signup');
    return null;
  }

  // New user
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{ background: '#FAFAF7' }}>
      <div className="max-w-sm w-full text-center space-y-8">
        <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">OS</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Descubre tu nivel en 2 minutos</h1>
          <p className="text-gray-500 text-base">5 preguntas reales de Auxiliar Administrativo del Estado. Sin registro. Sin email.</p>
        </div>
        <button onClick={handleStart} className="w-full py-4 rounded-xl bg-[#2D6A4F] text-white font-semibold text-lg active:scale-[0.98] transition-all">
          Empezar ahora →
        </button>
        <p className="text-sm text-gray-400">
          Ya tienes cuenta?{' '}
          <button onClick={() => navigate('/login')} className="text-[#2D6A4F] hover:underline">Inicia sesion</button>
        </p>
      </div>
    </div>
  );
}
