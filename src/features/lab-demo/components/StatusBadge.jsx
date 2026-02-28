import React from 'react';
import { orderStatuses, getStatusIndex } from '../data/orders';

/**
 * Status Badge Component
 * Displays order status with color-coded badge
 */

export default function StatusBadge({ status, size = 'normal', showDot = true }) {
  const statusInfo = orderStatuses.find(s => s.id === status);

  if (!statusInfo) return null;

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    normal: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        ${statusInfo.bgLight}
        ${statusInfo.textColor}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`}></span>
      )}
      {statusInfo.label}
    </span>
  );
}

/**
 * Status Pipeline Component
 * Visual horizontal stepper showing order progress through workflow
 */

export function StatusPipeline({ currentStatus, compact = false }) {
  const currentIndex = getStatusIndex(currentStatus);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {orderStatuses.map((status, idx) => (
          <div
            key={status.id}
            className={`
              h-1.5 rounded-full flex-1 transition-all duration-300
              ${idx <= currentIndex ? status.color : 'bg-slate-200'}
            `}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {orderStatuses.map((status, idx) => (
          <div key={status.id} className="flex flex-col items-center flex-1">
            {/* Connector line */}
            {idx > 0 && (
              <div
                className={`
                  absolute h-0.5 w-full -translate-y-1/2 -left-1/2
                  ${idx <= currentIndex ? 'bg-emerald-500' : 'bg-slate-200'}
                `}
              />
            )}

            {/* Status dot */}
            <div
              className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300 border-2
                ${idx < currentIndex
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : idx === currentIndex
                    ? `${status.color} border-transparent text-white`
                    : 'bg-white border-slate-200 text-slate-400'
                }
              `}
            >
              {idx < currentIndex ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{idx + 1}</span>
              )}
            </div>

            {/* Status label */}
            <span
              className={`
                mt-2 text-xs font-medium text-center
                ${idx <= currentIndex ? 'text-slate-700' : 'text-slate-400'}
              `}
            >
              {status.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar underneath */}
      <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / orderStatuses.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Mini status indicator for tables
 */
export function StatusDot({ status }) {
  const statusInfo = orderStatuses.find(s => s.id === status);
  if (!statusInfo) return null;

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${statusInfo.color}`}
      title={statusInfo.label}
    />
  );
}
