/**
 * Questions Service
 * Handles question selection based on user tier and tracks question usage
 */

import { supabase } from '../lib/supabase';

/**
 * Get user's subscription tier
 * @param {string} userId
 * @returns {Promise<string>} 'free' or 'premium'
 */
export async function getUserTier(userId) {
  if (!userId) return 'free';

  const { data, error } = await supabase
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return 'free';
  }

  return data.subscription_tier || 'free';
}

/**
 * Get questions for a user based on their tier
 * @param {string} userId
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export async function getQuestionsForUser(userId, options = {}) {
  const {
    count = 20,
    tema = null,
    difficulty = null,
    excludeRecent = true,
    recentDays = 7
  } = options;

  // SECURITY: route through the RPC instead of direct SELECT on `questions`.
  // The RPC enforces a 50-question cap per call and tracks daily reads.
  // Tier filter is a no-op today (freemium not implemented), left for
  // future re-introduction via an RPC param.
  const safeLimit = Math.min(Math.max(Number(count) || 20, 1), 50);
  const temas = tema != null ? [Number(tema)] : null;

  const { data, error } = await supabase.rpc('get_study_questions', {
    p_temas: temas,
    p_limit: safeLimit,
    p_exclude: [],
  });

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  // Optional local difficulty filter (RPC doesn't filter by difficulty;
  // cheap enough to do client-side on ≤50 rows).
  const filtered = difficulty
    ? (data || []).filter(q => q.difficulty === difficulty)
    : (data || []);

  return filtered;
}

/**
 * Validate a user's answer server-side.
 * SECURITY: The correct answer is never exposed to the client until after submit.
 * Also increments times_shown and times_correct stats atomically.
 *
 * @param {number} questionId
 * @param {string} selectedAnswerId  e.g. 'a' | 'b' | 'c' | 'd'
 * @returns {Promise<{ correct: boolean, correctAnswerId: string, correctAnswerText: string, explanation: string, legalReference: string } | { error: string }>}
 */
export async function checkAnswer(questionId, selectedAnswerId) {
  const { data, error } = await supabase.rpc('check_answer', {
    p_question_id: questionId,
    p_selected_answer_id: selectedAnswerId
  });

  if (error) {
    console.error('Error checking answer:', error);
    return { error: error.message };
  }

  if (data?.error) return { error: data.error };

  return {
    correct: data.correct,
    correctAnswerId: data.correct_answer_id,
    correctAnswerText: data.correct_answer_text,
    explanation: data.explanation,
    legalReference: data.legal_reference
  };
}

/**
 * Validate a batch of answers (e.g. when finishing a test session).
 * @param {Array<{question_id: number, selected_answer_id: string}>} answers
 * @returns {Promise<Array>}
 */
export async function checkAnswersBatch(answers) {
  const { data, error } = await supabase.rpc('check_answers_batch', {
    p_answers: answers
  });

  if (error) {
    console.error('Error checking answers batch:', error);
    return [];
  }

  return data || [];
}

/**
 * @deprecated Use checkAnswer instead — it tracks times_shown server-side.
 * Kept for backwards compatibility with callers that only want to mark "shown"
 * without submitting an answer (e.g. preview mode).
 */
export async function markQuestionShown(questionId) {
  // No-op: checkAnswer() already increments times_shown on submit.
  // If called for a question that was never answered, we skip tracking
  // to avoid double-counting.
  return true;
}

/**
 * Get question statistics
 * @returns {Promise<Object>}
 */
export async function getQuestionStats() {
  const { data, error } = await supabase
    .from('questions')
    .select('id, tier, times_shown, tema')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching question stats:', error);
    return null;
  }

  const stats = {
    total: data.length,
    free: data.filter(q => q.tier === 'free').length,
    premium: data.filter(q => q.tier === 'premium').length,
    mostShown: [...data].sort((a, b) => (b.times_shown || 0) - (a.times_shown || 0)).slice(0, 10),
    leastShown: [...data].sort((a, b) => (a.times_shown || 0) - (b.times_shown || 0)).slice(0, 10),
    byTema: data.reduce((acc, q) => {
      const tema = q.tema || 'sin_tema';
      if (!acc[tema]) acc[tema] = { free: 0, premium: 0, total: 0 };
      acc[tema][q.tier || 'premium']++;
      acc[tema].total++;
      return acc;
    }, {})
  };

  return stats;
}

