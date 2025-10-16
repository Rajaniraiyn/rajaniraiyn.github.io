import { TooltipProvider } from '@/components/ui/tooltip'
import { MotionProvider } from '@/contexts/motion'
import { TabBarProvider } from '@/contexts/tabbar'
import { ThemeProvider } from '@/contexts/theme'
import { createHashHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

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
                        {children}
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