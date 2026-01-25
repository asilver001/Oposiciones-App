import React from 'react';

export default function TermsPage() {
  return (
    <div className="prose prose-purple max-w-none">
      <h1>Términos y Condiciones</h1>

      <p className="text-gray-600 text-lg">
        Última actualización: {new Date().toLocaleDateString('es-ES')}
      </p>

      <h2>1. Aceptación de los términos</h2>
      <p>
        Al usar OpositaSmart, aceptas estos términos y condiciones.
      </p>

      <h2>2. Uso del servicio</h2>
      <p>
        Te comprometes a:
      </p>
      <ul>
        <li>Usar el servicio de manera responsable</li>
        <li>No compartir tu cuenta con terceros</li>
        <li>No intentar acceder a datos de otros usuarios</li>
      </ul>

      <h2>3. Contenido</h2>
      <p>
        Todo el contenido (preguntas, explicaciones, recursos) es propiedad de OpositaSmart
        o se usa con permiso. No está permitido:
      </p>
      <ul>
        <li>Copiar o distribuir el contenido sin autorización</li>
        <li>Usar el contenido con fines comerciales</li>
        <li>Modificar o crear obras derivadas</li>
      </ul>

      <h2>4. Limitación de responsabilidad</h2>
      <p>
        OpositaSmart es una herramienta de apoyo al estudio. No garantizamos:
      </p>
      <ul>
        <li>Aprobación en oposiciones</li>
        <li>Exactitud absoluta del contenido</li>
        <li>Disponibilidad ininterrumpida del servicio</li>
      </ul>

      <h2>5. Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos. Los cambios serán
        notificados con 30 días de antelación.
      </p>
    </div>
  );
}
