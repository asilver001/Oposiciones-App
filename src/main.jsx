import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './storage.js'
import OpositaApp from './OpositaApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OpositaApp />
  </StrictMode>,
)
