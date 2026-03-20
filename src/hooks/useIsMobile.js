import { useState, useEffect } from 'react';

/**
 * Detects if viewport is below the given breakpoint.
 * Uses window.matchMedia for efficient, event-driven updates.
 *
 * @param {number} breakpoint - Width threshold in px (default 1024 = Tailwind lg)
 * @returns {boolean} true if viewport < breakpoint
 */
export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);

    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}
