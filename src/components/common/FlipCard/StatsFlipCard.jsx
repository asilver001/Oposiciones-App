import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const spring = { snappy: { type: "spring", stiffness: 400, damping: 25 } };

/**
 * AnimatedCounter - Anima el valor numerico cuando aparece
 * Importado de DraftFeatures/AnimationPlayground
 */
function AnimatedCounter({ value, duration = 0.8, suffix = "", className = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = numericValue;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [numericValue, duration, isNumeric, value]);

  if (!isNumeric) {
    return <span className={className}>{value}</span>;
  }

  return (
    <motion.span className={className} key={value}>
      {displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Propuesta 2 style: Pastel front, solid back
const colorSchemes = {
  amber: {
    gradientFront: 'from-amber-100 to-orange-100',  // Pastel suave
    bgBack: 'bg-amber-500',                          // Sólido vibrante
    textFront: 'text-amber-700',
    textBack: 'text-white',
    border: 'border-amber-200',
    iconFront: 'text-amber-500',
    iconBack: 'text-white/80'
  },
  purple: {
    gradientFront: 'from-purple-100 to-violet-100',
    bgBack: 'bg-purple-600',
    textFront: 'text-purple-700',
    textBack: 'text-white',
    border: 'border-purple-200',
    iconFront: 'text-purple-500',
    iconBack: 'text-white/80'
  },
  emerald: {
    gradientFront: 'from-emerald-100 to-teal-100',
    bgBack: 'bg-emerald-500',
    textFront: 'text-emerald-700',
    textBack: 'text-white',
    border: 'border-emerald-200',
    iconFront: 'text-emerald-500',
    iconBack: 'text-white/80'
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
  delay = 0,
  animateValue = true
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const colors = colorSchemes[colorScheme] || colorSchemes.purple;

  // Parse value to extract number and suffix (e.g., "87%" -> 87, "%")
  const parseValue = (val) => {
    if (typeof val === 'number') return { num: val, suffix: '' };
    const match = String(val).match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      return { num: parseFloat(match[1]), suffix: match[2] };
    }
    return { num: null, suffix: val };
  };

  const { num: numericValue, suffix } = parseValue(value);

  // Trigger animation after delay
  useEffect(() => {
    if (animateValue && numericValue !== null) {
      const timer = setTimeout(() => setHasAnimated(true), delay * 1000 + 100);
      return () => clearTimeout(timer);
    }
  }, [animateValue, numericValue, delay]);

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
        {/* Front - Pastel card with stat (Propuesta 2 style) */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFront} rounded-2xl p-4 flex flex-col border ${colors.border} shadow-sm`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-auto">
            {Icon && <Icon className={`w-5 h-5 ${colors.iconFront}`} />}
            {badge && (
              <span className={`text-[10px] ${colors.bgBack} text-white px-2 py-0.5 rounded-full font-medium`}>
                {badge}
              </span>
            )}
          </div>
          <p className={`text-3xl font-bold ${colors.textFront} mb-0.5`}>
            {animateValue && numericValue !== null && hasAnimated ? (
              <AnimatedCounter value={numericValue} suffix={suffix} duration={0.8} />
            ) : (
              value
            )}
          </p>
          <p className={`text-xs ${colors.textFront} opacity-70`}>{label}</p>
        </div>

        {/* Back - Solid color with details (Propuesta 2 style) */}
        <div
          className={`absolute inset-0 ${colors.bgBack} rounded-2xl p-4 shadow-lg flex flex-col`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`text-xs font-semibold ${colors.textBack} mb-2 uppercase tracking-wide opacity-80`}>{label}</span>
          <p className={`${colors.textBack} text-sm flex-1 leading-relaxed`}>{detail}</p>
          <div className={`text-[10px] ${colors.textBack} flex items-center gap-1 mt-2 opacity-60`}>
            <RotateCcw className="w-3 h-3" />
            <span>Toca para volver</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
