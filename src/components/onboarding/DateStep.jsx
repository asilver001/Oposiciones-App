import React from 'react';
import { ArrowLeft } from 'lucide-react';

function DateStep({ onSelect, onBack }) {
  const options = [
    { id: '3m', label: 'En menos de 3 meses' },
    { id: '6m', label: 'Entre 3 y 6 meses' },
    { id: '1y', label: 'Más de 6 meses' },
    { id: 'ns', label: 'Todavía no lo sé' }
  ];
  return (
    <div className="min-h-screen bg-purple-50 px-6 pt-16">
      <button onClick={onBack} className="mb-6 text-gray-700 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Atrás
      </button>
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-6 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cuándo es tu examen?</h1>
      <p className="text-gray-500 mb-8">Así adaptamos el plan a tu ritmo</p>
      {options.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.label)}
          className="w-full bg-white rounded-2xl p-5 mb-3 border-2 border-gray-100 hover:border-purple-600 text-left transition-all"
        >
          <p className="font-medium text-gray-800">{f.label}</p>
        </button>
      ))}
    </div>
  );
}

export default DateStep;
