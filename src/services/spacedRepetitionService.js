/**
 * Spaced Repetition Service
 * Manages user question progress with FSRS algorithm
 */

import { supabase } from '../lib/supabase';
import {
  calculateNextReview,
  isDue,
  calculateState,
  calculatePriority,
  QuestionState
} from '../lib/fsrs';

/**
 * Get user's progress for all questions
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_question_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data || [];
}

/**
 * Get questions due for review today
 * @param {string} userId
 * @param {Object} options - { tema, limit }
 * @returns {Promise<Array>}
 */
export async function getDueReviews(userId, options = {}) {
  const { tema, limit = 50 } = options;

  let query = supabase
    .from('user_question_progress')
    .select(`
      *,
      questions (*)
    `)
    .eq('user_id', userId)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
    .limit(limit);

  if (tema) {
    query = query.eq('questions.tema', tema);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching due reviews:', error);
    return [];
  }

  // Filter out null questions (in case of deleted questions)
  return (data || []).filter(p => p.questions);
}

/**
 * Get new questions (never seen by user)
 * @param {string} userId
 * @param {Object} options - { tema, limit, tier }
 * @returns {Promise<Array>}
 */
export async function getNewQuestions(userId, options = {}) {
  const { tema, limit = 50, tier } = options;

  // Get IDs of questions the user has seen
  const { data: seenData } = await supabase
    .from('user_question_progress')
    .select('question_id')
    .eq('user_id', userId);

  const seenIds = (seenData || []).map(p => p.question_id);

  // Build query for unseen questions
  let query = supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('times_shown', { ascending: true }) // Prefer less shown questions
    .limit(limit);

  if (tema) {
    query = query.eq('tema', tema);
  }

  if (tier) {
    query = query.eq('tier', tier);
  }

  // Exclude seen questions (only if there are some)
  // FIX: Use Supabase native API instead of string interpolation to prevent SQL injection
  if (seenIds.length > 0) {
    query = query.not('id', 'in', seenIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching new questions:', error);
    return [];
  }

  return data || [];
}

/**
 * Generate a hybrid study session (mix of review + new questions)
 * @param {string} userId
 * @param {Object} config
 * @returns {Promise<Array>}
 */
export async function generateHybridSession(userId, config = {}) {
  const {
    totalQuestions = 20,
    reviewRatio = 0.25,
    tema = null,
    tier = null
  } = config;

  const reviewCount = Math.floor(totalQuestions * reviewRatio);
  const newCount = totalQuestions - reviewCount;

  // Get due reviews
  const dueReviews = await getDueReviews(userId, { tema, limit: reviewCount + 5 });

  // Get new questions
  const newQuestions = await getNewQuestions(userId, { tema, limit: newCount + 5, tier });

  // Take the required number
  const selectedReviews = dueReviews.slice(0, reviewCount);
  const selectedNew = newQuestions.slice(0, newCount);

  // If not enough reviews, fill with new questions
  const reviewShortfall = reviewCount - selectedReviews.length;
  if (reviewShortfall > 0 && newQuestions.length > newCount) {
    const extra = newQuestions.slice(newCount, newCount + reviewShortfall);
    selectedNew.push(...extra);
  }

  // If not enough new questions, fill with more reviews
  const newShortfall = newCount - selectedNew.length;
  if (newShortfall > 0 && dueReviews.length > reviewCount) {
    const extra = dueReviews.slice(reviewCount, reviewCount + newShortfall);
    selectedReviews.push(...extra);
  }

  // Combine and interleave (avoid 2 reviews in a row)
  const session = [];
  let reviews = [...selectedReviews];
  let newOnes = [...selectedNew];

  // Mark which are reviews for display purposes
  reviews = reviews.map(r => ({
    ...r.questions,
    isReview: true,
    progress: {
      times_seen: r.times_seen,
      times_correct: r.times_correct,
      interval: r.interval,
      ease_factor: r.ease_factor
    }
  }));

  newOnes = newOnes.map(q => ({
    ...q,
    isReview: false,
    progress: null
  }));

  // Interleave: try to avoid 2 reviews in a row
  let lastWasReview = false;

  while (reviews.length > 0 || newOnes.length > 0) {
    if (lastWasReview && newOnes.length > 0) {
      // Prefer new after review
      session.push(newOnes.shift());
      lastWasReview = false;
    } else if (!lastWasReview && reviews.length > 0 && Math.random() < 0.3) {
      // Sometimes add review
      session.push(reviews.shift());
      lastWasReview = true;
    } else if (newOnes.length > 0) {
      // Add new question
      session.push(newOnes.shift());
      lastWasReview = false;
    } else if (reviews.length > 0) {
      // No new questions left, add review
      session.push(reviews.shift());
      lastWasReview = true;
    }
  }

  return session;
}

/**
 * Update user progress after answering a question
 * @param {string} userId
 * @param {string} questionId
 * @param {boolean} wasCorrect
 * @returns {Promise<Object>}
 */
export async function updateProgress(userId, questionId, wasCorrect) {
  // Get existing progress
  const { data: existing } = await supabase
    .from('user_question_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .single();

  // Calculate new FSRS values
  const fsrsResult = calculateNextReview(existing, wasCorrect);

  const progressData = {
    user_id: userId,
    question_id: questionId,
    times_seen: (existing?.times_seen || 0) + 1,
    times_correct: (existing?.times_correct || 0) + (wasCorrect ? 1 : 0),
    interval: fsrsResult.interval,
    ease_factor: fsrsResult.ease,
    next_review: fsrsResult.nextReview.toISOString(),
    last_reviewed: new Date().toISOString(),
    state: fsrsResult.state
  };

  // Upsert progress
  const { data, error } = await supabase
    .from('user_question_progress')
    .upsert(progressData, {
      onConflict: 'user_id,question_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating progress:', error);
    return null;
  }

  // Also update question stats using RPC function (safer than raw SQL)
  // Call the existing update_question_stats function from the database
  await supabase.rpc('update_question_stats', {
    p_question_id: questionId,
    p_was_correct: wasCorrect
  });

  return data;
}

/**
 * Get study statistics for dashboard
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function getStudyStats(userId) {
  // Get all progress
  const progress = await getUserProgress(userId);

  if (progress.length === 0) {
    return {
      totalStudied: 0,
      dueToday: 0,
      mastered: 0,
      learning: 0,
      retention: 0,
      streak: 0
    };
  }

  // Calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dueToday = progress.filter(p => {
    if (!p.next_review) return false;
    return new Date(p.next_review) <= now;
  }).length;

  const byState = progress.reduce((acc, p) => {
    const state = p.state || calculateState(p);
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  // Calculate retention
  const totalCorrect = progress.reduce((sum, p) => sum + (p.times_correct || 0), 0);
  const totalSeen = progress.reduce((sum, p) => sum + (p.times_seen || 0), 0);
  const retention = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;

  // Calculate streak from study_history if available
  const { data: historyData } = await supabase
    .from('study_history')
    .select('date, questions_answered')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  let streak = 0;
  if (historyData && historyData.length > 0) {
    const expectedDate = new Date(today);

    for (const entry of historyData) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === expectedDate.getTime() && entry.questions_answered > 0) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    totalStudied: progress.length,
    dueToday,
    mastered: byState[QuestionState.MASTERED] || 0,
    learning: byState[QuestionState.LEARNING] || 0,
    review: byState[QuestionState.REVIEW] || 0,
    retention,
    streak
  };
}

/**
 * Record daily study activity
 * @param {string} userId
 * @param {number} questionsAnswered
 * @param {number} correctAnswers
 */
export async function recordDailyStudy(userId, questionsAnswered, correctAnswers) {
  const today = new Date().toISOString().split('T')[0];

  // First, try to get existing record
  const { data: existing } = await supabase
    .from('study_history')
    .select('questions_answered, correct_answers')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  // Calculate new totals
  const newQuestionsAnswered = (existing?.questions_answered || 0) + questionsAnswered;
  const newCorrectAnswers = (existing?.correct_answers || 0) + correctAnswers;

  // Upsert with calculated values (no SQL injection risk)
  const { error } = await supabase
    .from('study_history')
    .upsert({
      user_id: userId,
      date: today,
      questions_answered: newQuestionsAnswered,
      correct_answers: newCorrectAnswers
    }, {
      onConflict: 'user_id,date'
    });

  if (error) {
    console.error('Error recording daily study:', error);
  }
}

/**
 * Get weekly progress data for chart
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getWeeklyProgress(userId) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('study_history')
    .select('date, questions_answered, correct_answers')
    .eq('user_id', userId)
    .gte('date', weekAgo.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching weekly progress:', error);
    return [];
  }

  // Fill in missing days
  const result = [];
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const entry = data?.find(d => d.date === dateStr);

    result.push({
      day: days[date.getDay()],
      date: dateStr,
      questions: entry?.questions_answered || 0,
      correct: entry?.correct_answers || 0
    });
  }

  return result;
}

export default {
  getUserProgress,
  getDueReviews,
  getNewQuestions,
  generateHybridSession,
  updateProgress,
  getStudyStats,
  recordDailyStudy,
  getWeeklyProgress
};
