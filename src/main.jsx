import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import './lib/storage.js'
import { initErrorTracking } from './lib/errorTracking.js'
import { AppRouter } from './router'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'
import { ThemeProvider } from './styles/ThemeContext.jsx'

// Initialize global error tracking
initErrorTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <AppRouter />
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
