import React, { useState } from 'react';

// Simulamos Framer Motion con CSS transitions para este demo
const MotionDiv = ({ children, className, style, onClick, animate: _animate, whileHover: _whileHover, whileTap: _whileTap }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  
  return (
    <div
      className={className}
      style={{
        ...style,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isTapped ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsTapped(false); }}
      onMouseDown={() => setIsTapped(true)}
      onMouseUp={() => setIsTapped(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default function AnimationCatalog() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(65);
  const [streak, setStreak] = useState(7);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');

  const tabs = [
    { id: 'buttons', label: '🔘 Botones', icon: '👆' },
    { id: 'quiz', label: '📝 Quiz', icon: '✏️' },
    { id: 'progress', label: '📊 Progreso', icon: '📈' },
    { id: 'feedback', label: '✨ Feedback', icon: '🎉' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          🎨 Catálogo de Animaciones
        </h1>
        <p className="text-slate-600">OpositaSmart · Estilo Tiimo</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* ===================== BOTONES ===================== */}
        {activeTab === 'buttons' && (
          <div className="space-y-6">
            <Card title="Botón Primario" description="Efecto: Scale down al presionar + sombra al hover">
              <MotionDiv className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer transition-all duration-200 active:scale-95">
                Comenzar Quiz
              </MotionDiv>
              <CodeHint code="whileTap={{ scale: 0.97 }}" />
            </Card>

            <Card title="Botón Secundario" description="Más sutil, para acciones secundarias">
              <MotionDiv className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all duration-200 active:scale-95">
                Ver Resultados
              </MotionDiv>
            </Card>

            <Card title="Botón de Acción Rápida" description="Para navegación o acciones frecuentes">
              <div className="flex gap-3">
                <MotionDiv className="p-4 bg-emerald-100 text-emerald-600 rounded-xl cursor-pointer hover:bg-emerald-200 transition-all duration-200 active:scale-90">
                  <span className="text-2xl">✓</span>
                </MotionDiv>
                <MotionDiv className="p-4 bg-amber-100 text-amber-600 rounded-xl cursor-pointer hover:bg-amber-200 transition-all duration-200 active:scale-90">
                  <span className="text-2xl">→</span>
                </MotionDiv>
                <MotionDiv className="p-4 bg-rose-100 text-rose-600 rounded-xl cursor-pointer hover:bg-rose-200 transition-all duration-200 active:scale-90">
                  <span className="text-2xl">↺</span>
                </MotionDiv>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== QUIZ ===================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <Card title="Selección de Respuesta" description="Haz clic para seleccionar una opción">
              <div className="space-y-3 w-full">
                {[
                  'A) El Rey, a propuesta del Gobierno',
                  'B) El Presidente del Gobierno',
                  'C) Las Cortes Generales',
                  'D) El Consejo de Ministros'
                ].map((answer, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === i
                        ? 'bg-blue-50 border-blue-400 scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={selectedAnswer === i ? 'text-blue-700 font-medium' : 'text-slate-700'}>
                      {answer}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Timer de Quiz" description="Animación de countdown">
              <div className="flex items-center gap-4 bg-slate-100 px-6 py-4 rounded-xl">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" className="fill-none stroke-slate-200 stroke-[4]" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      className="fill-none stroke-blue-500 stroke-[4]"
                      strokeDasharray="176"
                      strokeDashoffset="44"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-slate-700">
                    45s
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Pregunta 5 de 10</p>
                  <p className="text-sm text-slate-500">Tema 7: Organización del Estado</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== PROGRESO ===================== */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <Card title="Barra de Progreso" description="Animación spring al cambiar valor">
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Tema 7 - Progreso</span>
                  <span className="text-sm font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-4 justify-center">
                  {[25, 50, 75, 100].map(p => (
                    <button
                      key={p}
                      onClick={() => setProgress(p)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        progress === p ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
              <CodeHint code="transition: {{ type: 'spring', stiffness: 100 }}" />
            </Card>

            <Card title="Sistema Fortaleza (6 Bloques)" description="Tu visualización de dominio por tema">
              <div className="flex gap-3 justify-center">
                {[
                  { filled: 100, color: 'emerald', label: 'Dominado' },
                  { filled: 100, color: 'emerald', label: 'Dominado' },
                  { filled: 70, color: 'violet', label: 'Avanzando' },
                  { filled: 40, color: 'violet', label: 'Progreso' },
                  { filled: 20, color: 'amber', label: 'En riesgo', pulse: true },
                  { filled: 0, color: 'slate', label: 'Por hacer' },
                ].map((block, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300
                        ${block.filled === 100 ? 'bg-emerald-100 border-emerald-500' : ''}
                        ${block.filled > 0 && block.filled < 100 ? 'bg-violet-100 border-violet-400' : ''}
                        ${block.pulse ? 'bg-amber-100 border-amber-400 animate-pulse' : ''}
                        ${block.filled === 0 ? 'bg-slate-100 border-slate-300' : ''}
                      `}
                    >
                      {block.filled === 100 && <span className="text-emerald-600 font-bold">✓</span>}
                      {block.filled > 0 && block.filled < 100 && (
                        <span className="text-xs font-bold text-violet-600">{block.filled}%</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{block.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Racha de Estudio" description="Animación al incrementar">
              <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border border-orange-200">
                <span className="text-4xl animate-bounce">🔥</span>
                <div>
                  <span className="text-3xl font-bold text-orange-600 block">{streak} días</span>
                  <span className="text-orange-700/70 text-sm">Racha de estudio</span>
                </div>
                <button
                  onClick={() => setStreak(s => s + 1)}
                  className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 active:scale-95 transition-all"
                >
                  +1
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== FEEDBACK ===================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <Card title="Respuesta Correcta" description="Flash verde + icono animado">
              <button
                onClick={() => setIsCorrect(true)}
                className={`p-6 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 ${
                  isCorrect === true
                    ? 'bg-emerald-50 border-emerald-400 scale-105'
                    : 'bg-white border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                  isCorrect === true ? 'bg-emerald-500 scale-110' : 'bg-emerald-400'
                }`}>
                  ✓
                </div>
                <span className="font-medium text-emerald-700">¡Correcto!</span>
              </button>
            </Card>

            <Card title="Respuesta Incorrecta" description="Shake suave + color ámbar (NO rojo)">
              <button
                onClick={() => {
                  setIsCorrect(false);
                  setTimeout(() => setIsCorrect(null), 500);
                }}
                className={`p-6 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 ${
                  isCorrect === false
                    ? 'bg-amber-50 border-amber-400 animate-shake'
                    : 'bg-white border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white">
                  ✗
                </div>
                <span className="font-medium text-amber-700">Revisar respuesta</span>
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                💡 Usamos ámbar en vez de rojo para reducir ansiedad (principio de Tiimo)
              </p>
            </Card>

            <Card title="Celebración al Completar" description="Para logros importantes">
              {!showCelebration ? (
                <button
                  onClick={() => setShowCelebration(true)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95"
                >
                  🎉 Ver Celebración
                </button>
              ) : (
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 animate-fadeIn">
                  <div className="text-5xl mb-3 animate-bounce">🎉</div>
                  <h3 className="text-xl font-bold text-emerald-700">¡Excelente trabajo!</h3>
                  <p className="text-emerald-600 mt-1">Has completado el Tema 7</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">90% de aciertos</p>
                  <button
                    onClick={() => setShowCelebration(false)}
                    className="mt-4 text-sm text-emerald-600 underline"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </Card>

            <Card title="Loading Skeleton" description="Mientras cargan los datos">
              <div className="space-y-3 w-full">
                <div className="h-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
                <div className="h-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* Footer con instrucciones */}
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-slate-800 text-white rounded-2xl">
        <h2 className="text-lg font-bold mb-3">📦 Para implementar estas animaciones:</h2>
        <code className="block bg-slate-900 p-3 rounded-xl text-sm text-green-400 mb-4">
          npm install framer-motion
        </code>
        <div className="text-sm text-slate-300 space-y-1">
          <p>• <strong>Framer Motion</strong> → 90% de las animaciones (botones, transiciones, feedback)</p>
          <p>• <strong>Lottie</strong> → Solo para celebraciones complejas (confetti)</p>
          <p>• <strong>CSS Tailwind</strong> → Para animaciones simples (pulse, bounce, fade)</p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <div className="flex flex-col items-center gap-3">
        {children}
      </div>
    </div>
  );
}

function CodeHint({ code }) {
  return (
    <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg">
      <code className="text-xs text-slate-600">{code}</code>
    </div>
  );
}
