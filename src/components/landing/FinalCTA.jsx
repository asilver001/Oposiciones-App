export default function FinalCTA({ onStart }) {
  return (
    <>
      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F5F1EB, #ebe6dc)',
          padding: '104px 48px 96px',
          textAlign: 'center',
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .final-cta-section { padding: 60px 20px !important; }
            .final-cta-h2 { font-size: 30px !important; }
          }
        `}</style>
        <div
          className="final-cta-section"
          style={{ maxWidth: 640, margin: '0 auto' }}
        >
          <h2
            className="final-cta-h2"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 48,
              fontWeight: 400,
              color: '#1B4332',
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            La oposición no la gana quien más estudia en junio.{' '}
            <em style={{ color: '#2D6A4F', fontStyle: 'italic' }}>
              La gana quien no olvida lo de enero.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 17,
              color: '#4a4a4a',
              lineHeight: 1.65,
              marginBottom: 40,
              maxWidth: 500,
              margin: '0 auto 40px',
            }}
          >
            Oposita Smart analiza lo que recuerdas y lo que olvidas, y ajusta tu plan de estudio para que cada minuto cuente.
          </p>
          <button
            onClick={onStart}
            style={{
              background: '#1B4332',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '16px 36px',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.18s, transform 0.12s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#2D6A4F';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#1B4332';
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Descubrir mi nivel de preparación
          </button>
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 13,
              color: '#888',
              marginTop: 20,
              lineHeight: 1.5,
            }}
          >
            Empieza gratis · Siempre podrás exportar tus datos · Sin trucos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#1a1a1a',
          padding: '40px 48px',
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .footer-inner {
              flex-direction: column !important;
              align-items: center !important;
              gap: 24px !important;
              padding-bottom: 80px !important;
            }
            .footer-links {
              justify-content: center !important;
            }
          }
        `}</style>
        <div
          className="footer-inner"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Oposita Smart
          </span>
          <nav
            className="footer-links"
            style={{
              display: 'flex',
              gap: 28,
              flexWrap: 'wrap',
            }}
          >
            {['Términos', 'Privacidad', 'Contacto', 'opositasmart.com'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
