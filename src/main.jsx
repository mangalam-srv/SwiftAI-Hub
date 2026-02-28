import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(

// BrowserRouter
// It allows your app to:
// Change URLs
// Navigate between pages
// Render different components
// Without refreshing the browser
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
