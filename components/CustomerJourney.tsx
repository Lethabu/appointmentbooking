'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useUser } from '@clerk/nextjs';
import { useCart } from '@/hooks/useCart';

// This component could accept the tenantId as a prop
export default function CustomerJourney({ tenantId }: { tenantId: string }) {
  const { items, total } = useCart();
  const { user } = useUser();

  const abandonmentTimeout = parseInt(process.env.NEXT_PUBLIC_ABANDONMENT_TIMEOUT_MS || '300000', 10);

  useEffect(() => {
    // Track customer journey events
    const trackEvent = (event: string, properties?: Record<string, any>) => {
      const eventData = {
        ...properties,
        tenantId: tenantId, // Add tenant context to all events
        userId: user?.id,
      };
      console.log('Tracking Event:', event, eventData); // For debugging
      posthog.capture(event, eventData);
    };

    if (user) {
      posthog.identify(user.id, { email: user.primaryEmailAddress?.emailAddress, name: user.fullName });
    }

    // Page view tracking
    trackEvent('page_viewed', { page_path: window.location.pathname });

    // Cart abandonment tracking
    if (items.length > 0) {
      const abandonmentTimer = setTimeout(() => {
        trackEvent('cart_abandoned', { // Changed event name for clarity
          items: items.length,
          value: total,
        });

        // Trigger WhatsApp reminder
        fetch('/api/webhooks/automation/abandoned-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: tenantId,
            // Get phone number from the authenticated user session
            // The exact property depends on your Clerk user metadata setup
            clientPhone: user?.primaryPhoneNumber?.toString(),
            cartItems: items,
          }),
        });
      }, abandonmentTimeout);

      return () => clearTimeout(abandonmentTimer);
    }
  }, [items, total, abandonmentTimeout, tenantId, user]);

  return null; // Invisible tracking component
}
