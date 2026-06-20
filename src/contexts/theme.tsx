import { useMediaQuery } from "@/hooks/use-media-query"
import { useStorage } from "@/hooks/use-storage"
import { ThemeProviderContext, type ThemeProviderState } from "@/contexts/use-theme"
import { useEffect } from "react"

type ResolvedTheme = "dark" | "light"

type Theme = "system" | ResolvedTheme

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ui-theme",
}: React.PropsWithChildren<{ defaultTheme?: Theme; storageKey?: string }>) {
    const [theme, setTheme] = useStorage<Theme>(storageKey, { defaultValue: defaultTheme })

    const isSystemDark = useMediaQuery("(prefers-color-scheme: dark)")

    const resolvedTheme = theme === "system" ? isSystemDark ? "dark" : "light" : theme

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        root.classList.add(resolvedTheme)
    }, [resolvedTheme])

    const value: ThemeProviderState = {
        theme,
        resolvedTheme,
        setTheme,
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}
