import '@/styles/globals.css' with { type: 'tailwindcss' }

import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getRouter } from './router'

const router = getRouter();

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement, { identifierPrefix: 'raj-' }).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

