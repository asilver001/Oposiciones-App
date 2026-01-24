import { Outlet } from 'react-router-dom';

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-purple-50">
      <Outlet />
    </div>
  );
}
