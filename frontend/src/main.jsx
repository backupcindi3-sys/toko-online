import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactGA from 'react-ga4'

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
