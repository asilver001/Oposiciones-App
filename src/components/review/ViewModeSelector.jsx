import { LayoutGrid, List, FileText } from 'lucide-react';

/**
 * ViewModeSelector - Toggle between Individual, Grid, and List views
 */
export default function ViewModeSelector({ viewMode, onViewModeChange, totalItems, currentPage, itemsPerPage }) {
  const modes = [
    { id: 'individual', label: 'Individual', icon: FileText, shortcut: '1' },
    { id: 'grid', label: 'Grid', icon: LayoutGrid, shortcut: '2' },
    { id: 'list', label: 'Lista', icon: List, shortcut: '3' },
  ];

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Vista:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {modes.map(mode => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }
                `}
                title={`${mode.label} [${mode.shortcut}]`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && viewMode !== 'individual' && (
        <div className="text-sm text-gray-500">
          Mostrando <span className="font-medium text-gray-700">{startItem}-{endItem}</span> de{' '}
          <span className="font-medium text-gray-700">{totalItems}</span>
        </div>
      )}
    </div>
  );
}
