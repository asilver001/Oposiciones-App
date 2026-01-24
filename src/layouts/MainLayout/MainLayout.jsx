import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomTabBar from './BottomTabBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <main className="pt-16 pb-24 px-4 max-w-4xl mx-auto">
        <Outlet />
      </main>

      <BottomTabBar />
    </div>
  );
}
