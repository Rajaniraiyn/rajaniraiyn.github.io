import { useMediaQuery } from "@/hooks/use-media-query"
import { useStorage } from "@/hooks/use-storage"
import { createContext, useContext, useEffect } from "react"

type ResolvedTheme = "dark" | "light"

type Theme = "system" | ResolvedTheme


type ThemeProviderState = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const INITIAL_STATE: ThemeProviderState = { theme: "system", resolvedTheme: "light", setTheme: () => null }

const ThemeProviderContext = createContext<ThemeProviderState>(INITIAL_STATE)

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

    return (
        <ThemeProviderContext.Provider
            value={{
                theme,
                resolvedTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined || context === INITIAL_STATE)
        throw new Error(`${useTheme.name} must be used within a ${ThemeProvider.name}`)

    return context
}