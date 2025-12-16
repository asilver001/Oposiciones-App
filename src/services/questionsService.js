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

  // Get user's tier
  const userTier = await getUserTier(userId);

  // Build query
  let query = supabase
    .from('questions')
    .select('*')
    .eq('is_active', true);

  // Filter by tier for free users
  if (userTier === 'free') {
    query = query.eq('tier', 'free');
  }

  // Filter by tema if specified
  if (tema) {
    query = query.eq('tema', tema);
  }

  // Filter by difficulty if specified
  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  // For premium users, prioritize less seen questions
  if (userTier === 'premium') {
    query = query.order('times_shown', { ascending: true });
  } else {
    // For free users, mix it up more randomly
    query = query.order('rotation_priority', { ascending: false });
  }

  // Exclude recently shown for premium users
  if (excludeRecent && userTier === 'premium') {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - recentDays);

    query = query.or(`last_shown_at.is.null,last_shown_at.lt.${recentDate.toISOString()}`);
  }

  query = query.limit(count);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data || [];
}

/**
 * Mark a question as shown (increment times_shown)
 * @param {string} questionId
 * @returns {Promise<boolean>}
 */
export async function markQuestionShown(questionId) {
  const { error } = await supabase.rpc('increment_question_shown', {
    question_id: questionId
  });

  // If RPC doesn't exist, do it manually
  if (error) {
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        times_shown: supabase.raw('COALESCE(times_shown, 0) + 1'),
        last_shown_at: new Date().toISOString()
      })
      .eq('id', questionId);

    if (updateError) {
      console.error('Error marking question shown:', updateError);
      return false;
    }
  }

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
  markQuestionShown,
  getQuestionStats,
  updateQuestionTier,
  bulkUpdateTier,
  rotateFreeTier,
  getQuestionsAdmin
};
