/**
 * TopBar Component - Oposita Smart
 *
 * Top navigation bar with linear progress bar indicator.
 * Clean, minimal design - HomeMinimal shell redesign Phase 1.
 */

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

/**
 * TopBar - Navigation bar with daily progress linear bar
 *
 * @param {Object} props
 * @param {number} props.dailyProgress - Current daily progress (0-100)
 * @param {number} props.dailyGoal - Daily goal target (for display)
 * @param {string} props.userName - User's name (for avatar initial)
 * @param {Function} props.onSettingsClick - Callback when settings clicked
 * @param {Function} props.onProgressClick - Callback when progress area clicked
 * @param {string} props.title - Page title to display in center
 */
export default function TopBar({
  dailyProgress = 0,
  dailyGoal = 100,
  // userName kept for future avatar feature
  // eslint-disable-next-line no-unused-vars
  userName = 'Usuario',
  onSettingsClick,
  onProgressClick,
  title = 'Oposita Smart',
}) {
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.max(0, (dailyProgress / dailyGoal) * 100));

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Main flex row */}
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left - Progress click area */}
        <motion.button
          onClick={onProgressClick}
          className="w-12 h-12 flex items-center justify-center rounded-full"
          whileTap={{ scale: 0.99 }}
          aria-label={`Progreso diario: ${Math.round(progressPercent)}%`}
        >
          <span className="text-[13px] font-semibold text-gray-500">
            {Math.round(progressPercent)}%
          </span>
        </motion.button>

        {/* Center - Title */}
        <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>

        {/* Right - Settings */}
        <motion.button
          onClick={onSettingsClick}
          className="w-12 h-12 flex items-center justify-center rounded-full"
          whileTap={{ scale: 0.99 }}
          aria-label="Configuracion"
        >
          <Settings className="w-[18px] h-[18px] text-gray-500" />
        </motion.button>
      </div>

      {/* Linear progress bar */}
      <div className="h-0.5 bg-gray-100">
        <motion.div
          className="h-full bg-gray-900"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
