import React from 'react';
import { ArrowLeft } from 'lucide-react';

function IntroStep({ onStart, onSkip, onBack }) {
  return (
    <div className="min-h-screen bg-white px-6 pt-16">
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">¡Vamos a hacer tu primer test!</h1>
        <p className="text-gray-500 mb-12">5 preguntas para conocer tu nivel. Sin presión, es solo para personalizar tu experiencia.</p>
        <button
          onClick={onStart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-sm transition-all active:scale-[0.98]"
        >
          Empezar test
        </button>
        <button onClick={onSkip} className="mt-4 text-gray-500 text-sm">
          Saltar por ahora
        </button>
      </div>
    </div>
  );
}

export default IntroStep;
