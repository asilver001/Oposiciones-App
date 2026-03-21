export default function InsightBanner() {
  return (
    <div
      style={{
        background: '#1B4332',
        padding: '36px 48px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          maxWidth: 720,
          margin: '0 auto',
          fontFamily: "'DM Serif Display', serif",
          fontSize: 22,
          color: 'rgba(255,255,255,0.90)',
          lineHeight: 1.5,
          letterSpacing: '-0.3px',
        }}
      >
        El{' '}
        <strong style={{ color: '#52B788', fontWeight: 400 }}>
          68% de los opositores que suspenden
        </strong>{' '}
        ya habían estudiado el temario. El problema no es el temario.{' '}
        <strong style={{ color: '#52B788', fontWeight: 400 }}>
          Es el olvido.
        </strong>
      </p>
      <p
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: 12,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 12,
        }}
      >
        Basado en investigación sobre memoria y aprendizaje activo · Ebbinghaus, 1885; Roediger &amp; Karpicke, 2006
      </p>
    </div>
  );
}
