import React from 'react';

/**
 * EmptyState — Editorial Calm design, dark-mode aware, variant colors
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.actionLabel - CTA button text (optional)
 * @param {Function} props.onAction - CTA button handler (optional)
 * @param {string} props.variant - 'green' | 'blue' | 'amber' | 'gray' (default: 'green')
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'green'
}) {
  const variants = {
    green: {
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-700 dark:text-green-400',
    },
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-700 dark:text-blue-400',
    },
    amber: {
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-700 dark:text-amber-400',
    },
    gray: {
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-500 dark:text-gray-400',
    },
    // Legacy aliases
    purple: {
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-700 dark:text-green-400',
    },
  };

  const colors = variants[variant] || variants.green;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
      {Icon && (
        <div className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4`}>
          <Icon className={`w-8 h-8 ${colors.iconColor}`} />
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
