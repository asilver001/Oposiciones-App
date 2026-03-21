const DIMENSIONS = [
  { emoji: '📚', label: 'Cobertura', weight: '30%' },
  { emoji: '🎯', label: 'Precisión', weight: '40%' },
  { emoji: '📝', label: 'Simulacros', weight: '30%' },
];

// Pentagon geometry helpers
// 5 vertices of a regular pentagon, starting from the top and going clockwise
function pentagonPoints(r, cx = 0, cy = 0) {
  return Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

function pointsAttr(pts) {
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

function RadarChart() {
  const cx = 150;
  const cy = 140;
  const rings = [30, 55, 80];
  const maxR = 80;

  // Axis endpoints
  const axisPoints = pentagonPoints(maxR, cx, cy);

  // Data polygon — matches spec exactly
  const dataPoints = '150,75 224,116 182,185 115,197 72,114';

  // Axis label positions (slightly beyond the outermost ring)
  const labelPoints = pentagonPoints(maxR + 22, cx, cy);
  const axisLabels = ['Cobertura', 'Precisión', 'Simulacros', 'Velocidad', 'Regularidad'];

  return (
    <svg
      viewBox="0 0 300 280"
      width="100%"
      style={{ display: 'block', maxWidth: 300, margin: '0 auto' }}
      aria-label="Radar de preparación"
    >
      {/* Concentric pentagon grid lines */}
      {rings.map((r) => {
        const pts = pentagonPoints(r, cx, cy);
        return (
          <polygon
            key={r}
            points={pointsAttr(pts)}
            fill="none"
            stroke="#E8E4DE"
            strokeWidth="1.5"
          />
        );
      })}

      {/* Axis lines from center */}
      {axisPoints.map(([x, y], i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x.toFixed(2)}
          y2={y.toFixed(2)}
          stroke="#E8E4DE"
          strokeWidth="1.5"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="rgba(45,106,79,0.12)"
        stroke="#2D6A4F"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data point circles */}
      {dataPoints.split(' ').map((pair, i) => {
        const [x, y] = pair.split(',');
        return (
          <circle
            key={i}
            cx={parseFloat(x)}
            cy={parseFloat(y)}
            r={4}
            fill="#2D6A4F"
          />
        );
      })}

      {/* Axis labels */}
      {labelPoints.map(([x, y], i) => (
        <text
          key={i}
          x={x.toFixed(2)}
          y={y.toFixed(2)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontFamily="'Instrument Sans', sans-serif"
          fontWeight="600"
          fill="#666"
        >
          {axisLabels[i]}
        </text>
      ))}
    </svg>
  );
}

export default function ReadinessRadar() {
  return (
    <section
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 48px',
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      <div
        id="readiness-radar-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* Left: text */}
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 3,
              color: '#2D6A4F',
              margin: 0,
            }}
          >
            Tu panel de control
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 36,
              letterSpacing: '-0.8px',
              lineHeight: 1.15,
              marginTop: 10,
              marginBottom: 28,
              color: '#1a1a1a',
            }}
          >
            ¿Cuánto me falta?{' '}
            <em style={{ fontStyle: 'italic', color: '#2D6A4F' }}>
              Esa pregunta ya tiene respuesta
            </em>
          </h2>

          {/* Dimension rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DIMENSIONS.map(({ emoji, label, weight }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span
                  style={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1a1a1a',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#2D6A4F',
                    background: 'rgba(45,106,79,0.08)',
                    borderRadius: 100,
                    padding: '3px 10px',
                  }}
                >
                  {weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: radar card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          {/* Card label */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: '#999',
              margin: '0 0 16px',
              textAlign: 'center',
            }}
          >
            Índice de preparación
          </p>

          {/* SVG Radar */}
          <RadarChart />

          {/* Score row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 48,
                color: '#2D6A4F',
                lineHeight: 1,
              }}
            >
              73
            </span>
            <span
              style={{
                fontSize: 18,
                color: '#999',
                fontWeight: 400,
                alignSelf: 'flex-end',
                marginBottom: 6,
              }}
            >
              /100
            </span>
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <span
              style={{
                background: 'rgba(45,106,79,0.10)',
                color: '#2D6A4F',
                fontWeight: 600,
                fontSize: 12,
                padding: '5px 16px',
                borderRadius: 100,
                letterSpacing: 0.3,
              }}
            >
              Avanzado
            </span>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          #readiness-radar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
