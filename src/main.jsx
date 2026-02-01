import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/storage.js'
import OpositaApp from './OpositaApp.jsx'
import { AppRouter } from './router'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'

// Feature flag: set localStorage.setItem('USE_APP_ROUTER', 'true') to test new router
const USE_APP_ROUTER = localStorage.getItem('USE_APP_ROUTER') === 'true'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        {USE_APP_ROUTER ? <AppRouter /> : <OpositaApp />}
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
