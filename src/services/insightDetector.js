/**
 * Insight Detector Service
 * Analyzes quiz session results and detects triggered insights
 */

/**
 * Detect insights that should be triggered based on failed questions
 * @param {Object[]} sessionResults - Array of question results
 * @param {string} userId - User ID from Supabase auth
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise<Object[]>} Array of triggered insights with full template info
 */
export async function detectTriggeredInsights(sessionResults, userId, supabase) {
  if (!sessionResults || !Array.isArray(sessionResults) || sessionResults.length === 0) {
    return [];
  }

  if (!userId || !supabase) {
    console.warn('detectTriggeredInsights: userId or supabase client missing');
    return [];
  }

  try {
    // 1. Extract IDs of failed questions
    const failedQuestionIds = sessionResults
      .filter(result => !result.es_correcta)
      .map(result => result.question_id)
      .filter(id => id != null);

    if (failedQuestionIds.length === 0) {
      // No failed questions, no insights to trigger
      return [];
    }

    // 2. Query insights linked to failed questions
    // This query finds all active insight templates that have links to the failed questions
    // and groups them to count how many failed questions match each insight
    const { data: linkedInsights, error: linkError } = await supabase
      .from('insight_question_links')
      .select(`
        insight_template_id,
        question_id,
        insight_templates!inner (
          id,
          titulo,
          descripcion,
          tipo,
          emoji,
          min_fallos_para_activar,
          activo
        )
      `)
      .in('question_id', failedQuestionIds)
      .eq('insight_templates.activo', true);

    if (linkError) {
      console.error('Error fetching insight links:', linkError);
      return [];
    }

    if (!linkedInsights || linkedInsights.length === 0) {
      return [];
    }

    // 3. Group by insight_template_id and count failed questions
    const insightGroups = {};
    for (const link of linkedInsights) {
      const templateId = link.insight_template_id;
      if (!insightGroups[templateId]) {
        insightGroups[templateId] = {
          template: link.insight_templates,
          failedQuestionIds: [],
          count: 0
        };
      }
      insightGroups[templateId].failedQuestionIds.push(link.question_id);
      insightGroups[templateId].count++;
    }

    // 4. Filter insights where count >= min_fallos_para_activar
    const triggeredInsights = [];
    for (const [templateId, group] of Object.entries(insightGroups)) {
      const minRequired = group.template.min_fallos_para_activar || 1;
      if (group.count >= minRequired) {
        // Check if this insight was already triggered recently (last 24 hours)
        const alreadyTriggered = await checkRecentlyTriggered(
          userId,
          templateId,
          supabase
        );

        if (!alreadyTriggered) {
          triggeredInsights.push({
            templateId: group.template.id,
            titulo: group.template.titulo,
            descripcion: group.template.descripcion,
            tipo: group.template.tipo,
            emoji: group.template.emoji,
            failedQuestionIds: group.failedQuestionIds,
            totalFailed: group.count,
            minRequired: minRequired
          });
        }
      }
    }

    // 5. Save triggered insights to user_triggered_insights
    if (triggeredInsights.length > 0) {
      await saveTriggeredInsights(triggeredInsights, userId, supabase);
    }

    // 6. Return triggered insights
    return triggeredInsights;

  } catch (error) {
    console.error('Error in detectTriggeredInsights:', error);
    return [];
  }
}

/**
 * Check if an insight was recently triggered for this user (within 24 hours)
 * @param {string} userId - User ID
 * @param {string} templateId - Insight template ID
 * @param {Object} supabase - Supabase client
 * @returns {Promise<boolean>} True if recently triggered
 */
async function checkRecentlyTriggered(userId, templateId, supabase) {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data, error } = await supabase
      .from('user_triggered_insights')
      .select('id')
      .eq('user_id', userId)
      .eq('insight_template_id', templateId)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .limit(1);

    if (error) {
      console.error('Error checking recently triggered:', error);
      return false; // On error, allow triggering
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkRecentlyTriggered:', error);
    return false;
  }
}

/**
 * Save triggered insights to user_triggered_insights table
 * @param {Object[]} triggeredInsights - Array of triggered insights
 * @param {string} userId - User ID
 * @param {Object} supabase - Supabase client
 */
async function saveTriggeredInsights(triggeredInsights, userId, supabase) {
  try {
    const records = triggeredInsights.map(insight => ({
      user_id: userId,
      insight_template_id: insight.templateId,
      preguntas_falladas: insight.failedQuestionIds,
      visto: false
    }));

    const { error } = await supabase
      .from('user_triggered_insights')
      .insert(records);

    if (error) {
      console.error('Error saving triggered insights:', error);
    }
  } catch (error) {
    console.error('Error in saveTriggeredInsights:', error);
  }
}

/**
 * Calculate session statistics from results
 * @param {Object[]} sessionResults - Array of question results
 * @returns {Object} Session statistics
 */
