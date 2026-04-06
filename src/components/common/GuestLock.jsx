import { Lock } from 'lucide-react';

/**
 * GuestLock — overlay shown on pages with limited guest access.
 * Renders children with a faded appearance + CTA to create account.
 */
export default function GuestLock({ children, message = 'Crea una cuenta para acceder a esta sección' }) {
  return (
    <div className="relative">
      {/* Faded content */}
      <div className="opacity-30 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6 py-8 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          <a
            href="#/signup"
            className="inline-block px-6 py-2.5 rounded-lg bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] active:scale-[0.97] transition-all"
          >
            Crear cuenta gratis
          </a>
          <p className="text-xs text-gray-400 mt-2">Sin tarjeta · Acceso fundador</p>
        </div>
      </div>
    </div>
  );
}
