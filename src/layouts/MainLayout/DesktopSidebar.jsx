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
      {/* Header: Logo + collapse toggle */}
      <div className="flex items-center h-14 px-3 border-b border-gray-50">
        <button
          onClick={onOpenProgress}
          className="flex items-center gap-2.5 min-w-0 flex-1"
          aria-label="Ver progreso diario"
        >
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-lg">🎓</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 truncate">
              Oposita Smart
            </span>
          )}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 shrink-0"
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Daily progress bar */}
      <div className="px-3 pt-3 pb-1">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>
        {!collapsed && (
          <p className="text-[11px] text-gray-400 mt-1">{dailyProgressPercent}% de tu meta diaria</p>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5" aria-label="Navegacion principal">
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-2.5 py-2 rounded-lg
                transition-colors duration-150
                ${isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: Settings */}
      <div className="px-2 pb-3 pt-2 border-t border-gray-50 space-y-0.5">
        <button
          onClick={onOpenSettings}
          className={`
            w-full flex items-center gap-3 px-2.5 py-2 rounded-lg
            text-gray-500 hover:bg-gray-50 hover:text-gray-700
            transition-colors duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Ajustes' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0 stroke-[1.5]" />
          {!collapsed && <span className="text-sm">Ajustes</span>}
        </button>
      </div>
    </aside>
  );
}
