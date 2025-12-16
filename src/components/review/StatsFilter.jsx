import { Clock, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';

/**
 * StatsFilter - Clickable stats cards that act as filters
 */
export default function StatsFilter({ stats, activeFilter, onFilterChange }) {
  const filters = [
    {
      id: 'pending',
      label: 'Pendientes',
      count: stats?.pending || 0,
      icon: Clock,
      activeClass: 'bg-amber-500 border-amber-600 text-white',
      inactiveClass: 'bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
    },
    {
      id: 'approved',
      label: 'Aprobadas',
      count: stats?.approved || 0,
      icon: CheckCircle,
      activeClass: 'bg-green-500 border-green-600 text-white',
      inactiveClass: 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
    },
    {
      id: 'rejected',
      label: 'Rechazadas',
      count: stats?.rejected || 0,
      icon: XCircle,
      activeClass: 'bg-red-500 border-red-600 text-white',
      inactiveClass: 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
    },
    {
      id: 'refresh',
      label: 'Reformular',
      count: stats?.needsRefresh || 0,
      icon: RefreshCw,
      activeClass: 'bg-orange-500 border-orange-600 text-white',
      inactiveClass: 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(filter => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              flex-1 min-w-[100px] max-w-[150px] p-3 rounded-xl border-2
              transition-all duration-200 cursor-pointer
              ${isActive ? filter.activeClass : filter.inactiveClass}
            `}
          >
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums">
                {filter.count}
              </div>
              <div className={`text-xs flex items-center justify-center gap-1 ${isActive ? 'opacity-90' : 'opacity-70'}`}>
                <Icon className="w-3 h-3" />
                {filter.label}
              </div>
            </div>
          </button>
        );
      })}

      {/* Total (not clickable, just info) */}
      <div className="flex-1 min-w-[100px] max-w-[150px] p-3 rounded-xl border-2 border-gray-100 bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold tabular-nums text-gray-600">
            {stats?.total || 0}
          </div>
          <div className="text-xs flex items-center justify-center gap-1 text-gray-500">
            <FileText className="w-3 h-3" />
            Total
          </div>
        </div>
      </div>
    </div>
  );
}
