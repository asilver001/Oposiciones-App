import React from 'react';
import { ChevronLeft, Brain, RotateCcw } from 'lucide-react';

export default function SessionHeader({
  currentIndex,
  total,
  progress,
  isReview = false,
  onExitClick
}) {
  return (
    <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onExitClick}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" style={{ color: '#2D6A4F' }} />
          <span className="font-semibold text-gray-800">
            {currentIndex + 1} / {total}
          </span>
          {isReview && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' }}>
              <RotateCcw className="w-3 h-3 inline mr-1" />
              Repaso
            </span>
          )}
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F3F0' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2D6A4F, #52B788)' }}
        />
      </div>
    </div>
  );
}
