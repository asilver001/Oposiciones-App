/**
 * TopBar Component - Oposita Smart
 *
 * Top navigation bar with SVG circular progress indicator.
 * Clean, minimal design following the Soft+Fort aesthetic.
 */

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const spring = {
  smooth: { type: "spring", stiffness: 50, damping: 15 },
};

/**
 * TopBar - Navigation bar with daily progress circle
 *
 * @param {Object} props
 * @param {number} props.dailyProgress - Current daily progress (0-100)
 * @param {number} props.dailyGoal - Daily goal target (for display)
 * @param {string} props.userName - User's name (for avatar initial)
 * @param {Function} props.onSettingsClick - Callback when settings clicked
 * @param {Function} props.onProgressClick - Callback when progress circle clicked
 */
export default function TopBar({
  dailyProgress = 0,
  dailyGoal = 100,
  // userName kept for future avatar feature
  // eslint-disable-next-line no-unused-vars
  userName = 'Usuario',
  onSettingsClick,
  onProgressClick
}) {
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.max(0, (dailyProgress / dailyGoal) * 100));

  // SVG circle calculations
  const radius = 14;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(progressPercent / 100) * circumference} ${circumference}`;

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-100 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring.smooth}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left - Progress circle button */}
        <motion.button
          onClick={onProgressClick}
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 active:scale-95 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Progreso diario: ${Math.round(progressPercent)}%`}
        >
          <svg className="w-9 h-9 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#F3E8FF"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <motion.circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-purple-600">
            {Math.round(progressPercent)}
          </span>
        </motion.button>

        {/* Center - Title */}
        <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight">
          Oposita Smart
        </h1>

        {/* Right - Settings */}
        <motion.button
          onClick={onSettingsClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Configuracion"
        >
          <Settings className="w-[18px] h-[18px] text-gray-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}
