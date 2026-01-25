import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="prose prose-purple max-w-none">
      <h1>Política de Privacidad</h1>

      <p className="text-gray-600 text-lg">
        Última actualización: {new Date().toLocaleDateString('es-ES')}
      </p>

      <h2>1. Información que recopilamos</h2>
      <p>
        En OpositaSmart, recopilamos la siguiente información:
      </p>
      <ul>
        <li>Nombre y correo electrónico (necesarios para crear tu cuenta)</li>
        <li>Progreso de estudio y respuestas a preguntas</li>
        <li>Preferencias de estudio y metas personales</li>
      </ul>

      <h2>2. Cómo usamos tu información</h2>
      <p>
        Utilizamos tu información para:
      </p>
      <ul>
        <li>Proporcionar y mejorar nuestros servicios</li>
        <li>Personalizar tu experiencia de estudio</li>
        <li>Enviar notificaciones importantes sobre tu cuenta</li>
      </ul>

      <h2>3. Protección de datos</h2>
      <p>
        Tus datos están protegidos mediante:
      </p>
      <ul>
        <li>Cifrado de extremo a extremo</li>
        <li>Autenticación segura con Supabase</li>
        <li>Cumplimiento con GDPR y LOPD</li>
      </ul>

      <h2>4. Tus derechos</h2>
      <p>
        Tienes derecho a:
      </p>
      <ul>
        <li>Acceder a tus datos personales</li>
        <li>Rectificar datos incorrectos</li>
        <li>Solicitar la eliminación de tu cuenta</li>
        <li>Exportar tus datos</li>
      </ul>

      <h2>5. Contacto</h2>
      <p>
        Para cualquier consulta sobre privacidad, contacta con nosotros en:{' '}
        <a href="mailto:privacy@opositasmart.com" className="text-purple-600 hover:text-purple-700">
          privacy@opositasmart.com
        </a>
      </p>
    </div>
  );
}
