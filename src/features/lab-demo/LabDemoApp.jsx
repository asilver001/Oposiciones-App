import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LabDemoProvider } from './context/LabDemoContext';
import { LandingPage, OrderWizard, Dashboard, TrackOrder } from './pages';

/**
 * Lab Demo App
 * Standalone demo portal for Picto Dent dental laboratory
 * Routes:
 * - /lab-demo - Landing page
 * - /lab-demo/order - Order wizard
 * - /lab-demo/dashboard - Lab dashboard (requires login)
 * - /lab-demo/track - Order tracking
 */

function LabDemoRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/order')) return 'order';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/track')) return 'track';
    return 'landing';
  };

  // Handle navigation using React Router
  const handleNavigate = (page) => {
    const basePath = '/lab-demo';
    switch (page) {
      case 'order':
        navigate(`${basePath}/order`);
        break;
      case 'dashboard':
        navigate(`${basePath}/dashboard`);
        break;
      case 'track':
        navigate(`${basePath}/track`);
        break;
      default:
        navigate(basePath);
    }
  };

  // Render current page
  const currentPage = getCurrentPage();

  switch (currentPage) {
    case 'order':
      return <OrderWizard onNavigate={handleNavigate} />;
    case 'dashboard':
      return <Dashboard onNavigate={handleNavigate} />;
    case 'track':
      return <TrackOrder onNavigate={handleNavigate} />;
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

export default function LabDemoApp() {
  return (
    <LabDemoProvider>
      <LabDemoRouter />
    </LabDemoProvider>
  );
}
