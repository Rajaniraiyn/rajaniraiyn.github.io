import { createContext, useContext } from "react"

type ResolvedTheme = "dark" | "light"

type Theme = "system" | ResolvedTheme

export type ThemeProviderState = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const INITIAL_STATE: ThemeProviderState = { theme: "system", resolvedTheme: "light", setTheme: () => null }

export const ThemeProviderContext = createContext<ThemeProviderState>(INITIAL_STATE)

export function useTheme() {
    const context = useContext(ThemeProviderContext)

    if (context === undefined || context === INITIAL_STATE)
        throw new Error(`${useTheme.name} must be used within a ThemeProvider`)

    return context
}
