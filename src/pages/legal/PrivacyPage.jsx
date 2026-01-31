/**
 * PrivacyPage
 *
 * Privacy policy page.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../router/routes';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">Politica de Privacidad</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto prose prose-purple">
        <h2>Privacidad de tus datos</h2>
        <p>
          Tu privacidad es importante para nosotros. Esta politica
          explica como recopilamos y usamos tu informacion.
        </p>

        <h3>Datos que recopilamos</h3>
        <ul>
          <li>Email (para autenticacion)</li>
          <li>Progreso de estudio</li>
          <li>Respuestas a preguntas</li>
        </ul>

        <h3>Como usamos tus datos</h3>
        <p>
          Usamos tus datos unicamente para mejorar tu experiencia
          de aprendizaje y personalizar el contenido.
        </p>

        <h3>Tus derechos</h3>
        <p>
          Puedes solicitar acceso, correccion o eliminacion de tus
          datos en cualquier momento.
        </p>
      </main>
    </div>
  );
}
