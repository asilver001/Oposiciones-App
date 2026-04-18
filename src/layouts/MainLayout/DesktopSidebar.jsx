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
  user,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const items = isUserReviewer ? [...NAV_ITEMS, REVIEWER_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside
      className={`
        flex flex-col h-dvh
        transition-[width] duration-200 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
      style={{
        background: '#F3F3F0',
        borderRight: '1px solid rgba(27,67,50,0.12)',
      }}
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

      {/* Navigation items — Editorial Calma style */}
      <nav className="flex-1 px-2 py-2" aria-label="Navegacion principal">
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5
                transition-colors duration-150
                ${collapsed ? 'justify-center' : ''}
              `}
              style={{
                color: isActive ? '#1B4332' : '#8A8783',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '2px solid #1B4332' : '2px solid transparent',
                marginLeft: collapsed ? 0 : '-12px',
                paddingLeft: collapsed ? '12px' : '12px',
                letterSpacing: '0.2px',
              }}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.6} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: Avatar + Settings */}
      <div
        className="px-2 pb-4 pt-2 mt-2 space-y-1"
        style={{ borderTop: '1px solid rgba(27,67,50,0.12)' }}
      >
        {/* User avatar */}
        {user && (
          <div
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-md
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
              style={{ background: '#2D6A4F' }}
            >
              {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <span className="text-sm text-[#4B5563] truncate">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario'}
              </span>
            )}
          </div>
        )}
        <button
          onClick={onOpenSettings}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-md
            text-[#B5B3AF] hover:bg-[rgba(27,67,50,0.04)] hover:text-gray-700
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
