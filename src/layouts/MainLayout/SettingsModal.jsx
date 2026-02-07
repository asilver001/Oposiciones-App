/**
 * SettingsModal - Slide-in settings panel
 * Extracted from OpositaApp.jsx and adapted for React Router navigation.
 */

import { motion } from 'framer-motion';
import {
  ArrowLeft, Settings, Bell, Calendar, User, Crown, Mail,
  LogOut, Shield, FileText, ChevronRight, Lock, ExternalLink,
  Code, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
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
  const { user, isAuthenticated, signOut, isAdmin: authIsAdmin, isReviewer: authIsReviewer } = useAuth();
  const { isAdmin, isReviewer } = useAdmin();

  const isUserAdmin = isAdmin || authIsAdmin;
  const isUserReviewer = isReviewer || authIsReviewer;

  const handleNavigate = (route) => {
    onClose();
    navigate(route);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate(ROUTES.WELCOME);
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
      />

      {/* Sliding Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-10">
          <div className="flex items-center h-14 px-4">
            <button
              onClick={onClose}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
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
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <SettingsRow icon={Bell} label="Notificaciones" onClick={() => {}} rightText="Proximamente" locked />
            <SettingsRow icon={Calendar} label="Meta diaria" onClick={() => {}} rightText="10 preguntas" locked />
          </div>

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
