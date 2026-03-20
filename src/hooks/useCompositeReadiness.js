/**
 * useCompositeReadiness Hook
 *
 * Computes a weighted readiness score for exam preparation:
 *   - Cobertura (30%): % of topics with at least some practice
 *   - Precisión (40%): weighted average accuracy across practiced topics
 *   - Simulacros (30%): average score in simulacro-type sessions
 *
 * Returns the shape expected by ReadinessGauge component.
 */

import { useMemo } from 'react';

const WEIGHTS = { cobertura: 0.3, precision: 0.4, simulacros: 0.3 };

function getLevel(score) {
  if (score >= 80) return 'preparado';
  if (score >= 55) return 'avanzado';
  if (score >= 25) return 'en_progreso';
  return 'inicial';
}

/**
 * @param {Object} params
 * @param {Array} params.fortalezaData - Topic progress from useTopics().getFortalezaData()
 * @param {Object} params.totalStats - From useActivityData()
 * @param {number} params.simulacroAvg - Average simulacro score (0-100)
 * @returns {{ score, breakdown, level }}
 */
export function useCompositeReadiness({ fortalezaData = [], totalStats = {}, simulacroAvg = 0 }) {
  return useMemo(() => {
    // --- Cobertura (30%) ---
    // % of topics where user has answered at least 1 question
    const totalTopics = fortalezaData.length || 1;
    const practicedTopics = fortalezaData.filter(t => (t.answered || 0) > 0).length;
    const cobertura = Math.round((practicedTopics / totalTopics) * 100);

    // --- Precisión por tema (40%) ---
    // Weighted average accuracy across practiced topics
    // Topics with more answers weigh more
    const topicsWithData = fortalezaData.filter(t => (t.answered || 0) > 0);
    let precision = 0;
    if (topicsWithData.length > 0) {
      const totalAnswered = topicsWithData.reduce((sum, t) => sum + (t.answered || 0), 0);
      if (totalAnswered > 0) {
        precision = Math.round(
          topicsWithData.reduce((sum, t) => {
            const weight = (t.answered || 0) / totalAnswered;
            return sum + (t.accuracy || 0) * weight;
          }, 0)
        );
      }
    }

    // --- Simulacros (30%) ---
    // Direct average from simulacro sessions (already 0-100)
    const simulacros = simulacroAvg || 0;

    // --- Composite ---
    const score = Math.round(
      cobertura * WEIGHTS.cobertura +
      precision * WEIGHTS.precision +
      simulacros * WEIGHTS.simulacros
    );

    return {
      score,
      breakdown: { cobertura, precision, simulacros },
      level: getLevel(score),
    };
  }, [fortalezaData, totalStats, simulacroAvg]);
}
