"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useTenantContext } from "./tenant-context"

interface ThemeContextType {
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  tenantName: string
  updateTheme: (colors: { primary: string; secondary: string }) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { tenant } = useTenantContext()
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#1e40af")

  useEffect(() => {
    if (tenant) {
      setPrimaryColor(tenant.primary_color)
      setSecondaryColor(tenant.secondary_color)

      // Apply CSS custom properties for dynamic theming
      document.documentElement.style.setProperty("--primary-color", tenant.primary_color)
      document.documentElement.style.setProperty("--secondary-color", tenant.secondary_color)
    }
  }, [tenant])

  const updateTheme = (colors: { primary: string; secondary: string }) => {
    setPrimaryColor(colors.primary)
    setSecondaryColor(colors.secondary)
    document.documentElement.style.setProperty("--primary-color", colors.primary)
    document.documentElement.style.setProperty("--secondary-color", colors.secondary)
  }

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        logoUrl: tenant?.logo_url,
        tenantName: tenant?.name || "",
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
