import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useUserStore } from '@stores';

// Layouts
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';
import OnboardingLayout from '@layouts/OnboardingLayout';
import MinimalLayout from '@layouts/MinimalLayout';

// Pages
import {
  HomePage,
  StudyPage,
  ActivityPage,
  TemasPage,
  RecursosPage,
} from '@pages';

import {
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
} from '@pages/AuthPage';

import OnboardingPage from '@pages/OnboardingPage';
import AdminPage from '@pages/AdminPage';

import {
  PrivacyPage,
  TermsPage,
  AboutPage,
  FAQPage,
} from '@pages/LegalPage';

/**
 * ProtectedRoute - Requires user authentication
 * Redirects to /login if not authenticated
 * Redirects to /onboarding if not completed
 */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

/**
 * AdminRoute - Requires admin authentication
 * Redirects to /admin/login if not authenticated as admin
 */
function AdminRoute({ children }) {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/**
 * OnboardingRoute - Only accessible if authenticated but not onboarded
 * Redirects authenticated+onboarded users to home
 * Redirects unauthenticated users to login
 */
function OnboardingRoute({ children }) {
  const { user } = useAuth();
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * AuthRoute - Only accessible if NOT authenticated
 * Redirects authenticated users to home or onboarding
 */
function AuthRoute({ children }) {
  const { user } = useAuth();
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);

  if (user) {
    if (!onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter basename="/Oposiciones-App">
      <Routes>
        {/* Auth Routes (AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUpPage />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPasswordPage />
              </AuthRoute>
            }
          />
        </Route>

        {/* Onboarding Route (OnboardingLayout) */}
        <Route element={<OnboardingLayout />}>
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <OnboardingPage />
              </OnboardingRoute>
            }
          />
        </Route>

        {/* Main App Routes (MainLayout) */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/temas"
            element={
              <ProtectedRoute>
                <TemasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recursos"
            element={
              <ProtectedRoute>
                <RecursosPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Legal Routes (MinimalLayout) */}
        <Route element={<MinimalLayout />}>
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
