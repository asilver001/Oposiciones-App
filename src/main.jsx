import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import './lib/storage.js'
import { initErrorTracking } from './lib/errorTracking.js'
import { AppRouter } from './router'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'

// Initialize global error tracking
initErrorTracking()

// Legacy fallback: set localStorage.setItem('USE_LEGACY_ROUTER', 'true') to use old OpositaApp
const USE_LEGACY = localStorage.getItem('USE_LEGACY_ROUTER') === 'true'
const OpositaApp = lazy(() => import('./OpositaApp.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        {USE_LEGACY ? (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse text-brand-600">Cargando...</div></div>}>
            <OpositaApp />
          </Suspense>
        ) : (
          <AppRouter />
        )}
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
