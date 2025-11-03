import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { useStorage } from '@/hooks/use-storage'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const LazySmoothScroll = lazy(() => import('@/components/smooth-scroll').then(module => ({ default: module.SmoothScroll })))

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [savedWallpaper] = useStorage<string | null>('favorite-wallpaper', { defaultValue: null })

  return (
    <div className='flex flex-row min-h-screen gap-1'>
      <Sidebar className='hidden' />
      <div className='flex-1 space-y-5'>
        <Header className='sticky inset-0 bottom-auto z-50 mb-0' />
        <main className='max-w-3xl mx-auto'>
          <Outlet />
        </main>
        <Footer />
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
