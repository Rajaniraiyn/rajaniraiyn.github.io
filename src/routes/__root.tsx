import { useStorage } from '@/hooks/use-storage'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const LazyHeader = lazy(() => import('@/components/header').then(module => ({ default: module.Header })))
const LazyFooter = lazy(() => import('@/components/footer').then(module => ({ default: module.Footer })))
const LazySmoothScroll = lazy(() => import('@/components/smooth-scroll').then(module => ({ default: module.SmoothScroll })))

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [savedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

  return (
    <div className='flex flex-row min-h-screen gap-1'>
      <div className='flex-1 space-y-5'>
        <Suspense>
          <LazyHeader className='sticky inset-0 bottom-auto z-50 mb-0' />
        </Suspense>
        <main className='max-w-3xl mx-auto'>
          <Outlet />
        </main>
        <Suspense>
          <LazyFooter />
        </Suspense>
      </div>
      <Suspense>
        <LazySmoothScroll />
      </Suspense>

      {savedWallpaper && <img
        src={savedWallpaper}
        alt="Saved Wallpaper"
        className="absolute inset-0 size-full -z-10 object-cover opacity-25"
        style={{ imageRendering: 'pixelated' }}
      />}
    </div>
  )
}
