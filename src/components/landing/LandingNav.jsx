import { useEffect, useRef } from 'react';

const STYLES = `
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  .landing-nav-links a:hover { color: #2D6A4F !important; }
  .landing-nav-cta:hover { background: #2D6A4F !important; }

  @media (max-width: 767px) {
    .landing-nav-links { display: none !important; }
    .landing-nav { padding: 16px 20px !important; }
  }
`;

export default function LandingNav({ onStart }) {
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const tag = document.createElement('style');
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }, []);

  return (
    <nav
      className="landing-nav"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        position: 'sticky',
        top: 0,
        background: 'rgba(245,241,235,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(145deg, #1B4332, #2D6A4F)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="5" width="14" height="2" rx="1" fill="white" opacity="0.9" />
            <rect x="3" y="9" width="10" height="2" rx="1" fill="white" opacity="0.7" />
            <rect x="3" y="13" width="12" height="2" rx="1" fill="white" opacity="0.5" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 20,
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
          }}
        >
          Oposita Smart
        </span>
      </div>

      {/* Center links — hidden on mobile via injected media query */}
      <div
        className="landing-nav-links"
        style={{ display: 'flex', gap: 32, alignItems: 'center' }}
      >
        {[
          { label: 'Convocatorias', href: '#convocatorias' },
          { label: 'Funciones',     href: '#funciones' },
          { label: 'Método',        href: '#metodo' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            style={{
              textDecoration: 'none',
              color: '#666',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Instrument Sans', sans-serif",
              transition: 'color 0.2s',
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="landing-nav-cta"
        onClick={onStart}
        style={{
          background: '#1B4332',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 44,
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            background: '#52B788',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'pulse-dot 2s infinite',
          }}
        />
        Beta gratuita
      </button>
    </nav>
  );
}
