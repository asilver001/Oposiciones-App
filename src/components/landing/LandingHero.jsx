import { useEffect, useRef } from 'react';

const STYLES = `
  .hero-btn-primary:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 24px rgba(27,67,50,0.35) !important;
  }
  .hero-btn-secondary:hover {
    background: rgba(45,106,79,0.06) !important;
  }

  @media (max-width: 767px) {
    .hero-grid { grid-template-columns: 1fr !important; padding: 40px 20px !important; gap: 40px !important; min-height: auto !important; }
    .hero-visual-col { display: none !important; }
    .hero-h1 { font-size: 44px !important; letter-spacing: -1.5px !important; }
    .hero-ctas { flex-direction: column !important; align-items: stretch !important; }
    .hero-ctas button { width: 100%; justify-content: center !important; }
  }
`;

export default function LandingHero({ onStart, onLogin }) {
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement('style');
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }, []);

  return (
    <section
      className="hero-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '85vh',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 48px',
        gap: 60,
        alignItems: 'center',
      }}
    >
      {/* Left column */}
      <div>
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: '#2D6A4F',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          <span
            style={{ display: 'inline-block', width: 24, height: 1.5, background: '#2D6A4F', flexShrink: 0 }}
          />
          Para quienes llevan demasiado tiempo esperando su plaza
        </div>

        {/* H1 */}
        <h1
          className="hero-h1"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 62,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          La academia no te va a dar
          <br />
          <em style={{ color: '#2D6A4F', fontStyle: 'italic' }}>esto gratis</em>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 17,
            color: '#5C5C5C',
            lineHeight: 1.75,
            marginTop: 28,
            maxWidth: 440,
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          15 minutos al día con preguntas adaptadas a tu nivel real. Sin temario interminable.
          Sin memorizar lo que ya sabes. El sistema trabaja para ti.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" style={{ display: 'flex', gap: 14, marginTop: 32, alignItems: 'flex-start' }}>
          <div>
            <button
              className="hero-btn-primary"
              onClick={onStart}
              style={{
                background: 'linear-gradient(145deg, #1B4332, #2D6A4F)',
                color: '#fff',
                border: 'none',
                padding: '16px 36px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Instrument Sans', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(27,67,50,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Ver mi nivel ahora
            </button>
            <p
              style={{
                fontSize: 12,
                color: '#888',
                marginTop: 8,
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            >
              Sin tarjeta · Sin contraseña · En 30 segundos
            </p>
          </div>

          <button
            className="hero-btn-secondary"
            onClick={onLogin}
            style={{
              background: 'transparent',
              color: '#2D6A4F',
              border: '1.5px solid #2D6A4F',
              padding: '15px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Instrument Sans', sans-serif",
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: 0,
              alignSelf: 'flex-start',
            }}
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>

      {/* Right column — phone mockup */}
      <div
        className="hero-visual-col"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(82,183,136,0.07) 0%, transparent 70%)',
        }}
      >
        {/* Floating readiness card */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: -12,
            background: '#fff',
            borderRadius: 16,
            padding: '18px 22px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.06)',
            width: 180,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 600,
              fontFamily: "'Instrument Sans', sans-serif",
            }}
          >
            Preparación
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 40,
              color: '#2D6A4F',
              marginTop: 2,
              lineHeight: 1,
            }}
          >
            73%
          </div>
          <div
            style={{
              height: 5,
              background: '#E8E4DE',
              borderRadius: 3,
              marginTop: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '73%',
                background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* Phone frame */}
        <div
          style={{
            width: 280,
            height: 560,
            background: '#fff',
            borderRadius: 36,
            boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 120,
              height: 28,
              background: '#1a1a1a',
              borderRadius: '0 0 16px 16px',
              margin: '0 auto',
            }}
          />

          <div style={{ padding: 16 }}>
            {/* Phone header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0 16px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 16,
                  color: '#1a1a1a',
                }}
              >
                Estudio
              </span>
              <span
                style={{
                  background: 'rgba(45,106,79,0.1)',
                  color: '#2D6A4F',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                Tema 4
              </span>
            </div>

            {/* Question */}
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: '#fafaf7',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                Tribunal Constitucional
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginTop: 6,
                  lineHeight: 1.4,
                  color: '#333',
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                ¿Cuántos magistrados componen el Tribunal Constitucional?
              </div>
            </div>

            {/* Options */}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: '9 magistrados', correct: false },
                { label: '10 magistrados', correct: false },
                { label: '12 magistrados', correct: true },
                { label: '15 magistrados', correct: false },
              ].map(({ label, correct }) => (
                <div
                  key={label}
                  style={{
                    padding: '10px 12px',
                    border: correct ? '1px solid #52B788' : '1px solid #e8e8e4',
                    borderRadius: 8,
                    fontSize: 12,
                    color: correct ? '#1B4332' : '#555',
                    fontWeight: correct ? 600 : 400,
                    background: correct ? 'rgba(82,183,136,0.08)' : 'transparent',
                    fontFamily: "'Instrument Sans', sans-serif",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid #f0f0f0',
              }}
            >
              {[
                { num: '12', label: 'Hoy' },
                { num: '84%', label: 'Precisión' },
                { num: '7', label: 'Racha' },
              ].map(({ num, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 22,
                      color: '#2D6A4F',
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginTop: 2,
                      fontFamily: "'Instrument Sans', sans-serif",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating streak card */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: -24,
            background: '#fff',
            borderRadius: 12,
            padding: '14px 20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: 24 }}>🔥</span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            >
              7 días seguidos
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#888',
                fontFamily: "'Instrument Sans', sans-serif",
              }}
            >
              ¡Sigue así!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
