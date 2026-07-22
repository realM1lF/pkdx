import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './styles/cursor.css'
import './i18n'
import App from './App.tsx'
import CustomCursor from './components/CustomCursor.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <CustomCursor />
  </BrowserRouter>,
)
