/**
 * SettingsModal - Slide-in settings panel
 * Extracted from OpositaApp.jsx and adapted for React Router navigation.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Settings, Bell, Calendar, User, Crown, Mail,
  LogOut, Shield, FileText, ChevronRight, Lock, ExternalLink,
  Code, Eye, Trash2, AlertTriangle, Loader2, Sun, Moon, Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../../router/paths';

function SettingsRow({ icon: Icon, label, onClick, rightText, locked, external }) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition ${locked ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightText && <span className="text-gray-400 text-sm">{rightText}</span>}
        {locked ? (
          <Lock className="w-4 h-4 text-gray-400" />
        ) : external ? (
          <ExternalLink className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 px-4 pt-6 pb-2">{children}</h3>
  );
}

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut, deleteAccount, isAdmin: authIsAdmin, isReviewer: authIsReviewer } = useAuth();
  const { isAdmin, isReviewer } = useAdmin();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const darkMode = useUserStore((s) => s.darkMode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);
  const userData = useUserStore((s) => s.userData);
  const setUserData = useUserStore((s) => s.setUserData);
  const [showGoalsConfig, setShowGoalsConfig] = useState(false);

  const isUserAdmin = isAdmin || authIsAdmin;
  const isUserReviewer = isReviewer || authIsReviewer;

  // Focus trap and Escape key handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNavigate = (route) => {
    onClose();
    navigate(route);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate(ROUTES.WELCOME);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') return;

    setDeleting(true);
    const { error } = await deleteAccount();
    setDeleting(false);

    if (!error) {
      onClose();
      navigate(ROUTES.WELCOME);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Panel */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ajustes"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700 z-10">
          <div className="flex items-center h-14 px-4">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar ajustes"
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-7 h-7 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
          </div>

          {/* Settings */}
          <SectionTitle>Ajustes</SectionTitle>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
            {/* Dark mode toggle */}
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3 mb-2">
                {darkMode === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : darkMode === 'light' ? (
                  <Sun className="w-5 h-5 text-gray-500" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-gray-700 dark:text-gray-300">Apariencia</span>
              </div>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'light', label: 'Claro', icon: Sun },
                  { id: 'system', label: 'Sistema', icon: Monitor },
                  { id: 'dark', label: 'Oscuro', icon: Moon },
                ].map(({ id, label, icon: ModeIcon }) => (
                  <button
                    key={id}
                    onClick={() => setDarkMode(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                      darkMode === id
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <ModeIcon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <SettingsRow icon={Bell} label="Notificaciones" onClick={() => {}} rightText="Proximamente" locked />
            <SettingsRow
              icon={Calendar}
              label="Metas de estudio"
              onClick={() => setShowGoalsConfig(!showGoalsConfig)}
              rightText={`${userData.weeklyGoalQuestions || 75}/sem`}
            />
          </div>

          {/* Goals Configuration Panel */}
          {showGoalsConfig && (
            <div className="mt-3 bg-white rounded-xl border border-brand-200 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Configura tus metas</h4>

              {/* Daily goal */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Meta diaria (preguntas)</label>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map(val => (
                    <button
                      key={val}
                      onClick={() => setUserData({ dailyGoal: val })}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                        (userData.dailyGoal || 15) === val
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly goal */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Meta semanal (preguntas)</label>
                <div className="flex gap-2">
                  {[50, 75, 100, 150].map(val => (
                    <button
                      key={val}
                      onClick={() => setUserData({ weeklyGoalQuestions: val })}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                        (userData.weeklyGoalQuestions || 75) === val
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Sin presion. Estas metas son orientativas para ayudarte a mantener la constancia.
              </p>
            </div>
          )}

          {/* Profile */}
          <SectionTitle>Perfil</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={User} label="Editar perfil" onClick={() => {}} rightText={user?.user_metadata?.name || 'Sin nombre'} locked />
          </div>

          {/* Account */}
          <SectionTitle>Cuenta y suscripcion</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Crown} label="Plan Premium" onClick={() => {}} rightText="Proximamente" locked />
            <SettingsRow icon={Mail} label="Contacto" onClick={() => {}} rightText="Proximamente" locked />
            {isAuthenticated ? (
              <SettingsRow
                icon={LogOut}
                label="Cerrar sesion"
                onClick={handleSignOut}
              />
            ) : (
              <SettingsRow
                icon={User}
                label="Iniciar sesion"
                onClick={() => handleNavigate(ROUTES.LOGIN)}
              />
            )}
          </div>

          {/* Delete account - GDPR */}
          {isAuthenticated && (
            <>
              <SectionTitle>Zona de peligro</SectionTitle>
              <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-red-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <span className="text-red-600">Eliminar mi cuenta</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </button>
                ) : (
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Esta accion es irreversible</p>
                        <p className="mt-1">Se eliminaran todos tus datos: progreso, historial, estadisticas y tu cuenta.</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Escribe <span className="font-mono font-bold">ELIMINAR</span> para confirmar:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="ELIMINAR"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                        className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'ELIMINAR' || deleting}
                        className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          'Eliminar cuenta'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Admin section */}
          {(isUserAdmin || isUserReviewer) && (
            <>
              <SectionTitle>Administracion</SectionTitle>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {isUserAdmin && (
                  <SettingsRow
                    icon={Shield}
                    label="Panel de Administrador"
                    onClick={() => handleNavigate(ROUTES.ADMIN)}
                    rightText="Admin"
                  />
                )}
                <SettingsRow
                  icon={Eye}
                  label="Panel de Revisor"
                  onClick={() => handleNavigate(ROUTES.REVIEWER)}
                  rightText={isUserAdmin ? 'Admin' : 'Revisor'}
                />
              </div>
            </>
          )}

          {/* Legal */}
          <SectionTitle>Otros</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Shield} label="Politica de privacidad" onClick={() => handleNavigate(ROUTES.PRIVACY)} />
            <SettingsRow icon={FileText} label="Terminos de servicio" onClick={() => handleNavigate(ROUTES.TERMS)} />
          </div>

          {/* App info */}
          <div className="text-center pt-8 pb-4">
            <p className="text-gray-900 font-medium">Oposita Smart</p>
            <p className="text-gray-500 text-sm mt-1">La forma inteligente de opositar</p>
            <p className="text-gray-400 text-xs mt-3">Version 1.0.0</p>
            {user?.email && (
              <p className="text-gray-400 text-xs mt-1">{user.email}</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
