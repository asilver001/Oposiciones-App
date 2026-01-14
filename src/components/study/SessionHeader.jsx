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
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-800">
            {currentIndex + 1} / {total}
          </span>
          {isReview && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
              <RotateCcw className="w-3 h-3 inline mr-1" />
              Repaso
            </span>
          )}
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
