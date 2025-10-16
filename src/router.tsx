import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/contexts/theme'
import { createHashHistory, createRouter } from '@tanstack/react-router'
import { MotionProvider } from './contexts/motion'
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