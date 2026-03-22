import { useUserStore } from '../stores/useUserStore';

const FREE_QUESTION_LIMIT = 100;
const LOCKED_FEATURES = ['simulacro', 'flashcards', 'detailed-stats'];

export function usePremium() {
  const isPremium = useUserStore((s) => s.isPremium);
  const questionsUsed = useUserStore((s) => s.questionsUsed);

  return {
    isPremium,
    questionsUsed,
    questionsRemaining: Math.max(0, FREE_QUESTION_LIMIT - questionsUsed),
    canStudy: isPremium || questionsUsed < FREE_QUESTION_LIMIT,
    isFeatureLocked: (feature) => !isPremium && LOCKED_FEATURES.includes(feature),
    FREE_QUESTION_LIMIT,
  };
}
