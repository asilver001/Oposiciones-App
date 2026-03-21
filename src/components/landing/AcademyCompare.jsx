export default function AcademyCompare() {
  const oldRows = [
    { icon: '💸', text: '3.000–6.000€ al año' },
    { icon: '🕐', text: '3 horas diarias mínimo' },
    { icon: '📖', text: 'Temario estático, igual para todos' },
    { icon: '❓', text: 'No sabes si estás preparado' },
    { icon: '😰', text: 'Presión, agobio y comparaciones' },
  ];

  const newRows = [
    { icon: '✅', text: 'Gratis, sin coste oculto' },
    { icon: '✅', text: '10–15 min al día, a tu ritmo' },
    { icon: '✅', text: 'Se adapta a tus puntos débiles' },
    { icon: '✅', text: 'Índice de preparación real' },
    { icon: '✅', text: 'Tu ritmo, sin presión' },
  ];

  const sectionStyle = {
    fontFamily: "'Instrument Sans', sans-serif",
    background: '#F5F1EB',
  };

  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 48px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '48px',
  };

  const eyebrowStyle = {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '3px',
    color: '#2D6A4F',
  };

  const h2Style = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '36px',
    letterSpacing: '-0.8px',
    marginTop: '10px',
    color: '#1a1a1a',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const oldCardStyle = {
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid rgba(0,0,0,0.04)',
    background: '#fff',
  };

  const newCardStyle = {
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid rgba(0,0,0,0.04)',
    background: 'linear-gradient(145deg, #1B4332, #2D6A4F)',
    color: '#fff',
  };

  const cardTitleOldStyle = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '20px',
    marginBottom: '20px',
    color: '#1a1a1a',
  };

  const cardTitleNewStyle = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '20px',
    marginBottom: '20px',
    color: '#fff',
  };

  const rowOldStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    fontSize: '14px',
    color: '#555',
  };

  const rowNewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
  };

  const iconStyle = {
    fontSize: '18px',
    flexShrink: 0,
  };

  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <p style={eyebrowStyle}>Por qué funciona</p>
          <h2 style={h2Style}>Sin academia. Sin horarios. Sin excusas.</h2>
        </div>

        {/* Comparison grid */}
        <div style={gridStyle}>
          {/* Old card */}
          <div style={oldCardStyle}>
            <h3 style={cardTitleOldStyle}>Academia tradicional</h3>
            {oldRows.map((row) => (
              <div key={row.text} style={rowOldStyle}>
                <span style={iconStyle}>{row.icon}</span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>

          {/* New card */}
          <div style={newCardStyle}>
            <h3 style={cardTitleNewStyle}>Oposita Smart</h3>
            {newRows.map((row) => (
              <div key={row.text} style={rowNewStyle}>
                <span style={iconStyle}>{row.icon}</span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
