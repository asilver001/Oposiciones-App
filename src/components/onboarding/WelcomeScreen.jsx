import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';

function WelcomeScreen({ onStart, onLogin }) {
  const [float, setFloat] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFloat(f => f === 0 ? -10 : 0), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <div
          className="w-24 h-24 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm transition-transform duration-1000"
          style={{ transform: `translateY(${float}px)` }}
        >
          <span className="text-5xl">🎓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oposita Smart</h1>
        <p className="text-xl text-brand-600 font-semibold mb-2">Tu plaza, paso a paso</p>
        <p className="text-gray-500 mb-8">Unos minutos al día, a tu ritmo. Sin agobios.</p>

        {/* Botón principal: Empezar */}
        <button
          onClick={onStart}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-sm transition-all active:scale-[0.98] mb-4"
        >
          Empezar
        </button>

        {/* Botón secundario: Iniciar sesión */}
        {onLogin && (
          <button
            onClick={onLogin}
            className="w-full bg-white hover:bg-gray-50 text-brand-600 font-semibold py-4 px-8 rounded-2xl border-2 border-brand-200 hover:border-brand-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Ya tengo cuenta
          </button>
        )}
      </div>
    </div>
  );
}

export default WelcomeScreen;
