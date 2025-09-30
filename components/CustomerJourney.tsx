'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CustomerJourney() {
  const { items, total } = useCart();

  useEffect(() => {
    // Track customer journey events
    const trackEvent = (event: string, data?: any) => {
      console.log('Customer Journey:', event, data);
      // In production: send to analytics
    };

    // Page view tracking
    trackEvent('page_view', { page: window.location.pathname });

    // Cart abandonment tracking
    if (items.length > 0) {
      const abandonmentTimer = setTimeout(() => {
        trackEvent('cart_abandoned', {
          items: items.length,
          value: total,
        });

        // Trigger WhatsApp reminder
        fetch('/api/webhooks/automation/abandoned-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: 'instylehairboutique',
            clientPhone: '+27123456789', // Get from user session
            cartItems: items,
          }),
        });
      }, 300000); // 5 minutes

      return () => clearTimeout(abandonmentTimer);
    }
  }, [items, total]);

  return null; // Invisible tracking component
}
