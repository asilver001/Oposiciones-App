import { useNavigate } from 'react-router-dom';
import { getGuestData } from '../guestStorage';
import { TrendingUp, Target, RotateCcw, ArrowRight, Trophy } from 'lucide-react';

export default function GuestResults() {
  const navigate = useNavigate();
  const guestData = getGuestData();

  if (!guestData || guestData.sessions.length === 0) {
    navigate('/guest');
    return null;
  }

  const lastSession = guestData.sessions[guestData.sessions.length - 1];
  const { score, total, answers } = lastSession;
  const pct = Math.round((score / total) * 100);
  const reviewCount = answers.filter(a => a.isReview).length;
  const reviewCorrect = answers.filter(a => a.isReview && a.correct).length;
  const avgTimeMs = Math.round(answers.reduce((s, a) => s + a.timeMs, 0) / answers.length);
  const avgTimeSec = (avgTimeMs / 1000).toFixed(1);

  // Calculate improvement delta from previous session
  let delta = null;
  if (guestData.sessions.length > 1) {
    const prevSession = guestData.sessions[guestData.sessions.length - 2];
    const prevPct = Math.round((prevSession.score / prevSession.total) * 100);
    delta = pct - prevPct;
  }

  const canContinue = guestData.totalSessions < guestData.maxSessions;
  const sessionsLeft = guestData.maxSessions - guestData.totalSessions;

  const handleNext = () => {
    if (canContinue) {
      navigate('/guest/session');
    } else {
      navigate('/guest/signup');
    }
  };

  // Score color
  const scoreColor = pct >= 70 ? '#2D6A4F' : pct >= 50 ? '#D4933A' : '#B91C1C';

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#FAFAF7' }}>
      <div className="flex-1 px-5 py-8 max-w-sm mx-auto w-full space-y-6">
        {/* Score circle */}
        <div className="text-center space-y-3">
          <div className="w-28 h-28 rounded-full mx-auto flex items-center justify-center border-4" style={{ borderColor: scoreColor }}>
            <div>
              <span className="text-4xl font-bold" style={{ color: scoreColor }}>{score}</span>
              <span className="text-lg text-gray-400">/{total}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {pct >= 70 ? 'Muy bien!' : pct >= 50 ? 'Vas por buen camino' : 'Sigue practicando'}
          </p>
          {delta !== null && (
            <div className="flex items-center justify-center gap-1.5">
              <TrendingUp className={`w-4 h-4 ${delta >= 0 ? 'text-[#2D6A4F]' : 'text-[#D4933A]'}`} />
              <span className={`text-sm font-medium ${delta >= 0 ? 'text-[#2D6A4F]' : 'text-[#D4933A]'}`}>
                {delta >= 0 ? '+' : ''}{delta}% vs sesion anterior
              </span>
            </div>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs text-gray-400">Precision</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{pct}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-[#D4933A]" />
              <span className="text-xs text-gray-400">Tiempo medio</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgTimeSec}s</p>
          </div>
        </div>

        {/* Review highlight */}
        {reviewCount > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-sm font-medium text-gray-700">Preguntas de repaso</span>
            </div>
            <p className="text-sm text-gray-500">
              Acertaste {reviewCorrect} de {reviewCount} preguntas que fallaste antes.
              {reviewCorrect === reviewCount && (
                <span className="text-[#2D6A4F] font-medium"> Perfecto!</span>
              )}
            </p>
          </div>
        )}

        {/* Session progression */}
        {guestData.sessions.length > 1 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Tu progreso</p>
            <div className="flex items-end gap-1.5 h-16">
              {guestData.sessions.map((ses, i) => {
                const sesPct = Math.round((ses.score / ses.total) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${Math.max(sesPct * 0.6, 4)}px`,
                        background: i === guestData.sessions.length - 1 ? '#2D6A4F' : '#BFD5C9',
                      }}
                    />
                    <span className="text-[10px] text-gray-400">{i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sessions remaining */}
        {canContinue && (
          <p className="text-center text-sm text-gray-400">
            Te quedan {sessionsLeft} sesion{sessionsLeft === 1 ? '' : 'es'} gratuita{sessionsLeft === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-gray-100" style={{ background: '#FAFAF7' }}>
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {canContinue ? (
            <>Siguiente sesion <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>Crear cuenta para seguir <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
        {canContinue && (
          <button
            onClick={() => navigate('/signup')}
            className="w-full mt-3 py-3 rounded-xl border border-[#2D6A4F] text-[#2D6A4F] font-medium text-sm active:scale-[0.98] transition-all"
          >
            Crear cuenta y guardar mi progreso
          </button>
        )}
        <button
          onClick={() => navigate('/app/inicio')}
          className="w-full mt-2 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
