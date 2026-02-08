import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, History, BookOpen, GraduationCap, ClipboardCheck } from 'lucide-react';

/**
 * BottomTabBar - Barra de navegación flotante
 * Extraído de OpositaApp.jsx como parte del refactor FASE 3
 */
export default function BottomTabBar({
  activeTab,
  currentPage,
  isUserReviewer,
  onTabChange,
  onPageChange
}) {
  // State for scroll-based visibility
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // Only trigger if scroll is significant (> 5px)
      if (Math.abs(scrollDiff) < 5) return;

      // Hide on scroll down (when past 100px), show on scroll up
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

  // Tabs base para todos los usuarios
  const baseTabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'actividad', label: 'Actividad', icon: History },
    { id: 'temas', label: 'Temas', icon: BookOpen },
    { id: 'recursos', label: 'Recursos', icon: GraduationCap }
  ];

  // Añadir tab "Revisar" si el usuario es reviewer
  const tabs = isUserReviewer
    ? [...baseTabs, { id: 'reviewer-panel', label: 'Revisar', icon: ClipboardCheck }]
    : baseTabs;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-2"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Contenedor floating con márgenes, sombra y bordes redondeados */}
      <div className="max-w-md mx-auto">
        <nav className="bg-white dark:bg-gray-900 rounded-[20px] shadow-[0_2px_24px_rgba(0,0,0,0.12)] border border-gray-100/80 dark:border-gray-700/80" aria-label="Navegacion principal">
          <div className="flex justify-around items-center h-[58px] px-1" role="tablist">
            {tabs.map(tab => {
              // Para el tab "Revisar" usamos currentPage en lugar de activeTab
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
                        onPageChange('home'); // Salir del reviewer panel al cambiar de tab
                      }
                    }
                  }}
                  className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 px-1.5 rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2"
                >
                  <div className={`
                    flex items-center justify-center w-9 h-9 rounded-full mb-0.5 transition-all duration-200
                    ${isActive ? 'bg-gray-100' : ''}
                  `}>
                    <tab.icon
                      className={`
                        w-[22px] h-[22px] transition-all duration-200
                        ${isActive
                          ? 'text-gray-900 stroke-[2]'
                          : 'text-gray-400 stroke-[1.5]'
                        }
                      `}
                    />
                  </div>
                  <span className={`
                    text-[10px] leading-tight transition-all duration-200
                    ${isActive
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-400 font-medium'
                    }
                  `}>
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
