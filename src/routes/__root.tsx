import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const LazySmoothScroll = lazy(() => import('@/components/smooth-scroll').then(module => ({ default: module.SmoothScroll })))

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className='flex flex-row min-h-screen gap-1'>
      <Sidebar className='hidden' />
      <div className='flex-1 space-y-5'>
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <Suspense>
        <LazySmoothScroll />
      </Suspense>
    </div>
  )
}
