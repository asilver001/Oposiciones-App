/**
 * Question Validator
 * Validates question format before importing to Supabase
 */

// Valid values for validation
const VALID_TIERS = ['free', 'premium'];
const VALID_DIFFICULTIES = [1, 2, 3, 4, 5];
const VALID_MATERIAS = ['constitucion', 'administrativo', 'laboral', 'penal', 'civil', 'organizacion', 'procedimiento', 'otros'];

/**
 * Validate a single question
 * @param {Object} question - Question object to validate
 * @param {number} index - Index in the array (for error messages)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuestion(question, index = 0) {
  const errors = [];
  const prefix = `Pregunta ${index + 1}`;

  // Required fields
  if (!question.question_text || typeof question.question_text !== 'string') {
    errors.push(`${prefix}: 'question_text' es obligatorio y debe ser texto`);
  } else if (question.question_text.trim().length < 10) {
    errors.push(`${prefix}: 'question_text' es demasiado corto (mínimo 10 caracteres)`);
  }

  // Options validation
  if (!question.options || !Array.isArray(question.options)) {
    errors.push(`${prefix}: 'options' es obligatorio y debe ser un array`);
  } else {
    if (question.options.length !== 4) {
      errors.push(`${prefix}: Debe tener exactamente 4 opciones, tiene ${question.options.length}`);
    }

    const correctCount = question.options.filter(opt => opt.is_correct === true).length;
    if (correctCount === 0) {
      errors.push(`${prefix}: Debe haber exactamente 1 opción correcta, no hay ninguna`);
    } else if (correctCount > 1) {
      errors.push(`${prefix}: Debe haber exactamente 1 opción correcta, hay ${correctCount}`);
    }

    question.options.forEach((opt, optIndex) => {
      if (!opt.text || typeof opt.text !== 'string') {
        errors.push(`${prefix}, Opción ${optIndex + 1}: 'text' es obligatorio`);
      }
      if (typeof opt.is_correct !== 'boolean') {
        errors.push(`${prefix}, Opción ${optIndex + 1}: 'is_correct' debe ser true o false`);
      }
    });
  }

  // Explanation (optional but recommended)
  if (question.explanation && typeof question.explanation !== 'string') {
    errors.push(`${prefix}: 'explanation' debe ser texto`);
  }

  // Legal reference (optional)
  if (question.legal_reference && typeof question.legal_reference !== 'string') {
    errors.push(`${prefix}: 'legal_reference' debe ser texto`);
  }

  // Tema (required)
  if (question.tema === undefined || question.tema === null) {
    errors.push(`${prefix}: 'tema' es obligatorio`);
  } else if (!Number.isInteger(question.tema) || question.tema < 1) {
    errors.push(`${prefix}: 'tema' debe ser un número entero positivo`);
  }

  // Materia (optional, validated if present)
  if (question.materia && !VALID_MATERIAS.includes(question.materia)) {
    errors.push(`${prefix}: 'materia' debe ser uno de: ${VALID_MATERIAS.join(', ')}`);
  }

  // Difficulty (optional, validated if present)
  if (question.difficulty !== undefined) {
    if (!VALID_DIFFICULTIES.includes(question.difficulty)) {
      errors.push(`${prefix}: 'difficulty' debe ser 1, 2, 3, 4 o 5`);
    }
  }

  // Confidence score (optional, validated if present)
  if (question.confidence_score !== undefined) {
    if (typeof question.confidence_score !== 'number' || question.confidence_score < 0 || question.confidence_score > 1) {
      errors.push(`${prefix}: 'confidence_score' debe ser un número entre 0 y 1`);
    }
  }

  // Tier (optional, validated if present)
  if (question.tier && !VALID_TIERS.includes(question.tier)) {
    errors.push(`${prefix}: 'tier' debe ser 'free' o 'premium'`);
  }

  // Source year (optional, validated if present)
  if (question.source_year !== undefined) {
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(question.source_year) || question.source_year < 1978 || question.source_year > currentYear + 1) {
      errors.push(`${prefix}: 'source_year' debe ser un año válido (1978-${currentYear + 1})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate an array of questions
 * @param {Object[]} questions - Array of question objects
 * @returns {Object} { valid: boolean, validQuestions: Object[], errors: string[], summary: Object }
 */
export function validateQuestions(questions) {
  if (!questions || !Array.isArray(questions)) {
    return {
      valid: false,
      validQuestions: [],
      errors: ['El JSON debe contener un array de preguntas'],
      summary: { total: 0, valid: 0, invalid: 0 }
    };
  }

  if (questions.length === 0) {
    return {
      valid: false,
      validQuestions: [],
      errors: ['El array de preguntas está vacío'],
      summary: { total: 0, valid: 0, invalid: 0 }
    };
  }

  const allErrors = [];
  const validQuestions = [];

  questions.forEach((question, index) => {
    const result = validateQuestion(question, index);
    if (result.valid) {
      validQuestions.push(question);
    } else {
      allErrors.push(...result.errors);
    }
  });

  return {
    valid: allErrors.length === 0,
    validQuestions,
    errors: allErrors,
    summary: {
      total: questions.length,
      valid: validQuestions.length,
      invalid: questions.length - validQuestions.length
    }
  };
}

/**
 * Parse JSON input and validate
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} { valid: boolean, data: Object|null, errors: string[] }
 */
export function parseAndValidateJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    // Accept both { questions: [...] } and direct array [...]
    const questions = data.questions || (Array.isArray(data) ? data : null);

    if (!questions) {
      return {
        valid: false,
        data: null,
        errors: ['El JSON debe ser un array de preguntas o un objeto con propiedad "questions"']
      };
    }

    const validation = validateQuestions(questions);

    return {
      valid: validation.valid,
      data: { questions: validation.validQuestions },
      errors: validation.errors,
      summary: validation.summary
    };
  } catch (e) {
    return {
      valid: false,
      data: null,
      errors: [`Error al parsear JSON: ${e.message}`],
      summary: { total: 0, valid: 0, invalid: 0 }
    };
  }
}

/**
 * Transform question from import format to Supabase format
 * @param {Object} question - Question in import format
 * @returns {Object} Question in Supabase format
 */
export function transformQuestionForSupabase(question) {
  // Find the correct answer index
  const correctIndex = question.options.findIndex(opt => opt.is_correct);

  return {
    question_text: question.question_text.trim(),
    option_a: question.options[0]?.text || '',
    option_b: question.options[1]?.text || '',
    option_c: question.options[2]?.text || '',
    option_d: question.options[3]?.text || '',
    correct_answer: ['a', 'b', 'c', 'd'][correctIndex] || 'a',
    explanation: question.explanation || null,
    legal_reference: question.legal_reference || null,
    tema: question.tema,
    materia: question.materia || 'otros',
    difficulty: question.difficulty || 3,
    source: question.source || 'manual_import',
    source_year: question.source_year || null,
    confidence_score: question.confidence_score || 0.8,
    tier: question.tier || 'free',
    validation_status: 'human_pending',
    is_active: true,
    times_shown: 0,
    times_correct: 0,
    created_at: new Date().toISOString()
  };
}

export default {
  validateQuestion,
  validateQuestions,
  parseAndValidateJSON,
  transformQuestionForSupabase
};
