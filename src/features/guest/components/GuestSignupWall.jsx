import { useNavigate } from 'react-router-dom';
import { getGuestData, clearGuestData } from '../guestStorage';
import { Lock, TrendingUp, Brain, BarChart3, ArrowRight, BookOpen } from 'lucide-react';

export default function GuestSignupWall() {
  const navigate = useNavigate();
  const guestData = getGuestData();

  const totalAnswered = guestData ? Object.keys(guestData.allAnswered).length : 0;
  const totalCorrect = guestData
    ? Object.values(guestData.allAnswered).filter(a => a.correct).length
    : 0;
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const sessionsCompleted = guestData?.totalSessions ?? 0;

  const features = [
    { icon: Brain, title: 'Repeticion espaciada', desc: 'El sistema recuerda lo que fallas y te lo repasa en el momento justo' },
    { icon: BarChart3, title: 'Estadisticas detalladas', desc: 'Conoce tus puntos fuertes y debiles por tema' },
    { icon: BookOpen, title: 'Mas de 1.000 preguntas', desc: 'Banco completo de Auxiliar Administrativo AGE' },
    { icon: TrendingUp, title: 'Progreso a tu ritmo', desc: 'Sin presion. Unos minutos al dia, sin agobios' },
  ];

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#FAFAF7' }}>
      <div className="flex-1 px-5 py-8 max-w-sm mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Has completado las 10 sesiones gratuitas</h1>
          <p className="text-gray-500">Crea tu cuenta para seguir preparando tu oposicion.</p>
        </div>

        {/* Stats summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
          <p className="text-sm font-medium text-gray-700">Tu progreso hasta ahora</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-[#2D6A4F]">{sessionsCompleted}</p>
              <p className="text-xs text-gray-400">Sesiones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D6A4F]">{totalAnswered}</p>
              <p className="text-xs text-gray-400">Preguntas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D6A4F]">{overallPct}%</p>
              <p className="text-xs text-gray-400">Precision</p>
            </div>
          </div>

          {/* Mini chart */}
          {guestData && guestData.sessions.length > 1 && (
            <div className="pt-3 border-t border-gray-50">
              <div className="flex items-end gap-1 h-12">
                {guestData.sessions.map((ses, i) => {
                  const sesPct = Math.round((ses.score / ses.total) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${Math.max(sesPct * 0.48, 3)}px`,
                        background: '#2D6A4F',
                        opacity: 0.4 + (i / guestData.sessions.length) * 0.6,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Con tu cuenta tendras acceso a:</p>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-gray-100 space-y-3" style={{ background: '#FAFAF7' }}>
        <button
          onClick={() => navigate('/signup')}
          className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Crear cuenta gratis <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl text-[#2D6A4F] font-medium text-sm hover:underline"
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
