/**
 * Layouts - Structural components that wrap pages
 *
 * Layouts provide consistent structure across pages:
 * - MainLayout: TopBar + content + BottomTabBar (for authenticated users)
 * - AuthLayout: Centered content, no navigation (login/signup)
 * - OnboardingLayout: Full screen, step-by-step flow
 *
 * Structure:
 * /layouts
 *   /MainLayout
 *     index.jsx
 *     MainLayout.jsx
 *     TopBar.jsx
 *     BottomTabBar.jsx
 *   /AuthLayout
 *     index.jsx
 *   ...
 */

// Layout components
export * from './MainLayout';
