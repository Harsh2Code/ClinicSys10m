import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './lib/MessageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MessageProvider>
      <App />
    </MessageProvider>
  </StrictMode>,
)
