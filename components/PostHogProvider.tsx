'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHog_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  })
}

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    if (user && isSignedIn) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      })
    } else {
      posthog.reset()
    }
  }, [user, isSignedIn])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}