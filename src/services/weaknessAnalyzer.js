/**
 * WeaknessAnalyzer - Cross-session error pattern detection
 *
 * Analyzes user's entire question history to find persistent weaknesses:
 * - Articles/laws they consistently get wrong
 * - Topics trending down in accuracy
 * - Error clusters by legal reference
 *
 * Works with existing data (user_question_progress, test_sessions)
 * without requiring new DB tables.
 */

import { supabase } from '../lib/supabase';

/**
 * Analyze user's persistent weaknesses from question-level progress
 *
 * @param {string} userId
 * @returns {Promise<Object>} { weakTopics, weakArticles, recommendations }
 */
export async function analyzeWeaknesses(userId) {
  if (!userId) return { weakTopics: [], weakArticles: [], recommendations: [] };

  try {
    // Get all user question progress with question details
    const { data: progressData, error } = await supabase
      .from('user_question_progress')
      .select('question_id, times_seen, times_correct, difficulty, state')
      .eq('user_id', userId)
      .gt('times_seen', 0)
      .order('difficulty', { ascending: false });

    if (error || !progressData || progressData.length === 0) {
      return { weakTopics: [], weakArticles: [], recommendations: [] };
    }

    // Get question details for failed questions
    const failedQuestionIds = progressData
      .filter(p => p.times_correct < p.times_seen)
      .map(p => p.question_id);

    if (failedQuestionIds.length === 0) {
      return { weakTopics: [], weakArticles: [], recommendations: [] };
    }

    // SECURITY: use RPC (capped to 50 per call + audits reads).
    // Chunk failed IDs in groups of 50; cap total analysis to 200 to bound cost.
    const idsToFetch = failedQuestionIds.slice(0, 200);
    const chunks = [];
    for (let i = 0; i < idsToFetch.length; i += 50) chunks.push(idsToFetch.slice(i, i + 50));

    const questionArrays = await Promise.all(
      chunks.map(ids =>
        supabase.rpc('get_questions_by_ids', { p_ids: ids })
          .then(({ data }) => data || [])
      )
    );
    const questions = questionArrays.flat();

    if (!questions.length) {
      return { weakTopics: [], weakArticles: [], recommendations: [] };
    }

    // Build progress lookup
    const progressMap = {};
    progressData.forEach(p => {
      progressMap[p.question_id] = p;
    });

    // --- Analyze by topic ---
    const topicStats = {};
    progressData.forEach(p => {
      const q = questions.find(q => q.id === p.question_id);
      if (!q) return;
      const tema = q.tema;
      if (!topicStats[tema]) {
        topicStats[tema] = { tema, correct: 0, total: 0, failed: 0, highDifficulty: 0 };
      }
      topicStats[tema].total += p.times_seen;
      topicStats[tema].correct += p.times_correct;
      if (p.times_correct < p.times_seen) topicStats[tema].failed++;
      if (p.difficulty > 7) topicStats[tema].highDifficulty++;
    });

    const weakTopics = Object.values(topicStats)
      .map(t => ({
        ...t,
        accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
        failRate: t.total > 0 ? Math.round(((t.total - t.correct) / t.total) * 100) : 0,
      }))
      .filter(t => t.accuracy < 65 && t.total >= 5)
      .sort((a, b) => a.accuracy - b.accuracy);

    // --- Analyze by legal reference (articles) ---
    const articleStats = {};
    questions.forEach(q => {
      if (!q.legal_reference) return;
      const ref = q.legal_reference.trim();
      if (!articleStats[ref]) {
        articleStats[ref] = { ref, tema: q.tema, questionIds: [], failCount: 0, totalSeen: 0 };
      }
      const progress = progressMap[q.id];
      if (progress) {
        articleStats[ref].totalSeen += progress.times_seen;
        articleStats[ref].failCount += (progress.times_seen - progress.times_correct);
        articleStats[ref].questionIds.push(q.id);
      }
    });

    const weakArticles = Object.values(articleStats)
      .filter(a => a.failCount >= 2 && a.totalSeen >= 3)
      .map(a => ({
        ...a,
        accuracy: a.totalSeen > 0 ? Math.round(((a.totalSeen - a.failCount) / a.totalSeen) * 100) : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    // --- Generate recommendations ---
    const recommendations = [];

    if (weakTopics.length > 0) {
      const worst = weakTopics[0];
      recommendations.push({
        type: 'weak-topic',
        priority: 1,
        title: `Refuerza el Tema ${worst.tema}`,
        description: `Solo ${worst.accuracy}% de acierto en ${worst.total} intentos. Dedica una sesión a este tema.`,
        action: { mode: 'practica-tema', tema: worst.tema },
      });
    }

    if (weakArticles.length > 0) {
      const worst = weakArticles[0];
      recommendations.push({
        type: 'weak-article',
        priority: 2,
        title: `Repasa ${worst.ref}`,
        description: `Has fallado ${worst.failCount} veces en preguntas sobre este artículo.`,
        action: { mode: 'repaso-errores', tema: worst.tema },
      });
    }

    if (failedQuestionIds.length > 10) {
      recommendations.push({
        type: 'error-review',
        priority: 3,
        title: 'Sesión de errores',
        description: `Tienes ${failedQuestionIds.length} preguntas con fallos acumulados. Repásalas.`,
        action: { mode: 'repaso-errores', failedOnly: true },
      });
    }

    return { weakTopics, weakArticles, recommendations };
  } catch (err) {
    console.error('Error analyzing weaknesses:', err);
    return { weakTopics: [], weakArticles: [], recommendations: [] };
  }
}

/**
 * Get topic accuracy trends (last 4 weeks)
 *
 * @param {string} userId
 * @returns {Promise<Array>} Topic trends with direction
 */
export async function getTopicTrends(userId) {
  if (!userId) return [];

  try {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const { data: sessions } = await supabase
      .from('test_sessions')
      .select('topic_id, correct_count, total_questions, started_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('started_at', fourWeeksAgo.toISOString())
      .order('started_at', { ascending: true });

    if (!sessions || sessions.length < 2) return [];

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Split into older half and recent half
    const topicTrends = {};
    sessions.forEach(s => {
      if (s.topic_id == null) return;
      const isRecent = new Date(s.started_at) >= twoWeeksAgo;
      if (!topicTrends[s.topic_id]) {
        topicTrends[s.topic_id] = { older: { correct: 0, total: 0 }, recent: { correct: 0, total: 0 } };
      }
      const bucket = isRecent ? 'recent' : 'older';
      topicTrends[s.topic_id][bucket].correct += s.correct_count || 0;
      topicTrends[s.topic_id][bucket].total += s.total_questions || 0;
    });

    return Object.entries(topicTrends)
      .filter(([, data]) => data.older.total >= 5 && data.recent.total >= 5)
      .map(([topicId, data]) => {
        const olderAcc = Math.round((data.older.correct / data.older.total) * 100);
        const recentAcc = Math.round((data.recent.correct / data.recent.total) * 100);
        const diff = recentAcc - olderAcc;
        let trend = 'stable';
        if (diff >= 10) trend = 'improving';
        else if (diff <= -10) trend = 'declining';

        return {
          topicNumber: Number(topicId),
          olderAccuracy: olderAcc,
          recentAccuracy: recentAcc,
          diff,
          trend,
        };
      })
      .filter(t => t.trend !== 'stable')
      .sort((a, b) => a.diff - b.diff);
  } catch (err) {
    console.error('Error getting topic trends:', err);
    return [];
  }
}

/**
 * Generate a human-readable weakness summary for post-session display
 *
 * @param {string} userId
 * @returns {Promise<Array>} Insight-like objects for display
 */
export async function generateWeaknessSummary(userId) {
  const [{ weakTopics, weakArticles }, trends] = await Promise.all([
    analyzeWeaknesses(userId),
    getTopicTrends(userId),
  ]);

  const insights = [];

  // Declining topics
  const declining = trends.filter(t => t.trend === 'declining');
  if (declining.length > 0) {
    insights.push({
      tipo: 'patron_fallo',
      emoji: '📉',
      titulo: `Tema ${declining[0].topicNumber} bajando`,
      descripcion: `Tu precisión bajó de ${declining[0].olderAccuracy}% a ${declining[0].recentAccuracy}% en las últimas 2 semanas. Dedica tiempo a repasarlo.`,
      severidad: 'warning',
    });
  }

  // Persistent weak articles
  if (weakArticles.length > 0) {
    const top = weakArticles[0];
    insights.push({
      tipo: 'articulo_debil',
      emoji: '📌',
      titulo: `Punto débil: ${top.ref}`,
      descripcion: `Has fallado ${top.failCount} veces en preguntas sobre ${top.ref}. Revisa este artículo.`,
      severidad: 'danger',
    });
  }

  // Weak topics
  if (weakTopics.length > 0) {
    const w = weakTopics[0];
    insights.push({
      tipo: 'concepto_clave',
      emoji: '🎯',
      titulo: `Tema ${w.tema}: ${w.accuracy}% de acierto`,
      descripcion: `Con ${w.total} intentos y solo ${w.accuracy}% de acierto, este tema necesita más práctica.`,
      severidad: 'warning',
    });
  }

  // Improving topics (positive reinforcement)
  const improving = trends.filter(t => t.trend === 'improving');
  if (improving.length > 0) {
    insights.push({
      tipo: 'refuerzo_positivo',
      emoji: '📈',
      titulo: `Mejorando en Tema ${improving[0].topicNumber}`,
      descripcion: `De ${improving[0].olderAccuracy}% a ${improving[0].recentAccuracy}%. ¡Sigue así!`,
      severidad: 'success',
    });
  }

  return insights.slice(0, 3);
}
