import { createContext, useContext } from "react"

export interface ThemeContextType {
  dark: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used inside ThemeContext.Provider")
  }
  return context
}
