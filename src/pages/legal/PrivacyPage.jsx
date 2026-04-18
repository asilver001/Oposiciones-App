/**
 * PrivacyPage — Calma Editorial style.
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

export default function PrivacyPage() {
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
          Política de privacidad
        </h1>
      </header>

      <main style={{ padding: '40px 24px 64px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          color: muted, fontWeight: 500, marginBottom: 14,
        }}>
          Legal · vigente desde abril 2026
        </div>
        <div style={{
          fontFamily: serif, fontSize: 48, fontStyle: 'italic',
          color: ink, letterSpacing: -1.2, lineHeight: 1.05, marginBottom: 12,
        }}>
          Privacidad de tus <span style={{ color: '#2D6A4F', fontStyle: 'normal' }}>datos</span>.
        </div>
        <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.6, marginTop: 14 }}>
          Tu privacidad es importante para nosotros. Esta política explica
          qué datos recopilamos, para qué los usamos y qué puedes hacer con ellos.
        </p>

        <Section title="Datos que recopilamos">
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Email y nombre (para autenticación).</li>
            <li>Fecha objetivo del examen y minutos al día (lo configuras tú en el onboarding).</li>
            <li>Progreso de estudio y respuestas a preguntas.</li>
            <li>Datos de navegación anonimizados vía Microsoft Clarity (agregados).</li>
          </ul>
        </Section>

        <Section title="Cómo usamos tus datos">
          Usamos tus datos únicamente para personalizar tu experiencia de
          aprendizaje — calcular qué preguntas repasar, mostrar tu progreso
          y mejorar el producto. No vendemos ni cedemos tu información
          personal a terceros.
        </Section>

        <Section title="Base legal">
          Tratamos tus datos bajo las bases legales del RGPD: consentimiento
          explícito al registrarte, ejecución del servicio que has pedido
          (la app en sí) e interés legítimo para prevenir abuso.
        </Section>

        <Section title="Tus derechos (RGPD)">
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Acceso: descarga todos tus datos en formato JSON desde Ajustes → «Exportar mis datos».</li>
            <li>Rectificación: cualquier dato erróneo, te lo corregimos.</li>
            <li>Eliminación: borra tu cuenta y todos tus datos desde Ajustes → «Eliminar cuenta».</li>
            <li>Portabilidad: tu export funciona en otros servicios compatibles.</li>
          </ul>
        </Section>

        <Section title="Retención">
          Conservamos tus datos mientras tu cuenta esté activa. Al eliminar
          la cuenta borramos todo en un plazo máximo de 30 días (los backups
          rotan a los 30 días).
        </Section>

        <div style={{
          marginTop: 56, paddingTop: 24, borderTop: `1px solid ${rule}`,
          fontSize: 12, color: muted, lineHeight: 1.5,
        }}>
          Para ejercer tus derechos o cualquier duda, escríbenos a{' '}
          <a href="mailto:hola@opositasmart.com" style={{ color: ink, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            hola@opositasmart.com
          </a>.
        </div>
      </main>
    </div>
  );
}
