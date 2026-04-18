import { useNavigate } from 'react-router-dom';
import { getGuestData } from '../guestStorage';
import { Lock, TrendingUp, Brain, BarChart3, BookOpen } from 'lucide-react';

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
    { icon: Brain,       title: 'Repetición espaciada',  desc: 'El sistema recuerda lo que fallas y te lo repasa en el momento justo.' },
    { icon: BarChart3,   title: 'Estadísticas detalladas', desc: 'Conoce tus puntos fuertes y débiles por tema.' },
    { icon: BookOpen,    title: 'Más de 1.400 preguntas', desc: 'Banco completo de Auxiliar Administrativo AGE.' },
    { icon: TrendingUp,  title: 'Progreso a tu ritmo',    desc: 'Sin presión. Unos minutos al día, sin agobios.' },
  ];

  const paper = '#F3F3F0';
  const ink = '#1B4332';
  const inkSoft = '#2D6A4F';
  const muted = '#8A8783';
  const rule = 'rgba(27,67,50,0.12)';
  const serif = '"Instrument Serif", Georgia, serif';

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: paper, fontFamily: 'Inter, sans-serif', color: '#2A2A28',
    }}>
      <div style={{
        flex: 1, maxWidth: 520, margin: '0 auto', width: '100%',
        padding: '44px 24px 24px', display: 'flex', flexDirection: 'column',
      }}>
        {/* Masthead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: muted, fontWeight: 500,
          }}>
            Prueba completada
          </div>
          <div style={{ fontSize: 10, color: muted, fontVariantNumeric: 'tabular-nums' }}>
            {sessionsCompleted} / 5 sesiones
          </div>
        </div>
        <div style={{ height: 1, background: ink, marginTop: 10, opacity: 0.85 }} />

        {/* Headline */}
        <div style={{ marginTop: 40 }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: muted, marginBottom: 12, fontWeight: 500,
          }}>
            Tu turno
          </div>
          <div style={{
            fontFamily: serif, fontSize: 36, fontStyle: 'italic',
            color: ink, letterSpacing: -0.9, lineHeight: 1.1,
          }}>
            Has terminado las cinco sesiones{' '}
            <span style={{ color: inkSoft, fontStyle: 'normal' }}>gratuitas</span>.
          </div>
          <p style={{ fontSize: 14, color: '#4B5563', marginTop: 14, lineHeight: 1.55 }}>
            Crea tu cuenta para seguir preparando tu oposición. Sin tarjeta, sin presión.
          </p>
        </div>

        {/* Stats strip */}
        <div style={{
          marginTop: 36, padding: '20px 0',
          borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18,
        }}>
          {[
            ['sesiones', sessionsCompleted],
            ['preguntas', totalAnswered],
            ['precisión', `${overallPct}%`],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{
                fontFamily: serif, fontSize: 36, color: ink,
                lineHeight: 1, letterSpacing: -1, fontVariantNumeric: 'tabular-nums',
              }}>{value}</div>
              <div style={{
                fontSize: 10, color: muted, marginTop: 8,
                letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Sessions mini chart */}
        {guestData && guestData.sessions.length > 1 && (
          <div style={{ marginTop: 28 }}>
            <div style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: muted, marginBottom: 10, fontWeight: 500,
            }}>
              Tus 5 sesiones
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
              {guestData.sessions.map((ses, i) => {
                const sesPct = Math.round((ses.score / ses.total) * 100);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${Math.max(sesPct * 0.48, 4)}px`,
                      background: ink,
                      opacity: 0.3 + (i / guestData.sessions.length) * 0.7,
                      borderRadius: 1,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Features */}
        <div style={{ marginTop: 36 }}>
          <div style={{
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            color: muted, marginBottom: 16, fontWeight: 500,
          }}>
            Con tu cuenta
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: 14,
                  padding: '14px 0',
                  borderTop: i === 0 ? `1px solid ${rule}` : 'none',
                  borderBottom: `1px solid ${rule}`,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ paddingTop: 3 }}>
                  <Icon style={{ width: 16, height: 16, color: inkSoft, strokeWidth: 1.6 }} />
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 18, color: ink, letterSpacing: -0.2 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      {/* CTA */}
      <div style={{
        padding: '16px 24px 28px', background: paper,
        borderTop: `1px solid ${rule}`,
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              width: '100%', background: ink, color: paper,
              border: 'none', padding: '16px 18px',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>Crear cuenta gratis</span>
            <span aria-hidden="true">→</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', background: 'transparent', color: ink,
              border: `1px solid ${rule}`, padding: '14px 18px',
              fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
