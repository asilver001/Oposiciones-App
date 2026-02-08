/**
 * ExamTimer
 *
 * Countdown timer for exam simulation mode.
 * Shows remaining time with visual warnings.
 */

import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, Pause, Play } from 'lucide-react';

export default function ExamTimer({
  totalMinutes = 60,
  onTimeUp,
  onTick,
  isPaused = false,
  showPauseButton = false,
  onPauseToggle
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer effect
  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = prev - 1;

        // Notify parent of tick
        onTick?.(newValue);

        // Check warning thresholds
        if (newValue <= 300 && !isCritical) { // 5 minutes
          setIsCritical(true);
        } else if (newValue <= 600 && !isWarning) { // 10 minutes
          setIsWarning(true);
        }

        // Time's up
        if (newValue <= 0) {
          onTimeUp?.();
          return 0;
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds, isWarning, isCritical, onTimeUp, onTick]);

  // Calculate progress percentage
  const totalSeconds = totalMinutes * 60;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Determine color based on remaining time
  let colorClass = 'text-gray-700';
  let bgClass = 'bg-gray-100';
  let progressClass = 'bg-brand-500';

  if (isCritical) {
    colorClass = 'text-red-600';
    bgClass = 'bg-red-50 animate-pulse';
    progressClass = 'bg-red-500';
  } else if (isWarning) {
    colorClass = 'text-amber-600';
    bgClass = 'bg-amber-50';
    progressClass = 'bg-amber-500';
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${bgClass} transition-colors`}>
      {isCritical ? (
        <AlertTriangle className={`w-5 h-5 ${colorClass}`} />
      ) : (
        <Clock className={`w-5 h-5 ${colorClass}`} />
      )}

      <div className="flex flex-col">
        <span className={`font-mono text-lg font-bold ${colorClass}`}>
          {formatTime(remainingSeconds)}
        </span>

        {/* Progress bar */}
        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full ${progressClass} transition-all duration-1000`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {showPauseButton && (
        <button
          onClick={onPauseToggle}
          className={`p-1.5 rounded-lg ${isPaused ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'} hover:opacity-80`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/**
 * Compact timer for header display
 */
export function CompactTimer({ remainingSeconds, totalMinutes: _totalMinutes = 60 }) {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  const isCritical = remainingSeconds <= 300;
  const isWarning = remainingSeconds <= 600;

  let colorClass = 'text-gray-600';
  if (isCritical) colorClass = 'text-red-600 animate-pulse';
  else if (isWarning) colorClass = 'text-amber-600';

  return (
    <div className={`flex items-center gap-1.5 font-mono font-semibold ${colorClass}`}>
      <Clock className="w-4 h-4" />
      <span>{formatted}</span>
    </div>
  );
}
