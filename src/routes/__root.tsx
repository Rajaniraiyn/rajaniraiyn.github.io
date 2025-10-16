import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className='flex flex-row min-h-screen gap-1'>
      <Sidebar className='hidden' />
      <div className='flex-1 space-y-5'>
        <main className='max-w-3xl mx-auto'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
