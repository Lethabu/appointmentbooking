"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';
import { useEffect, ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_HOST!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: 'https://app.posthog.com',
    });
  }, []);

  return (
    <ClerkProvider>
      <PostHogProvider client={posthog}>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}
