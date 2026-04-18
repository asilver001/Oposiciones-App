import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS, REVIEWER_NAV_ITEM } from '../../config/navigation';

/**
 * BottomTabBar - Full-width bottom navigation for mobile viewports.
 * Auto-hides on scroll down, reappears on scroll up.
 */
export default function BottomTabBar({
  activeTab,
  currentPage,
  isUserReviewer,
  onTabChange,
  onPageChange
}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      if (Math.abs(scrollDiff) < 5) return;

      if (scrollDiff > 0 && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = isUserReviewer
    ? [...NAV_ITEMS, REVIEWER_NAV_ITEM]
    : NAV_ITEMS;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ background: '#F3F3F0', borderTop: '1px solid rgba(27,67,50,0.12)' }}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="max-w-md mx-auto">
        <nav aria-label="Navegacion principal">
          <div className="flex justify-around items-center h-[58px] px-1" role="tablist">
            {tabs.map(tab => {
              const isActive = tab.id === 'reviewer-panel'
                ? currentPage === 'reviewer-panel'
                : activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${tab.label}${isActive ? ' (activo)' : ''}`}
                  onClick={() => {
                    if (tab.id === 'reviewer-panel') {
                      onPageChange('reviewer-panel');
                    } else {
                      onTabChange(tab.id);
                      if (currentPage === 'reviewer-panel') {
                        onPageChange('home');
                      }
                    }
                  }}
                  className="relative flex flex-col items-center justify-center min-w-[3.5rem] py-1 px-1.5 transition-all duration-200"
                >
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#1B4332' }}
                    />
                  )}

                  <div className="flex items-center justify-center w-9 h-9 mb-0.5">
                    <tab.icon
                      className="w-[22px] h-[22px] transition-all duration-200"
                      style={{
                        color: isActive ? '#1B4332' : '#8A8783',
                        strokeWidth: isActive ? 2 : 1.5,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] leading-tight transition-all duration-200"
                    style={{
                      color: isActive ? '#1B4332' : '#8A8783',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </motion.div>
  );
}