/**
 * Update question tier
 * @param {string} questionId
 * @param {string} newTier - 'free' or 'premium'
 * @returns {Promise<boolean>}
 */
export async function updateQuestionTier(questionId, newTier) {
  if (!['free', 'premium'].includes(newTier)) {
    console.error('Invalid tier:', newTier);
    return false;
  }

  const { error } = await supabase
    .from('questions')
    .update({ tier: newTier })
    .eq('id', questionId);

  if (error) {
    console.error('Error updating question tier:', error);
    return false;
  }

  return true;
}

/**
 * Bulk update question tiers
 * @param {string[]} questionIds
 * @param {string} newTier
 * @returns {Promise<number>} Number of updated questions
 */
export async function bulkUpdateTier(questionIds, newTier) {
  if (!['free', 'premium'].includes(newTier)) {
    return 0;
  }

  const { data, error } = await supabase
    .from('questions')
    .update({ tier: newTier })
    .in('id', questionIds)
    .select('id');

  if (error) {
    console.error('Error bulk updating tiers:', error);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Rotate free tier questions
 * Takes most shown free questions and swaps them with least shown premium questions
 * @param {number} percentage - Percentage of free questions to rotate (0-100)
 * @returns {Promise<Object>} { demoted: number, promoted: number }
 */
export async function rotateFreeTier(percentage = 30) {
  // Get current free questions sorted by times_shown (most shown first)
  const { data: freeQuestions, error: freeError } = await supabase
    .from('questions')
    .select('id, times_shown')
    .eq('tier', 'free')
    .eq('is_active', true)
    .order('times_shown', { ascending: false });

  if (freeError) {
    console.error('Error fetching free questions:', freeError);
    return { demoted: 0, promoted: 0 };
  }

  // Get premium questions sorted by times_shown (least shown first)
  const { data: premiumQuestions, error: premiumError } = await supabase
    .from('questions')
    .select('id, times_shown')
    .eq('tier', 'premium')
    .eq('is_active', true)
    .order('times_shown', { ascending: true });

  if (premiumError) {
    console.error('Error fetching premium questions:', premiumError);
    return { demoted: 0, promoted: 0 };
  }

  // Calculate how many to rotate
  const rotateCount = Math.floor((freeQuestions.length * percentage) / 100);

  if (rotateCount === 0) {
    return { demoted: 0, promoted: 0 };
  }

  // Get IDs to swap
  const toDemote = freeQuestions.slice(0, rotateCount).map(q => q.id);
  const toPromote = premiumQuestions.slice(0, rotateCount).map(q => q.id);

  // Demote: free -> premium
  let demoted = 0;
  if (toDemote.length > 0) {
    const { data } = await supabase
      .from('questions')
      .update({ tier: 'premium' })
      .in('id', toDemote)
      .select('id');
    demoted = data?.length || 0;
  }

  // Promote: premium -> free (and reset times_shown)
  let promoted = 0;
  if (toPromote.length > 0) {
    const { data } = await supabase
      .from('questions')
      .update({
        tier: 'free',
        times_shown: 0,
        rotation_priority: 0
      })
      .in('id', toPromote)
      .select('id');
    promoted = data?.length || 0;
  }

  return { demoted, promoted };
}

/**
 * Get questions with pagination for admin
 * @param {Object} options
 * @returns {Promise<Object>} { data, count, error }
 */
export async function getQuestionsAdmin(options = {}) {
  const {
    page = 1,
    perPage = 20,
    tier = null,
    tema = null,
    search = null,
    sortBy = 'created_at',
    sortAsc = false
  } = options;

  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (tier) {
    query = query.eq('tier', tier);
  }

  if (tema) {
    query = query.eq('tema', tema);
  }

  if (search) {
    query = query.ilike('question_text', `%${search}%`);
  }

  query = query
    .order(sortBy, { ascending: sortAsc })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;

  return { data, count, error };
}

export default {
  getUserTier,
  getQuestionsForUser,
  checkAnswer,
  checkAnswersBatch,
  markQuestionShown,
  getQuestionStats,
  updateQuestionTier,
  bulkUpdateTier,
  rotateFreeTier,
  getQuestionsAdmin
};
