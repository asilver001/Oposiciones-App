import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { NAV_ITEMS, REVIEWER_NAV_ITEM } from '../../config/navigation';
import { ROUTES } from '../../router/paths';

/**
 * DesktopSidebar - Persistent sidebar for desktop viewports (>=1024px).
 * Matches Linear/Notion pattern: logo + nav items + settings at bottom.
 * Collapsible to icon-only mode.
 */
export default function DesktopSidebar({
  isUserReviewer,
  dailyProgressPercent,
  onOpenSettings,
  onOpenProgress,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const items = isUserReviewer ? [...NAV_ITEMS, REVIEWER_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside
      className={`
        flex flex-col h-dvh bg-white border-r border-gray-100
        transition-[width] duration-200 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Header: Logo */}
      <div className="px-4 pt-8 pb-2 mb-6">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="text-lg mx-auto block"
            aria-label="Expandir sidebar"
          >🎓</button>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tracking-[-0.02em] text-gray-900 px-1">
              🎓 Oposita Smart
            </span>
            <button
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 shrink-0"
              aria-label="Colapsar sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Daily progress bar */}
      {!collapsed && dailyProgressPercent > 0 && (
        <div className="px-4 pb-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyProgressPercent}%`, background: '#2D6A4F' }}
            />
          </div>
          <p className="text-[11px] mt-1" style={{ color: '#B5B3AF' }}>{dailyProgressPercent}% de tu meta diaria</p>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5" aria-label="Navegacion principal">
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                transition-colors duration-150
                ${isActive
                  ? 'bg-[rgba(45,106,79,0.08)] text-[#2D6A4F] font-semibold'
                  : 'text-[#4B5563] hover:bg-[#FAFAF7] hover:text-gray-700'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: Settings */}
      <div className="px-2 pb-4 pt-2">
        <button
          onClick={onOpenSettings}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-md
            text-[#B5B3AF] hover:bg-[#FAFAF7] hover:text-gray-700
            transition-colors duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Ajustes' : undefined}
        >
          <Settings size={18} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span className="text-sm">Ajustes</span>}
        </button>
      </div>
    </aside>
  );
}
