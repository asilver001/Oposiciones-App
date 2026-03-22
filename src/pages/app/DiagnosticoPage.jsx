import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HybridSession from '../../components/study/HybridSession';
import { ROUTES } from '../../router/paths';

const OPOSICIONES = [
  { id: 'aux', label: 'Auxiliar Administrativo del Estado', icon: '\u{1F4C4}', available: true },
  { id: 'admin', label: 'Administrativo del Estado', icon: '\u{1F3E2}', available: false },
  { id: 'gestion', label: 'Gesti\u00f3n de la Administraci\u00f3n', icon: '\u{1F4CA}', available: false },
  { id: 'justicia', label: 'Auxilio Judicial', icon: '\u{2696}\uFE0F', available: false },
];

export default function DiagnosticoPage() {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  if (started) {
    return (
      <HybridSession
        config={{ mode: 'first-test', totalQuestions: 10, reviewRatio: 0 }}
        onComplete={() => navigate(ROUTES.HOME, { replace: true })}
        onClose={() => navigate(ROUTES.HOME)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test de nivel</h1>
        <p className="text-gray-500 mb-8">10 preguntas para evaluar tu nivel. Sin presi\u00f3n, solo 5 minutos.</p>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">Selecciona tu oposici\u00f3n</p>
        {OPOSICIONES.map(op => (
          <button
            key={op.id}
            onClick={() => op.available && setStarted(true)}
            disabled={!op.available}
            className={`w-full rounded-2xl p-4 flex items-center mb-3 border-2 transition-all ${
              op.available ? 'border-gray-100 hover:border-gray-900 active:scale-[0.98]' : 'border-gray-50 opacity-45 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">{op.icon}</span>
            </div>
            <span className="flex-1 text-left font-medium text-gray-800 text-sm">{op.label}</span>
            {op.available ? (
              <span className="text-gray-400">\u203A</span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Pr\u00f3ximamente</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
