/**
 * FSRS-4.5 (Free Spaced Repetition Scheduler) Implementation
 *
 * Upgraded from SM-2 to FSRS-4.5 algorithm.
 * Uses stability and difficulty as core parameters with desired_retention target.
 *
 * States:
 * - NEW: Never seen
 * - LEARNING: Seen 1-2 times, short intervals
 * - REVIEW: Scheduled for review (graduated from learning)
 * - MASTERED: Next review > 30 days away
 *
 * Backward compatible: existing ease_factor is converted to difficulty.
 */

// FSRS-4.5 default parameters
const FSRS_PARAMS = {
  // Desired retention rate (0-1)
  desired_retention: 0.9,

  // Initial stability values by rating (days)
  // Rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  initial_stability: [0.4, 0.6, 2.4, 5.8],

  // Initial difficulty by rating (0-10 scale)
  initial_difficulty: [7.0, 6.0, 5.0, 3.0],

  // Learning steps (days) before graduating to review
  learningSteps: [1, 3],
  graduationInterval: 7,

  // Interval bounds
  minInterval: 1,
  maxInterval: 365
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
 * Convert legacy ease_factor (1.3-3.0) to FSRS difficulty (0-10)
 * Higher ease = lower difficulty
 */
function easeToDifficulty(ease) {
  // ease 1.3 -> difficulty 8.5, ease 2.5 -> difficulty 5.0, ease 3.0 -> difficulty 3.5
  return Math.max(0, Math.min(10, 11.75 - ease * 2.5));
}

/**
 * Convert FSRS difficulty (0-10) back to ease_factor (1.3-3.0) for backward compatibility
 */
function difficultyToEase(difficulty) {
  return Math.max(1.3, Math.min(3.0, (11.75 - difficulty) / 2.5));
}

/**
 * Calculate interval from stability using FSRS-4.5 formula
 * interval = stability * 9 * (1/desired_retention - 1)
 * This gives the number of days at which retrievability equals desired_retention
 */
function stabilityToInterval(stability, desiredRetention) {
  if (stability <= 0) return 1;
  return Math.round(stability * 9 * (1 / desiredRetention - 1));
}

/**
 * Get stability from an existing interval (inverse of stabilityToInterval)
 */
function intervalToStability(interval, desiredRetention) {
  if (interval <= 0) return 0.4;
  return interval / (9 * (1 / desiredRetention - 1));
}

/**
 * FSRS-4.5: Calculate new stability after a correct review
 * S' = S * (e^0.1 * (11-D) * S^(-0.2) * (e^(0.05*(1-R)) - 1))
 * where S=stability, D=difficulty, R=desired_retention
 */
function nextStabilityCorrect(stability, difficulty, desiredRetention) {
  const factor = Math.exp(0.1)
    * (11 - difficulty)
    * Math.pow(stability, -0.2)
    * (Math.exp(0.05 * (1 - desiredRetention)) - 1);
  // Ensure stability always increases on correct answer (minimum 1.1x multiplier)
  return stability * Math.max(1.1, factor);
}

/**
 * FSRS-4.5: Calculate new stability after an incorrect review (lapse)
 * S' = S * D^(-0.3)
 */
function nextStabilityIncorrect(stability, difficulty) {
  // On failure, stability decreases significantly
  // D^(-0.3) is < 1 for D > 1, meaning stability decreases
  const newStability = stability * Math.pow(Math.max(1, difficulty), -0.3);
  // Floor: don't go below 0.4 days
  return Math.max(0.4, newStability);
}

/**
 * FSRS-4.5: Update difficulty after a review
 * D' = D - 0.3 * (rating - 3)
 * where rating 3 = "correct/good", so correct answers decrease difficulty
 */
function nextDifficulty(difficulty, wasCorrect) {
  // Map boolean to rating: correct=3 (Good), incorrect=1 (Again)
  const rating = wasCorrect ? 3 : 1;
  const newDifficulty = difficulty - 0.3 * (rating - 3);
  // Clamp to [0, 10]
  return Math.max(0, Math.min(10, newDifficulty));
}

/**
 * Calculate next review date and interval after answering (FSRS-4.5)
 *
 * Backward compatible: reads ease_factor from progress and converts to difficulty/stability.
 * Returns { nextReview, interval, ease, state } matching the old API.
 *
 * @param {Object} progress - Current progress data
 * @param {boolean} wasCorrect - Whether the answer was correct
 * @param {Object} params - Optional FSRS parameters
 * @returns {Object} { nextReview: Date, interval: number, ease: number, state: string }
 */
export function calculateNextReview(progress, wasCorrect, params = FSRS_PARAMS) {
  const now = new Date();
  const timesSeen = (progress?.times_seen || 0) + 1;
  const desiredRetention = params.desired_retention || 0.9;

  // Extract or derive FSRS parameters from existing progress
  let stability = progress?.stability || null;
  let difficulty = progress?.difficulty || null;

  // Backward compatibility: convert from legacy ease_factor if no FSRS params
  if (stability === null && progress?.interval > 0) {
    stability = intervalToStability(progress.interval, desiredRetention);
  }
  if (difficulty === null && progress?.ease_factor) {
    difficulty = easeToDifficulty(progress.ease_factor);
  }

  let interval;

  if (!progress || progress.times_seen === 0 || stability === null) {
    // NEW card: use initial stability based on correctness
    if (wasCorrect) {
      stability = params.initial_stability?.[2] || 2.4; // Good rating
      difficulty = params.initial_difficulty?.[2] || 5.0;
      interval = params.learningSteps[0]; // Start in learning phase
    } else {
      stability = params.initial_stability?.[0] || 0.4; // Again rating
      difficulty = params.initial_difficulty?.[0] || 7.0;
      interval = params.minInterval;
    }
  } else if (timesSeen <= 3 && (progress?.interval || 0) <= (params.learningSteps?.[1] || 3)) {
    // LEARNING phase: use fixed steps, but update stability/difficulty
    if (wasCorrect) {
      difficulty = nextDifficulty(difficulty, true);

      if ((progress?.interval || 0) === 0) {
        interval = params.learningSteps[0];
        stability = params.initial_stability?.[2] || 2.4;
      } else if ((progress?.interval || 0) <= params.learningSteps[0]) {
        interval = params.learningSteps[1] || params.graduationInterval;
        stability = nextStabilityCorrect(stability, difficulty, desiredRetention);
      } else {
        // Graduate from learning
        interval = params.graduationInterval;
        stability = nextStabilityCorrect(stability, difficulty, desiredRetention);
      }
    } else {
      difficulty = nextDifficulty(difficulty, false);
      stability = nextStabilityIncorrect(stability, difficulty);
      interval = params.minInterval;
    }
  } else {
    // REVIEW phase: full FSRS-4.5 scheduling
    if (wasCorrect) {
      difficulty = nextDifficulty(difficulty, true);
      stability = nextStabilityCorrect(stability, difficulty, desiredRetention);
      interval = stabilityToInterval(stability, desiredRetention);
    } else {
      difficulty = nextDifficulty(difficulty, false);
      stability = nextStabilityIncorrect(stability, difficulty);
      interval = stabilityToInterval(stability, desiredRetention);
    }
  }

  // Clamp interval
  interval = Math.max(params.minInterval || 1, Math.min(interval, params.maxInterval || 365));

  // Convert difficulty back to ease_factor for backward compatibility with DB
  const ease = difficultyToEase(difficulty);

  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    nextReview,
    interval,
    ease,
    stability,
    difficulty,
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
 * Uses FSRS stability for more accurate priority
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

  // Use difficulty if available (FSRS-4.5), otherwise fall back to ease_factor
  if (progress.difficulty != null) {
    // Higher difficulty = higher priority (0-10 scale)
    priority += progress.difficulty * 2;
  } else {
    // Lower ease = higher priority (harder questions)
    const ease = progress.ease_factor || 2.5;
    priority += (3.0 - ease) * 5;
  }

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
