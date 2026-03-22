import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import OposicionWaitlistModal from './OposicionWaitlistModal';

function GoalStep({ step, onSelect, onBack }) {
  const [waitlistOposicion, setWaitlistOposicion] = useState(null);
  // Step 'oposicion' - First step (no back button, first dot active)
  if (step === 'oposicion') {
    const options = [
      { id: 'aux', label: 'Auxiliar Administrativo del Estado (C2)', icon: '📄', available: true },
      { id: 'admin', label: 'Administrativo del Estado (C1)', icon: '🏢', available: false },
      { id: 'gestion', label: 'Gestión de la Admin. Civil del Estado (A2)', icon: '💼', available: false },
      { id: 'tramitacion', label: 'Tramitación Procesal (Justicia)', icon: '⚖️', available: false },
      { id: 'auxilio', label: 'Auxilio Judicial (Justicia)', icon: '🏛️', available: false },
      { id: 'ss', label: 'Auxiliar Admin. Seguridad Social', icon: '🏥', available: false },
      { id: 'correos', label: 'Correos y Telégrafos', icon: '📮', available: false },
      { id: 'ccaa', label: 'Auxiliar Admin. CCAA (genérico)', icon: '🗺️', available: false },
    ];
    return (
      <div className="min-h-screen bg-white px-6 pt-16 lg:flex lg:items-start lg:justify-center">
        <div className="max-w-md w-full lg:mx-auto">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-6 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">¿Qué oposición preparas?</h1>
        <p className="text-gray-500 mb-8">Selecciona para personalizar tu experiencia</p>
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => o.available ? onSelect(o.id) : setWaitlistOposicion(o.label)}
            className={`w-full bg-white rounded-2xl p-4 flex items-center mb-3 border-2 transition-all ${
              o.available
                ? 'border-gray-100 hover:border-gray-900 active:scale-[0.98] cursor-pointer'
                : 'border-gray-50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">{o.icon}</span>
            </div>
            <span className="flex-1 text-left font-medium text-gray-800">{o.label}</span>
            {o.available ? (
              <span className="text-gray-400 text-2xl">›</span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Próximamente</span>
            )}
          </button>
        ))}
        {waitlistOposicion && (
          <OposicionWaitlistModal
            oposicion={waitlistOposicion}
            onClose={() => setWaitlistOposicion(null)}
          />
        )}
        </div>
      </div>
    );
  }

  // Step 'tiempo' - Second step (has back button, second dot active)
  const options = [
    { id: '15', label: '15 minutos', desc: 'Perfecto para empezar', questions: 10 },
    { id: '30', label: '30 minutos', desc: 'Ritmo constante', questions: 20 },
    { id: '60', label: '1 hora o más', desc: 'Máximo rendimiento', questions: 40 }
  ];
  return (
    <div className="min-h-screen bg-white px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Atrás
      </button>
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-gray-900"></div>
        <div className="w-6 h-2 rounded-full bg-gray-900"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">¿Cuánto tiempo al día?</h1>
      <p className="text-gray-500 mb-8">Puedes cambiarlo cuando quieras</p>
      {options.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className="w-full bg-white rounded-2xl p-5 mb-3 border-2 border-gray-100 hover:border-gray-900 text-left transition-all"
        >
          <p className="font-semibold text-gray-800 text-lg">{t.label}</p>
          <p className="text-gray-500 text-sm mt-1">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}

export default GoalStep;
