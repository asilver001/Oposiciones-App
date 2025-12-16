/**
 * FSRS (Free Spaced Repetition Scheduler) - Simplified Implementation
 *
 * Based on the SM-2 algorithm with modifications for simplicity.
 *
 * States:
 * - NEW: Never seen
 * - LEARNING: Seen 1-2 times
 * - REVIEW: Scheduled for today (mastered but needs review)
 * - MASTERED: Next review > 30 days away
 */

// Default parameters
const DEFAULT_PARAMS = {
  // Initial intervals (in days)
  learningSteps: [1, 3], // Days for learning phase
  graduationInterval: 7, // Days after graduating from learning

  // Interval modifiers
  easyBonus: 1.3,
  intervalModifier: 1.0,

  // Minimum/maximum intervals
  minInterval: 1,
  maxInterval: 365,

  // Ease factor parameters
  startingEase: 2.5,
  minEase: 1.3,
  easeDecrement: 0.2,
  easeIncrement: 0.15
};

/**
 * Question states enum
 */
export const QuestionState = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  MASTERED: 'mastered'
};

/**
 * Calculate the state of a question based on progress data
 * @param {Object} progress - User's progress for this question
 * @returns {string} QuestionState
 */
export function calculateState(progress) {
  if (!progress || progress.times_seen === 0) {
    return QuestionState.NEW;
  }

  if (progress.times_seen <= 2 && progress.interval <= 3) {
    return QuestionState.LEARNING;
  }

  if (progress.interval > 30) {
    return QuestionState.MASTERED;
  }

  return QuestionState.REVIEW;
}

/**
 * Determine if a question is due for review
 * @param {Object} progress - User's progress for this question
 * @returns {boolean}
 */
export function isDue(progress) {
  if (!progress || !progress.next_review) {
    return true; // New questions are always "due"
  }

  const now = new Date();
  const nextReview = new Date(progress.next_review);
  return nextReview <= now;
}

/**
 * Calculate next review date and interval after answering
 * @param {Object} progress - Current progress data
 * @param {boolean} wasCorrect - Whether the answer was correct
 * @param {Object} params - Optional FSRS parameters
 * @returns {Object} { nextReview: Date, interval: number, ease: number }
 */
export function calculateNextReview(progress, wasCorrect, params = DEFAULT_PARAMS) {
  const now = new Date();

  // Initialize values from progress or defaults
  let interval = progress?.interval || 0;
  let ease = progress?.ease_factor || params.startingEase;
  const timesSeen = (progress?.times_seen || 0) + 1;

  if (wasCorrect) {
    if (interval === 0) {
      // First time seeing - start learning phase
      interval = params.learningSteps[0];
    } else if (interval <= params.learningSteps[0]) {
      // Second step of learning
      interval = params.learningSteps[1] || params.graduationInterval;
    } else if (interval <= params.learningSteps[1]) {
      // Graduate from learning
      interval = params.graduationInterval;
    } else {
      // Review phase - apply spaced repetition
      interval = Math.round(interval * ease * params.intervalModifier);
      // Increase ease for correct answers
      ease = Math.min(ease + params.easeIncrement, 3.0);
    }
  } else {
    // Wrong answer - reduce interval significantly
    interval = Math.max(params.minInterval, Math.round(interval * 0.5));
    // Decrease ease for wrong answers
    ease = Math.max(ease - params.easeDecrement, params.minEase);
  }

  // Clamp interval
  interval = Math.max(params.minInterval, Math.min(interval, params.maxInterval));

  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    nextReview,
    interval,
    ease,
    state: calculateStateFromInterval(interval, timesSeen)
  };
}

/**
 * Determine state from interval and times seen
 */
function calculateStateFromInterval(interval, timesSeen) {
  if (timesSeen <= 2 && interval <= 3) {
    return QuestionState.LEARNING;
  }
  if (interval > 30) {
    return QuestionState.MASTERED;
  }
  return QuestionState.REVIEW;
}

/**
 * Get questions that are due for review today
 * @param {Array} progressList - Array of progress objects with next_review
 * @returns {Array} Filtered and sorted by priority
 */
export function getDueQuestions(progressList) {
  const now = new Date();

  return progressList
    .filter(p => {
      if (!p.next_review) return false;
      const nextReview = new Date(p.next_review);
      return nextReview <= now;
    })
    .sort((a, b) => {
      // Sort by overdue priority (most overdue first)
      const aDate = new Date(a.next_review);
      const bDate = new Date(b.next_review);
      return aDate.getTime() - bDate.getTime();
    });
}

/**
 * Calculate study streak from history
 * @param {Array} history - Array of { date: string, correct: number, total: number }
 * @returns {number} Current streak in days
 */
export function calculateStreak(history) {
  if (!history || history.length === 0) return 0;

  // Sort by date descending
  const sorted = [...history].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let expectedDate = new Date(today);

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    // Check if this entry is for the expected date
    if (entryDate.getTime() === expectedDate.getTime()) {
      if (entry.total > 0) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    } else if (entryDate.getTime() < expectedDate.getTime()) {
      // Missed a day
      break;
    }
  }

  return streak;
}

/**
 * Calculate retention rate from progress data
 * @param {Array} progressList - Array of progress objects
 * @returns {number} Retention rate 0-100
 */
export function calculateRetention(progressList) {
  if (!progressList || progressList.length === 0) return 0;

  const reviewed = progressList.filter(p => p.times_seen > 0);
  if (reviewed.length === 0) return 0;

  const totalCorrect = reviewed.reduce((sum, p) => sum + (p.times_correct || 0), 0);
  const totalSeen = reviewed.reduce((sum, p) => sum + (p.times_seen || 0), 0);

  if (totalSeen === 0) return 0;

  return Math.round((totalCorrect / totalSeen) * 100);
}

/**
 * Generate priority score for a question
 * Higher score = higher priority for review
 * @param {Object} progress - Progress data
 * @returns {number} Priority score
 */
export function calculatePriority(progress) {
  if (!progress) return 100; // New questions have high priority

  const now = new Date();
  const nextReview = new Date(progress.next_review || now);

  // Days overdue (negative if not yet due)
  const daysOverdue = (now.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24);

  // Base priority from overdue status
  let priority = daysOverdue * 10;

  // Lower ease = higher priority (harder questions)
  const ease = progress.ease_factor || 2.5;
  priority += (3.0 - ease) * 5;

  // Questions in learning phase get boost
  if (progress.interval <= 3) {
    priority += 20;
  }

  return priority;
}

export default {
  QuestionState,
  calculateState,
  isDue,
  calculateNextReview,
  getDueQuestions,
  calculateStreak,
  calculateRetention,
  calculatePriority
};
