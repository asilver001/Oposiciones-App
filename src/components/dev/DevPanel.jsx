import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function DevPanel({
  onReset,
  onShowPremium,
  onShowAdminLogin,
  onShowPlayground,
  onShowDraftFeatures,
  premiumMode,
  onTogglePremium,
  streakCount,
  testsCount
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, userRole, user } = useAuth();

  // 🔐 CRITICAL: Only render DevPanel if user is logged in as admin
  if (!isAdmin) {
    return null;
  }

  // Get admin email from user or userRole
  const adminEmail = userRole?.email || user?.email;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold"
        title={`Dev Mode - ${adminEmail}`}
      >
        DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-50 bg-gray-900/95 rounded-2xl p-4 shadow-2xl min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-white font-semibold text-sm">🛠️ Dev Tools</span>
          <div className="text-[9px] text-gray-400 mt-0.5">{adminEmail}</div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-lg">×</button>
      </div>
      <div className="space-y-2">
        <button onClick={onShowPlayground} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs py-2 px-3 rounded-lg text-left font-medium">
          ✨ Animation Playground
        </button>

        <button onClick={onShowDraftFeatures} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs py-2 px-3 rounded-lg text-left font-medium">
          🚧 Draft Features
        </button>
        <div className="border-t border-gray-700 my-2"></div>
        {/* Premium Mode Toggle */}
        <button
          onClick={onTogglePremium}
          className={`w-full text-xs py-2 px-3 rounded-lg text-left flex items-center justify-between ${
            premiumMode
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <span>👑 Modo Premium</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            premiumMode ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-400'
          }`}>
            {premiumMode ? 'ON' : 'OFF'}
          </span>
        </button>
        <button onClick={onReset} className="w-full bg-red-500/90 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          🗑️ Reset TODO
        </button>
        <button onClick={onShowPremium} className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-white text-xs py-2 px-3 rounded-lg text-left">
          👀 Ver Premium Modal
        </button>
        <div className="pt-2 border-t border-gray-700 text-[10px] text-gray-500">
          streak: {streakCount} · tests: {testsCount}
        </div>
      </div>
    </div>
  );
}
