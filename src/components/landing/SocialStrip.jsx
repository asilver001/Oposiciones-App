import { useEffect, useRef } from 'react';

const STYLES = `
  @media (max-width: 767px) {
    .social-strip-inner {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 24px 16px !important;
      justify-items: center;
    }
    .ss-divider { display: none !important; }
    .social-strip-outer { padding: 24px 20px !important; }
  }
`;

const ITEMS = [
  { num: '5 min',  lines: ['al día', 'es suficiente'] },
  { num: '1.414',  lines: ['preguntas', 'AGE verificadas'] },
  { num: '14',     lines: ['temas del', 'programa oficial'] },
  { num: '0€',     lines: ['acceso', 'fundador'] },
];

export default function SocialStrip() {
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement('style');
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }, []);

  return (
    <div
      className="social-strip-outer"
      style={{
        background: 'rgba(0,0,0,0.02)',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        padding: '20px 48px',
      }}
    >
      <div
        className="social-strip-inner"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {ITEMS.map(({ num, lines }, i) => (
          <>
            {i > 0 && (
              <div
                key={`div-${i}`}
                className="ss-divider"
                style={{
                  width: 1,
                  height: 32,
                  background: 'rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              />
            )}
            <div
              key={num}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 28,
                  color: '#2D6A4F',
                  lineHeight: 1,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: '#666',
                  lineHeight: 1.3,
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                {lines[0]}
                <br />
                {lines[1]}
              </span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
