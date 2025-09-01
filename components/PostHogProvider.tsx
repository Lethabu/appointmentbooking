'use client'

import { ReactNode } from 'react'

interface PostHogProviderProps {
  children: ReactNode
}

export function CSPostHogProvider({ children }: PostHogProviderProps) {
  return <>{children}</>
}