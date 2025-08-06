import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Problem2 from './Problem2.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Problem2 />
  </StrictMode>
)
