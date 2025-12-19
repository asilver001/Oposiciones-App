/**
 * Question Import/Export Service
 * Handles bulk operations with Supabase
 */

import { supabase } from '../lib/supabase';
import { transformQuestionForSupabase, validateQuestions } from '../utils/questionValidator';

/**
 * Check for duplicate questions by similar text
 * @param {string} questionText - Question text to check
 * @returns {Promise<boolean>} True if duplicate found
 */
async function checkDuplicate(questionText) {
  const normalizedText = questionText.toLowerCase().trim().replace(/\s+/g, ' ');

  // Get existing questions and check for similarity
  const { data, error } = await supabase
    .from('questions')
    .select('question_text')
    .limit(1000);

  if (error) {
    console.error('Error checking duplicates:', error);
    return false;
  }

  // Simple similarity check (exact match after normalization)
  return data.some(q => {
    const existingNormalized = q.question_text.toLowerCase().trim().replace(/\s+/g, ' ');
    // Check for high similarity (>90% match)
    return existingNormalized === normalizedText ||
           calculateSimilarity(existingNormalized, normalizedText) > 0.9;
  });
}

/**
 * Calculate similarity between two strings (Jaccard similarity)
 * @param {string} str1
 * @param {string} str2
 * @returns {number} Similarity score 0-1
 */
function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Import questions to Supabase
 * @param {Object[]} questions - Array of questions in import format
 * @param {Object} options - Import options
 * @returns {Promise<Object>} Import result
 */
export async function importQuestions(questions, options = {}) {
  const {
    skipDuplicates = true,
    validateBeforeImport = true
  } = options;

  const result = {
    imported: 0,
    duplicates: 0,
    errors: [],
    details: []
  };

  // Validate if requested
  if (validateBeforeImport) {
    const validation = validateQuestions(questions);
    if (!validation.valid) {
      result.errors.push(...validation.errors);
      return result;
    }
    questions = validation.validQuestions;
  }

  // Process each question
  for (let i = 0; i < questions.length; i++) {
    // Remove id field if present (Supabase auto-generates it)
    const { id, ...question } = questions[i];

    try {
      // Get the main question text (prefer reformulated_text)
      const mainQuestionText = question.reformulated_text || question.question_text;

      // Check for duplicates
      if (skipDuplicates) {
        const isDuplicate = await checkDuplicate(mainQuestionText);
        if (isDuplicate) {
          result.duplicates++;
          result.details.push({
            index: i,
            status: 'duplicate',
            question: mainQuestionText.substring(0, 50) + '...'
          });
          continue;
        }
      }

      // Transform to Supabase format
      const supabaseQuestion = transformQuestionForSupabase(question);
      
      // IMPORTANT: Remove id field again in case transformQuestionForSupabase added it
      delete supabaseQuestion.id;

      // Insert directly into the questions table (instead of RPC)
      const { data, error } = await supabase
        .from('questions')
        .insert(supabaseQuestion)
        .select('id')
        .single();

      if (error) {
        result.errors.push(`Pregunta ${i + 1}: ${error.message}`);
        result.details.push({
          index: i,
          status: 'error',
          error: error.message,
          question: mainQuestionText.substring(0, 50) + '...'
        });
      } else {
        result.imported++;
        result.details.push({
          index: i,
          status: 'imported',
          id: data?.id,
          question: mainQuestionText.substring(0, 50) + '...'
        });
      }
    } catch (err) {
      result.errors.push(`Pregunta ${i + 1}: ${err.message}`);
      result.details.push({
        index: i,
        status: 'error',
        error: err.message,
        question: (question.reformulated_text || question.question_text)?.substring(0, 50) + '...'
      });
    }
  }

  return result;
}

/**
 * Export questions from Supabase
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Export result with questions
 */
export async function exportQuestions(filters = {}) {
  const {
    tema,
    materia,
    tier,
    validation_status,
    difficulty,
    minConfidence,
    maxConfidence,
    limit = 1000
  } = filters;

  let query = supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  // Apply filters
  if (tema) query = query.eq('tema', tema);
  if (materia) query = query.eq('materia', materia);
  if (tier) query = query.eq('tier', tier);
  if (validation_status) query = query.eq('validation_status', validation_status);
  if (difficulty) query = query.eq('difficulty', difficulty);
  if (minConfidence !== undefined) query = query.gte('confidence_score', minConfidence);
  if (maxConfidence !== undefined) query = query.lte('confidence_score', maxConfidence);

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      error: error.message,
      questions: []
    };
  }

  // Transform back to export format
  const exportQuestions = data.map(q => ({
    question_text: q.question_text,
    original_text: q.original_text,
    options: q.options, // Already in correct JSONB format
    explanation: q.explanation,
    legal_reference: q.legal_reference,
    tema: q.tema,
    materia: q.materia,
    difficulty: q.difficulty,
    source: q.source,
    source_year: q.source_year,
    confidence_score: q.confidence_score,
    tier: q.tier,
    validation_status: q.validation_status
  }));

  return {
    success: true,
    questions: exportQuestions,
    count: exportQuestions.length,
    filters: filters
  };
}

/**
 * Get question statistics
 * @returns {Promise<Object>} Statistics
 */
export async function getQuestionStats() {
  const { data, error } = await supabase
    .from('questions')
    .select('tema, tier, validation_status, materia')
    .eq('is_active', true);

  if (error) {
    return { error: error.message };
  }

  const stats = {
    total: data.length,
    byTema: {},
    byTier: { free: 0, premium: 0 },
    byValidation: {},
    byMateria: {}
  };

  data.forEach(q => {
    // By tema
    stats.byTema[q.tema] = (stats.byTema[q.tema] || 0) + 1;

    // By tier
    stats.byTier[q.tier] = (stats.byTier[q.tier] || 0) + 1;

    // By validation
    stats.byValidation[q.validation_status] = (stats.byValidation[q.validation_status] || 0) + 1;

    // By materia
    stats.byMateria[q.materia] = (stats.byMateria[q.materia] || 0) + 1;
  });

  return stats;
}

/**
 * Download questions as JSON file
 * @param {Object[]} questions - Questions to download
 * @param {string} filename - Filename without extension
 */
export function downloadAsJSON(questions, filename = 'questions_export') {
  const dataStr = JSON.stringify({ questions }, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default {
  importQuestions,
  exportQuestions,
  getQuestionStats,
  downloadAsJSON
};
