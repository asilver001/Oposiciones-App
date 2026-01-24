import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNavigationStore = create(
  persist(
    (set) => ({
      // Active tab (for bottom nav)
      activeTab: 'inicio',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Modal states
      showPremiumModal: false,
      showSettingsModal: false,
      showProgressModal: false,
      showFeedbackPanel: false,

      togglePremiumModal: () => set((state) => ({ showPremiumModal: !state.showPremiumModal })),
      toggleSettingsModal: () => set((state) => ({ showSettingsModal: !state.showSettingsModal })),
      toggleProgressModal: () => set((state) => ({ showProgressModal: !state.showProgressModal })),
      toggleFeedbackPanel: () => set((state) => ({ showFeedbackPanel: !state.showFeedbackPanel })),

      closePremiumModal: () => set({ showPremiumModal: false }),
      closeSettingsModal: () => set({ showSettingsModal: false }),
      closeProgressModal: () => set({ showProgressModal: false }),
      closeFeedbackPanel: () => set({ showFeedbackPanel: false }),

      // Premium modal trigger context
      premiumModalTrigger: 'general',
      setPremiumModalTrigger: (trigger) => set({ premiumModalTrigger: trigger }),
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({ activeTab: state.activeTab }), // Only persist activeTab
    }
  )
);
