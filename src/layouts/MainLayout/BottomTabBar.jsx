import { Home, BookOpen, Trophy, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'temas', label: 'Temas', icon: BookOpen, path: '/temas' },
    { id: 'actividad', label: 'Actividad', icon: BarChart3, path: '/activity' },
    { id: 'recursos', label: 'Recursos', icon: Trophy, path: '/recursos' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-4xl mx-auto px-2 h-20 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
