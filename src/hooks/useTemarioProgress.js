/**
 * useTemarioProgress — Adapts useTopics data for the Temario graph visualizations.
 * Returns userProgress + questionCounts in the shape that temarioData.js expects.
 */

import { useMemo } from 'react';
import { useTopics } from './useTopics';

export function useTemarioProgress() {
  const { topics, userProgress, loading, error } = useTopics();

  // Build questionCounts map: topicNumber -> count
  const questionCounts = useMemo(() => {
    const counts = {};
    topics.forEach(t => {
      if (t.number != null) {
        counts[t.number] = (counts[t.number] || 0) + (t.questionCount || 0);
      }
    });
    return counts;
  }, [topics]);

  return { userProgress, questionCounts, topics, loading, error };
}

export default useTemarioProgress;
