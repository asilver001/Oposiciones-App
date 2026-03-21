const STEPS = [
  {
    num: '01',
    title: 'Elige tu oposición',
    body: 'Selecciona la convocatoria que te interesa. Cargamos el temario oficial y configuramos tu plan de estudio.',
  },
  {
    num: '02',
    title: 'Practica cada día',
    body: 'Tests cortos adaptados a tu ritmo. Cinco minutos o una hora: el sistema se ajusta a ti, no al revés.',
  },
  {
    num: '03',
    title: 'Repasa con ciencia',
    body: 'El algoritmo FSRS programa cada repaso en el momento óptimo. Lo que aprendes se queda.',
  },
  {
    num: '04',
    title: 'Mide tu progreso',
    body: 'Consulta tu índice de preparación en tiempo real y llega al examen sabiendo exactamente dónde estás.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: '#1B4332',
        padding: '96px 48px',
        color: '#fff',
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 3,
            color: '#52B788',
            margin: 0,
          }}
        >
          El método
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 46,
            letterSpacing: '-1.5px',
            lineHeight: 1.06,
            marginTop: 12,
            color: '#fff',
          }}
        >
          Cómo funciona
        </h2>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 40,
            marginTop: 56,
          }}
        >
          {STEPS.map((step) => (
            <Step key={step.num} {...step} />
          ))}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          #how > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .how-step-inner {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .how-step-num {
            font-size: 36px !important;
            min-width: 56px !important;
            margin-bottom: 0 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          #how > div > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function Step({ num, title, body }) {
  return (
    <div className="how-step-inner" style={{ display: 'block' }}>
      <p
        className="how-step-num"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 52,
          color: 'rgba(82,183,136,0.35)',
          lineHeight: 1,
          margin: 0,
          marginBottom: 0,
        }}
      >
        {num}
      </p>
      <div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginTop: 12,
            marginBottom: 0,
            color: '#fff',
            fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.6,
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
