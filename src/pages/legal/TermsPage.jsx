/**
 * TermsPage
 *
 * Terms of service page.
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../router/routes';

export default function TermsPage() {
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
        <h1 className="font-semibold">Terminos y Condiciones</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto prose prose-purple">
        <h2>Terminos de uso</h2>
        <p>
          Al usar OpositaSmart, aceptas estos terminos de servicio.
          La aplicacion se proporciona tal cual, sin garantias.
        </p>

        <h3>Uso aceptable</h3>
        <p>
          Te comprometes a usar la aplicacion unicamente para preparar
          tus oposiciones de manera legitima.
        </p>

        <h3>Contenido</h3>
        <p>
          Las preguntas y materiales son orientativos y no garantizan
          resultados en examenes oficiales.
        </p>
      </main>
    </div>
  );
}
