export default function ResourceDownload() {
  return (
    <section
      style={{
        background: 'linear-gradient(160deg, #f0ede6, #F5F1EB)',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        padding: '64px 48px',
        textAlign: 'center',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .resource-download-inner { padding: 48px 20px !important; }
        }
      `}</style>
      <div
        className="resource-download-inner"
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            fontWeight: 400,
            color: '#1B4332',
            marginBottom: 16,
            lineHeight: 1.25,
          }}
        >
          Las 50 preguntas más repetidas en oposiciones AGE
        </h3>
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 16,
            color: '#4a4a4a',
            lineHeight: 1.65,
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
          }}
        >
          Descarga gratis las preguntas que más se repiten en convocatorias de Auxiliar Administrativo (2018–2024). Sin registro.
        </p>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffffff',
            border: '1.5px solid #2D6A4F',
            color: '#2D6A4F',
            borderRadius: 10,
            padding: '13px 28px',
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#2D6A4F';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#2D6A4F';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar PDF gratis
        </button>
      </div>
    </section>
  );
}
