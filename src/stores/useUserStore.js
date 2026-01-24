import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // User profile data
      userData: {
        name: '',
        email: '',
        examDate: '',
        dailyGoal: 15,
        dailyGoalMinutes: 15,
        accountCreated: false,
        oposicion: '',
      },
      setUserData: (data) => set((state) => ({
        userData: { ...state.userData, ...data }
      })),

      // Streak data
      streakData: {
        current: 0,
        longest: 0,
        lastCompletedDate: null,
      },
      setStreakData: (data) => set((state) => ({
        streakData: { ...state.streakData, ...data }
      })),

      // Daily tests count
      dailyTestsCount: 0,
      incrementDailyTests: () => set((state) => ({
        dailyTestsCount: state.dailyTestsCount + 1
      })),
      resetDailyTests: () => set({ dailyTestsCount: 0 }),

      // Premium status
      isPremium: false,
      setPremium: (value) => set({ isPremium: value }),

      // Total stats
      totalStats: {
        totalQuestions: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
      },
      updateTotalStats: (stats) => set((state) => ({
        totalStats: { ...state.totalStats, ...stats }
      })),

      // Onboarding completion
      onboardingComplete: false,
      completeOnboarding: () => set({ onboardingComplete: true }),

      // Reset all user data
      resetUserData: () => set({
        userData: { name: '', email: '', examDate: '', dailyGoal: 15, dailyGoalMinutes: 15, accountCreated: false, oposicion: '' },
        streakData: { current: 0, longest: 0, lastCompletedDate: null },
        dailyTestsCount: 0,
        isPremium: false,
        totalStats: { totalQuestions: 0, correctAnswers: 0, totalTimeSpent: 0 },
        onboardingComplete: false,
      }),
    }),
    {
      name: 'user-storage',
    }
  )
);