export function calculateSessionStats(sessionResults) {
  if (!sessionResults || !Array.isArray(sessionResults)) {
    return {
      total: 0,
      correctas: 0,
      incorrectas: 0,
      en_blanco: 0,
      porcentaje_acierto: 0,
      puntuacion_oposicion: 0
    };
  }

  const total = sessionResults.length;
  const correctas = sessionResults.filter(r => r.es_correcta === true).length;
  const incorrectas = sessionResults.filter(r => r.es_correcta === false && r.respuesta_usuario != null).length;
  const en_blanco = sessionResults.filter(r => r.respuesta_usuario == null).length;

  // Opposition scoring: +1 correct, -0.33 incorrect, 0 blank
  const puntuacion_oposicion = correctas - (incorrectas * 0.33);
  const porcentaje_acierto = total > 0 ? (correctas / total) * 100 : 0;

  return {
    total,
    correctas,
    incorrectas,
    en_blanco,
    porcentaje_acierto: Math.round(porcentaje_acierto * 100) / 100,
    puntuacion_oposicion: Math.round(puntuacion_oposicion * 100) / 100
  };
}

/**
 * Get question IDs by tema from session results
 * @param {Object[]} sessionResults - Array of question results with tema info
 * @returns {Object} Object with tema as key and array of question_ids as value
 */
export function groupQuestionsByTema(sessionResults) {
  if (!sessionResults || !Array.isArray(sessionResults)) {
    return {};
  }

  const grouped = {};
  for (const result of sessionResults) {
    const tema = result.tema || 'sin_tema';
    if (!grouped[tema]) {
      grouped[tema] = {
        total: 0,
        correctas: 0,
        incorrectas: 0,
        questionIds: []
      };
    }
    grouped[tema].total++;
    grouped[tema].questionIds.push(result.question_id);
    if (result.es_correcta) {
      grouped[tema].correctas++;
    } else if (result.respuesta_usuario != null) {
      grouped[tema].incorrectas++;
    }
  }

  return grouped;
}

/**
 * Detect typical trap patterns from failed questions
 * Uses the trampa_tipica field from questions to identify common mistakes
 * @param {Object[]} sessionResults - Array of question results
 * @param {Object[]} questions - Full question objects with trampa_tipica field
 * @returns {Object[]} Array of detected trap patterns
 */
export function detectTypicalTraps(sessionResults, questions) {
  if (!sessionResults || !questions) return [];

  // Create a map of questions by ID for quick lookup
  const questionMap = new Map();
  questions.forEach(q => questionMap.set(q.id, q));

  // Find failed questions that have trampa_tipica
  const trapsDetected = [];
  const trapPatterns = {}; // Group by similar trap patterns

  sessionResults
    .filter(r => !r.es_correcta && r.respuesta_usuario != null)
    .forEach(result => {
      const question = questionMap.get(result.question_id);
      if (!question || !question.trampa_tipica) return;

      const trap = question.trampa_tipica;

      // Normalize trap pattern for grouping
      const normalizedTrap = trap.toLowerCase().trim();

      if (!trapPatterns[normalizedTrap]) {
        trapPatterns[normalizedTrap] = {
          trap: trap,
          questions: [],
          count: 0,
          tema: question.tema || 'general'
        };
      }
      trapPatterns[normalizedTrap].questions.push(question.id);
      trapPatterns[normalizedTrap].count++;
    });

  // Convert patterns to insights (only if count >= 2 or it's a notable trap)
  Object.values(trapPatterns).forEach(pattern => {
    if (pattern.count >= 1) { // Show even single traps for awareness
      trapsDetected.push({
        type: 'trampa_tipica',
        emoji: '⚠️',
        titulo: 'Patrón de error detectado',
        descripcion: pattern.trap,
        tema: pattern.tema,
        questionsAffected: pattern.questions,
        occurrences: pattern.count,
        severity: pattern.count >= 3 ? 'high' : pattern.count >= 2 ? 'medium' : 'low'
      });
    }
  });

  // Sort by occurrences (most common first)
  trapsDetected.sort((a, b) => b.occurrences - a.occurrences);

  return trapsDetected;
}

/**
 * Generate a comprehensive insight report combining DB insights and trap detection
 * @param {Object[]} sessionResults - Session results
 * @param {Object[]} questions - Full question objects
 * @param {string} userId - User ID
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Comprehensive insight report
 */
export async function generateInsightReport(sessionResults, questions, userId, supabase) {
  // Detect DB-based insights
  const dbInsights = await detectTriggeredInsights(sessionResults, userId, supabase);

  // Detect typical trap patterns
  const trapInsights = detectTypicalTraps(sessionResults, questions);

  // Calculate stats
  const stats = calculateSessionStats(sessionResults);

  // Group by tema
  const byTema = groupQuestionsByTema(sessionResults);

  return {
    stats,
    dbInsights,
    trapInsights,
    byTema,
    summary: {
      totalInsights: dbInsights.length + trapInsights.length,
      hasTraps: trapInsights.length > 0,
      topTrap: trapInsights.length > 0 ? trapInsights[0] : null
    }
  };
}

export default {
  detectTriggeredInsights,
  detectTypicalTraps,
  calculateSessionStats,
  groupQuestionsByTema,
  generateInsightReport
};
