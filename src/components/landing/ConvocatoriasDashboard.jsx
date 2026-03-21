export default function ConvocatoriasDashboard() {
  const stats = [
    { num: '47.382', label: 'Plazas OEP', fill: '100%' },
    { num: '12.456', label: 'Convocadas', fill: '26%' },
    { num: '8', label: 'Abiertas ahora', fill: '40%' },
    { num: '127d', label: 'Próximo examen', fill: '65%' },
  ];

  const chips = ['Todos', 'C1', 'C2', 'A1/A2', 'Estado', 'CCAA', 'Local'];

  const cards = [
    {
      title: 'Auxiliar Administrativo del Estado',
      badge: 'Convocada',
      badgeStyle: {
        background: 'rgba(82,183,136,0.12)',
        color: '#1B4332',
      },
      plazas: '2.813',
      barFill: '85%',
      meta: 'Grupo C2 · AGE',
      countdown: '127 días',
      countdownLabel: 'countdown',
    },
    {
      title: 'Administrativo del Estado',
      badge: 'Prevista',
      badgeStyle: {
        background: 'rgba(217,119,6,0.1)',
        color: '#92400e',
      },
      plazas: '1.245',
      barFill: '45%',
      meta: 'Grupo C1 · AGE',
      countdown: '~Q3 2026',
      countdownLabel: 'estimate',
    },
    {
      title: 'Gestión de la Administración Civil',
      badge: 'En plazo',
      badgeStyle: {
        background: 'rgba(59,130,246,0.1)',
        color: '#1e40af',
      },
      plazas: '890',
      barFill: '60%',
      meta: 'Grupo A2 · AGE',
      countdown: 'Plazo: 15 abr',
      countdownLabel: 'deadline',
    },
  ];

  const sectionStyle = {
    fontFamily: "'Instrument Sans', sans-serif",
    background: '#F5F1EB',
  };

  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '96px 48px 80px',
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

  const subtitleStyle = {
    fontSize: '15px',
    color: '#666',
    marginTop: '10px',
    maxWidth: '560px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.6,
  };

  const statsRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  };

  const statCardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(0,0,0,0.04)',
    textAlign: 'center',
  };

  const statNumStyle = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '36px',
    color: '#2D6A4F',
    letterSpacing: '-1px',
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  };

  const statBarTrackStyle = {
    height: '5px',
    background: '#E8E4DE',
    borderRadius: '3px',
    marginTop: '12px',
    overflow: 'hidden',
  };

  const filtersStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(0,0,0,0.04)',
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  };

  const cardTitleStyle = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '17px',
    letterSpacing: '-0.3px',
    lineHeight: 1.3,
    maxWidth: '200px',
    color: '#1a1a1a',
  };

  const badgeBaseStyle = {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
  };

  const plazasRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  };

  const plazasNumStyle = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '28px',
    color: '#2D6A4F',
  };

  const plazasLabelStyle = {
    fontSize: '12px',
    color: '#888',
  };

  const barTrackStyle = {
    height: '6px',
    background: '#E8E4DE',
    borderRadius: '3px',
    marginBottom: '16px',
    overflow: 'hidden',
    position: 'relative',
  };

  const barFillBase = {
    height: '100%',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
  };

  const cardMetaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#888',
  };

  const countdownStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 600,
    color: '#2D6A4F',
  };

  return (
    <section id="convocatorias" style={sectionStyle}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <p style={eyebrowStyle}>Convocatorias 2025–2026</p>
          <h2 style={h2Style}>Panel de oposiciones en tiempo real</h2>
          <p style={subtitleStyle}>
            Seguimiento actualizado de todas las convocatorias activas. Sabe exactamente cuándo
            presentarte y cuántas plazas quedan.
          </p>
        </div>

        {/* Stats row */}
        <div style={statsRowStyle}>
          {stats.map((s) => (
            <div key={s.label} style={statCardStyle}>
              <div style={statNumStyle}>{s.num}</div>
              <div style={statLabelStyle}>{s.label}</div>
              <div style={statBarTrackStyle}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, #2D6A4F, #52B788)',
                    width: s.fill,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div style={filtersStyle}>
          {chips.map((chip) => {
            const isActive = chip === 'Todos';
            return (
              <button
                key={chip}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: `1.5px solid ${isActive ? '#2D6A4F' : '#E8E4DE'}`,
                  background: isActive ? '#2D6A4F' : 'transparent',
                  color: isActive ? '#fff' : '#777',
                  cursor: 'pointer',
                  fontFamily: "'Instrument Sans', sans-serif",
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Convocatoria cards */}
        <div style={cardsGridStyle}>
          {cards.map((card) => (
            <div key={card.title} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={cardTitleStyle}>{card.title}</div>
                <div style={{ ...badgeBaseStyle, ...card.badgeStyle }}>{card.badge}</div>
              </div>

              <div style={plazasRowStyle}>
                <span style={plazasNumStyle}>{card.plazas}</span>
                <span style={plazasLabelStyle}>plazas</span>
              </div>

              <div style={barTrackStyle}>
                <div style={{ ...barFillBase, width: card.barFill }} />
              </div>

              <div style={cardMetaStyle}>
                <span>{card.meta}</span>
                <span style={countdownStyle}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {card.countdown}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
