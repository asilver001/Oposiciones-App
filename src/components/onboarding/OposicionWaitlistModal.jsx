import { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LAST_SUBMIT_KEY = 'waitlist-last-submit';
const THROTTLE_MS = 10_000; // 10s between submissions per browser

export default function OposicionWaitlistModal({ oposicion, onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Email no válido');
      return;
    }

    // Client-side throttle (prevents rapid resubmissions from same browser)
    const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0);
    if (Date.now() - lastSubmit < THROTTLE_MS) {
      setErrorMsg('Espera unos segundos antes de reintentar');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase
      .from('waitlist_oposiciones')
      .insert({ email: trimmed, oposicion });

    setLoading(false);

    if (error) {
      // 23505 = duplicate key (already in waitlist) — treat as success
      if (error.code === '23505') {
        setSent(true);
        return;
      }
      console.error('Waitlist insert failed:', error);
      setErrorMsg('No pudimos guardar tu email. Inténtalo de nuevo.');
      return;
    }

    localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Próximamente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">¡Te avisaremos!</p>
            <p className="text-gray-500 text-sm mt-1">Recibirás un email cuando {oposicion} esté disponible.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">
              <strong className="text-gray-800">{oposicion}</strong> estará disponible próximamente. ¿Quieres que te avisemos?
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                {loading ? 'Enviando...' : 'Avisarme cuando esté lista'}
              </button>
              {errorMsg && (
                <p className="text-red-600 text-xs text-center" role="alert">{errorMsg}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
