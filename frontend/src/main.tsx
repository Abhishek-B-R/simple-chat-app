import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <div className='min-h-screen w-screen bg-gray-900 text-sky-50'>
    <App />
  </div>,
)
