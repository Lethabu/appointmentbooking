'use client';

import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// Convenience hook for getting current user
// NOTE: This hook returns null because Convex auth is not implemented.
// Authentication is handled by Clerk throughout the app.
// Components should check for null return value before using.
export function useAuth(): { user: any; loading: boolean } | null {
  // NOTE: Convex does not have auth module implemented
  // Authentication is handled by Clerk in this app
  // This hook returns null to maintain interface compatibility
  return null;
}
