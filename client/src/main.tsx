/**
 * React entry point.
 * Mounts the main React application on the DOM root element in StrictMode.
 *
 * @author akshatnathani
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
