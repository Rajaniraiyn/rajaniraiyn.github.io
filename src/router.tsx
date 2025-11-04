import { TooltipProvider } from '@/components/ui/tooltip'
import { GameProvider } from '@/contexts/game'
import { MotionProvider } from '@/contexts/motion'
import { TabBarProvider } from '@/contexts/tabbar'
import { ThemeProvider } from '@/contexts/theme'
import { createHashHistory, createRouter } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { routeTree } from './routeTree.gen'

const LazyToastProvider = lazy(() => import('@/components/ui/toast').then(module => ({ default: module.ToastProvider })))

export function getRouter() {
    const router = createRouter({
        history: createHashHistory(),
        routeTree,
        defaultPreload: 'intent',
        scrollRestoration: true,
        Wrap: ({ children }) => (
            <ThemeProvider>
                <TooltipProvider>
                    <MotionProvider>
                        <GameProvider>
                            {children}
                            <Suspense>
                                <LazyToastProvider position="bottom-center" />
                            </Suspense>
                        </GameProvider>
                    </MotionProvider>
                </TooltipProvider>
                <TabBarProvider />
            </ThemeProvider>
        )
    })

    return router
}


declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}