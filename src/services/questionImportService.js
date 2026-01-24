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
    validateBeforeImport = true,
    batchSize = 50, // Process in batches of 50 questions
    onProgress = null // Callback for progress updates: (imported, total) => {}
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

  // If skip duplicates is enabled, we need to check each question individually
  // Otherwise, we can use bulk insert for better performance
  if (skipDuplicates) {
    // Process in batches but check duplicates
    const batches = [];
    for (let i = 0; i < questions.length; i += batchSize) {
      batches.push(questions.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const questionsToInsert = [];
      const batchOffset = batchIndex * batchSize;

      // Check duplicates for this batch
      for (let i = 0; i < batch.length; i++) {
        const { id, ...question } = batch[i];
        const globalIndex = batchOffset + i;
        const mainQuestionText = question.reformulated_text || question.question_text;

        try {
          const isDuplicate = await checkDuplicate(mainQuestionText);
          if (isDuplicate) {
            result.duplicates++;
            result.details.push({
              index: globalIndex,
              status: 'duplicate',
              question: mainQuestionText.substring(0, 50) + '...'
            });
          } else {
            const supabaseQuestion = transformQuestionForSupabase(question);
            delete supabaseQuestion.id;
            questionsToInsert.push({
              data: supabaseQuestion,
              index: globalIndex,
              questionText: mainQuestionText
            });
          }
        } catch (err) {
          result.errors.push(`Pregunta ${globalIndex + 1}: ${err.message}`);
          result.details.push({
            index: globalIndex,
            status: 'error',
            error: err.message,
            question: mainQuestionText.substring(0, 50) + '...'
          });
        }
      }

      // Bulk insert non-duplicate questions
      if (questionsToInsert.length > 0) {
        try {
          const { data, error } = await supabase
            .from('questions')
            .insert(questionsToInsert.map(q => q.data))
            .select('id');

          if (error) {
            // If bulk insert fails, fall back to individual inserts
            console.warn('Bulk insert failed, falling back to individual inserts:', error);
            for (const q of questionsToInsert) {
              try {
                const { data: singleData, error: singleError } = await supabase
                  .from('questions')
                  .insert(q.data)
                  .select('id')
                  .single();

                if (singleError) {
                  result.errors.push(`Pregunta ${q.index + 1}: ${singleError.message}`);
                  result.details.push({
                    index: q.index,
                    status: 'error',
                    error: singleError.message,
                    question: q.questionText.substring(0, 50) + '...'
                  });
                } else {
                  result.imported++;
                  result.details.push({
                    index: q.index,
                    status: 'imported',
                    id: singleData?.id,
                    question: q.questionText.substring(0, 50) + '...'
                  });
                }
              } catch (singleErr) {
                result.errors.push(`Pregunta ${q.index + 1}: ${singleErr.message}`);
                result.details.push({
                  index: q.index,
                  status: 'error',
                  error: singleErr.message,
                  question: q.questionText.substring(0, 50) + '...'
                });
              }
            }
          } else {
            // Success: record all imported questions
            data.forEach((item, idx) => {
              const q = questionsToInsert[idx];
              result.imported++;
              result.details.push({
                index: q.index,
                status: 'imported',
                id: item.id,
                question: q.questionText.substring(0, 50) + '...'
              });
            });
          }
        } catch (err) {
          // Unexpected error, try individual inserts
          console.error('Batch insert error:', err);
          for (const q of questionsToInsert) {
            try {
              const { data: singleData, error: singleError } = await supabase
                .from('questions')
                .insert(q.data)
                .select('id')
                .single();

              if (singleError) {
                result.errors.push(`Pregunta ${q.index + 1}: ${singleError.message}`);
                result.details.push({
                  index: q.index,
                  status: 'error',
                  error: singleError.message,
                  question: q.questionText.substring(0, 50) + '...'
                });
              } else {
                result.imported++;
                result.details.push({
                  index: q.index,
                  status: 'imported',
                  id: singleData?.id,
                  question: q.questionText.substring(0, 50) + '...'
                });
              }
            } catch (singleErr) {
              result.errors.push(`Pregunta ${q.index + 1}: ${singleErr.message}`);
              result.details.push({
                index: q.index,
                status: 'error',
                error: singleErr.message,
                question: q.questionText.substring(0, 50) + '...'
              });
            }
          }
        }
      }

      // Call progress callback
      if (onProgress) {
        onProgress(result.imported, questions.length);
      }
    }
  } else {
    // No duplicate checking - pure bulk insert for maximum performance
    const batches = [];
    for (let i = 0; i < questions.length; i += batchSize) {
      batches.push(questions.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchOffset = batchIndex * batchSize;

      try {
        // Transform all questions in batch
        const supabaseQuestions = batch.map((question, i) => {
          const { id, ...questionWithoutId } = question;
          const transformed = transformQuestionForSupabase(questionWithoutId);
          delete transformed.id;
          return {
            data: transformed,
            index: batchOffset + i,
            questionText: question.reformulated_text || question.question_text
          };
        });

        // Bulk insert entire batch
        const { data, error } = await supabase
          .from('questions')
          .insert(supabaseQuestions.map(q => q.data))
          .select('id');

        if (error) {
          result.errors.push(`Batch ${batchIndex + 1}: ${error.message}`);
          supabaseQuestions.forEach(q => {
            result.details.push({
              index: q.index,
              status: 'error',
              error: error.message,
              question: q.questionText.substring(0, 50) + '...'
            });
          });
        } else {
          data.forEach((item, idx) => {
            const q = supabaseQuestions[idx];
            result.imported++;
            result.details.push({
              index: q.index,
              status: 'imported',
              id: item.id,
              question: q.questionText.substring(0, 50) + '...'
            });
          });
        }
      } catch (err) {
        result.errors.push(`Batch ${batchIndex + 1}: ${err.message}`);
      }

      // Call progress callback
      if (onProgress) {
        onProgress(result.imported, questions.length);
      }
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
