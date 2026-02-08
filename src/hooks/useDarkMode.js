import { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';

/**
 * useDarkMode - Manages dark mode class on <html> based on user preference.
 * Supports 'system', 'light', and 'dark' modes.
 */
export function useDarkMode() {
  const darkMode = useUserStore((s) => s.darkMode);
  const setDarkMode = useUserStore((s) => s.setDarkMode);

  useEffect(() => {
    const root = document.documentElement;

    function applyMode(mode) {
      if (mode === 'dark') {
        root.classList.add('dark');
      } else if (mode === 'light') {
        root.classList.remove('dark');
      } else {
        // system mode - follow OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }

    applyMode(darkMode);

    // Listen for OS preference changes when in system mode
    if (darkMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
