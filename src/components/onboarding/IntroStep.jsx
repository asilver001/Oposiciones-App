import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

function IntroStep({ onStart, onSkip, onBack }) {
  const [nombre, setNombre] = useState('');

  const handleStart = () => {
    onStart(nombre.trim() || null);
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-16 lg:flex lg:items-start lg:justify-center">
      <div className="max-w-md w-full lg:mx-auto">
        <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Atrás
        </button>
        <div className="flex justify-center gap-2 mb-12">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-6 h-2 rounded-full bg-gray-900"></div>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">¡Casi listo!</h1>
          <p className="text-gray-500 mb-8">¿Cómo te llamas? Así personalizamos tu experiencia.</p>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-center text-lg focus:border-gray-400 focus:outline-none transition mb-8"
            autoComplete="given-name"
          />

          <button
            onClick={handleStart}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-sm transition-all active:scale-[0.98]"
          >
            Empezar test
          </button>
          <button onClick={onSkip} className="mt-4 text-gray-500 text-sm">
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroStep;
