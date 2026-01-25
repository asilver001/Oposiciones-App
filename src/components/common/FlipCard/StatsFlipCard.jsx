import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const spring = { snappy: { type: "spring", stiffness: 400, damping: 25 } };

const colorSchemes = {
  amber: {
    gradient: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100'
  },
  purple: {
    gradient: 'from-purple-400 to-indigo-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100'
  },
  emerald: {
    gradient: 'from-emerald-400 to-teal-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100'
  }
};

export default function StatsFlipCard({
  icon: Icon,
  value,
  label,
  detail,
  badge,
  colorScheme = 'purple',
  onClick,
  delay = 0
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = colorSchemes[colorScheme] || colorSchemes.purple;

  return (
    <motion.div
      className="relative h-[120px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => {
        setIsFlipped(!isFlipped);
        onClick?.();
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={spring.snappy}
      >
        {/* Front - Gradient with big stat */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl p-4 flex flex-col shadow-lg`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-auto">
            {Icon && <Icon className="w-5 h-5 text-white/80" />}
            {badge && (
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
          <p className="text-xs text-white/80">{label}</p>
        </div>

        {/* Back - Light card with details */}
        <div
          className={`absolute inset-0 ${colors.bg} rounded-2xl p-4 border ${colors.border} shadow-sm flex flex-col`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`text-xs font-semibold ${colors.text} mb-2 uppercase tracking-wide`}>{label}</span>
          <p className="text-gray-700 text-sm flex-1 leading-relaxed">{detail}</p>
          <div className={`text-[10px] ${colors.text} flex items-center gap-1 mt-2 opacity-60`}>
            <RotateCcw className="w-3 h-3" />
            <span>Toca para volver</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
