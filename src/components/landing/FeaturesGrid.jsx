import { useState } from 'react';

const FEATURES = [
  {
    emoji: '🧠',
    title: 'El sistema que estudia por ti',
    body: 'El algoritmo FSRS analiza tu rendimiento y decide qué repasar cada día. Estudias menos, retienes más.',
  },
  {
    emoji: '📊',
    title: 'Sabes exactamente cuánto te falta',
    body: 'Un índice de preparación de 0 a 100 combina cobertura, precisión y simulacros. Sin conjeturas.',
  },
  {
    emoji: '⚡',
    title: '5 minutos al día sin excusas',
    body: 'Sesiones de test rápido adaptadas a tu tiempo libre. El hábito es más poderoso que la maratón.',
  },
  {
    emoji: '📝',
    title: 'El día del examen, sin sorpresas',
    body: 'Simulacros cronometrados con las condiciones reales de la oposición para que llegues rodado.',
  },
  {
    emoji: '🗂',
    title: 'Lo que se te olvida, vuelve',
    body: 'Las flashcards aparecen justo antes de que olvides. La curva del olvido trabaja a tu favor.',
  },
  {
    emoji: '📈',
    title: 'Deja de estudiar lo que ya sabes',
    body: 'Analytics detallado por tema: detecta tus puntos débiles y concentra el esfuerzo donde importa.',
  },
];

function FeatureCard({ emoji, title, body }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        border: '1px solid rgba(0,0,0,0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.02)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: 'rgba(45,106,79,0.08)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20,
          letterSpacing: '-0.3px',
          marginBottom: 8,
          color: '#1a1a1a',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: 14,
          color: '#666',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 48px',
        fontFamily: "'Instrument Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
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
          Funcionalidades
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 36,
            letterSpacing: '-0.8px',
            marginTop: 10,
            color: '#1a1a1a',
          }}
        >
          Todo lo que necesitas para aprobar
        </h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>

      {/* Responsive override via <style> tag — minimal, only for grid collapse */}
      <style>{`
        @media (max-width: 768px) {
          #features > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          #features > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
