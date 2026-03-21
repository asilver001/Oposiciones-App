import { LogIn, CheckCircle2, Brain, Clock, BookOpen } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: BookOpen,
    text: 'Mas de 1.000 preguntas con explicacion detallada',
  },
  {
    icon: Brain,
    text: 'Repeticion espaciada: estudia lo que necesitas repasar',
  },
  {
    icon: Clock,
    text: 'A tu ritmo, unos minutos al dia. Sin agobios',
  },
];

/**
 * WelcomeScreen - Landing page with value proposition.
 *
 * Mobile:  Vertical stack, centered
 * Desktop: Split layout — left info/CTA, right preview mockup
 */
function WelcomeScreen({ onStart, onLogin, onSkipAll }) {
  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* Left column: Info + CTAs */}
        <div className="flex-1 text-center lg:text-left max-w-md mx-auto lg:mx-0">
          {/* Logo */}
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-sm">
            <span className="text-4xl">🎓</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Oposita Smart
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            Prepara tu oposicion de{' '}
            <span className="text-gray-800 font-semibold">
              Auxiliar Administrativo del Estado
            </span>
          </p>

          {/* Value props */}
          <ul className="space-y-3 mb-8 text-left">
            {VALUE_PROPS.map((prop, i) => (
              <li key={i} className="flex items-start gap-3">
                <prop.icon className="w-5 h-5 text-gray-900 mt-0.5 shrink-0 stroke-[1.5]" />
                <span className="text-gray-600 text-[15px]">{prop.text}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <button
            onClick={onStart}
            className="w-full lg:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-sm transition-all active:scale-[0.98] mb-3"
          >
            Probar gratis
          </button>

          {onLogin && (
            <button
              onClick={onLogin}
              className="w-full lg:w-auto bg-white hover:bg-gray-50 text-gray-600 font-semibold py-3.5 px-8 rounded-2xl border border-gray-200 transition-all active:scale-[0.98] flex items-center justify-center lg:inline-flex gap-2"
            >
              <LogIn className="w-5 h-5" />
              Ya tengo cuenta
            </button>
          )}

          {onSkipAll && (
            <button
              onClick={onSkipAll}
              className="w-full lg:w-auto text-gray-400 hover:text-gray-500 text-sm py-2 transition-all mt-1"
            >
              Skip todo →
            </button>
          )}
        </div>

        {/* Right column: App preview mockup (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="w-[320px] rounded-3xl border border-gray-200 bg-gray-50 shadow-lg overflow-hidden">
            {/* Mock phone frame */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">13%</span>
              <span className="text-sm font-semibold text-gray-900">Oposita Smart</span>
              <span className="text-xs text-gray-400">⚙</span>
            </div>

            {/* Mock content */}
            <div className="p-5 space-y-4">
              {/* Mock question card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Tema 4 · Constitucion</p>
                <p className="text-sm font-medium text-gray-800 mb-3">
                  ¿Cuantos magistrados componen el Tribunal Constitucional?
                </p>
                <div className="space-y-2">
                  {['8 magistrados', '10 magistrados', '12 magistrados', '15 magistrados'].map((opt, i) => (
                    <div
                      key={i}
                      className={`text-xs px-3 py-2 rounded-lg border ${
                        i === 1
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}) {opt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock stats */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-lg font-bold text-gray-900">102</p>
                  <p className="text-[10px] text-gray-400">Preguntas</p>
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-lg font-bold text-gray-900">78%</p>
                  <p className="text-[10px] text-gray-400">Precision</p>
                </div>
              </div>
            </div>

            {/* Mock bottom nav */}
            <div className="bg-white px-6 py-2 border-t border-gray-100 flex justify-around">
              {['Inicio', 'Actividad', 'Temas', 'Recursos'].map((tab, i) => (
                <span
                  key={tab}
                  className={`text-[9px] ${i === 0 ? 'text-gray-900 font-bold' : 'text-gray-300'}`}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
