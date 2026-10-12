import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (v2): no third-party requests, no layout shift.
import '@fontsource/syne/600.css'
import '@fontsource/syne/700.css'
import '@fontsource/syne/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App'
import { AppProvider } from './lib/AppContext'

// The hero manages its own scroll position; don't let the browser
// restore a mid-hero offset that would skip the intro gate.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
