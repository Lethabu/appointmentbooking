'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY < 10) {
        // If mouse moves to the top of the viewport
        // Check if feature flag is enabled
        if (posthog.isFeatureEnabled('exit-intent-modal')) {
          setIsOpen(true);
          posthog.capture('exit_intent_modal_shown');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Don't leave yet!</h2>
        <p className="mb-6">
          Get 10% off your first booking when you sign up now!
        </p>
        <button
          onClick={() => {
            setIsOpen(false);
            posthog.capture('exit_intent_modal_closed');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Claim Offer
        </button>
      </div>
    </div>
  );
}
