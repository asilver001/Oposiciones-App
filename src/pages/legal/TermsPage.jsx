/**
 * TermsPage — Calma Editorial style.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ink = '#1B4332';
const paper = '#F3F3F0';
const muted = '#8A8783';
const rule = 'rgba(27,67,50,0.12)';
const serif = '"Instrument Serif", Georgia, serif';

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 32 }}>
      <div style={{
        fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
        color: muted, fontWeight: 500, marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{ fontSize: 15, color: '#2A2A28', lineHeight: 1.65 }}>
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: paper,
      fontFamily: 'Inter, sans-serif', color: '#2A2A28',
    }}>
      <header style={{
        position: 'sticky', top: 0, background: paper,
        borderBottom: `1px solid ${rule}`, padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12, zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 6, display: 'flex', color: muted,
          }}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </button>
        <h1 style={{
          margin: 0, fontSize: 13, letterSpacing: 1.2,
          textTransform: 'uppercase', color: ink, fontWeight: 500,
        }}>
          Términos y condiciones
        </h1>
      </header>

      <main style={{ padding: '40px 24px 64px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: muted, fontWeight: 500, marginBottom: 14,
        }}>
          Legal · vigentes desde abril 2026
        </div>
        <div style={{
          fontFamily: serif, fontSize: 48, fontStyle: 'italic',
          color: ink, letterSpacing: -1.2, lineHeight: 1.05, marginBottom: 12,
        }}>
          Términos de <span style={{ color: '#2D6A4F', fontStyle: 'normal' }}>uso</span>.
        </div>
        <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.6, marginTop: 14 }}>
          Al usar OpositaSmart aceptas estas condiciones. La aplicación se
          proporciona «tal cual», sin garantías.
        </p>

        <Section title="Uso aceptable">
          Te comprometes a usar la aplicación únicamente para preparar tus
          oposiciones de manera legítima, sin intentar extraer masivamente
          el banco de preguntas ni suplantar a otros usuarios.
        </Section>

        <Section title="Contenido y preguntas">
          Las preguntas y materiales son orientativos y no garantizan
          resultados en exámenes oficiales. Trabajamos con el texto del
          BOE pero pueden existir reformas recientes no reflejadas. Si ves
          algo erróneo, puedes reportarlo desde la propia pregunta.
        </Section>

        <Section title="Cuentas y acceso">
          Eres responsable de mantener la confidencialidad de tu cuenta.
          Puedes eliminar tu cuenta en cualquier momento desde Ajustes;
          al hacerlo borraremos tu progreso y tus datos personales (ver
          Política de privacidad).
        </Section>

        <Section title="Limitación de responsabilidad">
          No nos hacemos responsables de decisiones académicas o profesionales
          tomadas con base en el contenido de la aplicación. El objetivo es
          ser una herramienta complementaria, no una academia oficial.
        </Section>

        <Section title="Cambios en los términos">
          Podemos actualizar estos términos para reflejar mejoras del servicio
          o cambios legales. Si los cambios son relevantes te avisaremos por
          email antes de que entren en vigor.
        </Section>

        <div style={{
          marginTop: 56, paddingTop: 24, borderTop: `1px solid ${rule}`,
          fontSize: 12, color: muted, lineHeight: 1.5,
        }}>
          Si tienes dudas, escríbenos a{' '}
          <a href="mailto:hola@opositasmart.com" style={{ color: ink, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            hola@opositasmart.com
          </a>.
        </div>
      </main>
    </div>
  );
}
