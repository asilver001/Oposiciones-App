import { create } from 'zustand';

export const useStudyStore = create((set, get) => ({
  // Current test state
  currentQuestion: 0,
  selectedAnswer: null,
  answers: {},
  showExplanation: false,
  timeElapsed: 0,
  testResults: null,
  showExitConfirm: false,

  // Questions for current session
  questions: [],
  setQuestions: (questions) => set({ questions }),

  // Navigation
  setCurrentQuestion: (index) => set({ currentQuestion: index }),
  nextQuestion: () => set((state) => ({
    currentQuestion: state.currentQuestion + 1,
    selectedAnswer: null,
    showExplanation: false,
  })),
  previousQuestion: () => set((state) => ({
    currentQuestion: Math.max(0, state.currentQuestion - 1),
    selectedAnswer: null,
    showExplanation: false,
  })),

  // Answer management
  selectAnswer: (answer) => set({ selectedAnswer: answer }),
  submitAnswer: () => {
    const { currentQuestion, selectedAnswer, questions, answers } = get();
    const question = questions[currentQuestion];

    set({
      answers: {
        ...answers,
        [currentQuestion]: {
          selected: selectedAnswer,
          correct: selectedAnswer === question.correct,
          timestamp: Date.now(),
        }
      },
      showExplanation: true,
    });
  },

  // Explanation toggle
  toggleExplanation: () => set((state) => ({
    showExplanation: !state.showExplanation
  })),

  // Time tracking
  incrementTime: () => set((state) => ({ timeElapsed: state.timeElapsed + 1 })),
  resetTime: () => set({ timeElapsed: 0 }),

  // Test completion
  completeTest: () => {
    const { answers, timeElapsed } = get();
    const total = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.correct).length;

    set({
      testResults: {
        total,
        correct,
        incorrect: total - correct,
        percentage: (correct / total) * 100,
        timeElapsed,
      }
    });
  },

  // Exit confirmation
  toggleExitConfirm: () => set((state) => ({
    showExitConfirm: !state.showExitConfirm
  })),

  // Reset session
  resetSession: () => set({
    currentQuestion: 0,
    selectedAnswer: null,
    answers: {},
    showExplanation: false,
    timeElapsed: 0,
    testResults: null,
    showExitConfirm: false,
    questions: [],
  }),
}));
