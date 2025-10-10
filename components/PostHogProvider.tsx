'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== 'undefined' && posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable auto pageview capture, as we capture manually
  });
}

export function CSPostHogProvider({ children }: { children?: ReactNode }) {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (user && isSignedIn && posthogKey) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    } else if (posthogKey) {
      posthog.reset();
    }
  }, [user, isSignedIn]);

  // Only wrap with the provider if the key is available
  return posthogKey ? <PostHogProvider client={posthog}>{children}</PostHogProvider> : <>{children}</>;
}
