import React from 'react';
import { motion } from 'framer-motion';

/**
 * EmptyState - Reusable empty state component for improved UX
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Descriptive text
 * @param {string} props.actionLabel - CTA button text (optional)
 * @param {Function} props.onAction - CTA button handler (optional)
 * @param {string} props.variant - Color variant: 'purple' | 'blue' | 'green' | 'gray' (default: 'purple')
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'purple'
}) {
  // Color variants matching OpositaSmart's purple theme
  const variants = {
    purple: {
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand-500',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-500',
      buttonBg: 'bg-brand-600',
      buttonHover: 'hover:bg-brand-700',
      buttonText: 'text-white'
    },
    blue: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-500',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      buttonText: 'text-white'
    },
    green: {
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-500',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      buttonText: 'text-white'
    },
    gray: {
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-500',
      buttonBg: 'bg-gray-800',
      buttonHover: 'hover:bg-gray-900',
      buttonText: 'text-white'
    }
  };

  const colors = variants[variant] || variants.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4`}
        >
          <Icon className={`w-8 h-8 ${colors.iconColor}`} />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`text-xl font-bold ${colors.titleColor} mb-2`}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={`${colors.descColor} mb-6 max-w-sm text-sm leading-relaxed`}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          onClick={onAction}
          className={`${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
