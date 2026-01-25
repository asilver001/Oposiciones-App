import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './storage.js'
import OpositaApp from './OpositaApp.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <OpositaApp />
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
