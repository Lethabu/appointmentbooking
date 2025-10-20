'use client';
import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consents, setConsents] = useState({
    essential: true,
    marketing: false,
    analytics: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('instyle_consent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = async () => {
    const consentData = {
      essential: true,
      marketing: true,
      analytics: true,
    };

    await recordConsent(consentData);
    localStorage.setItem('instyle_consent', JSON.stringify(consentData));
    setShowBanner(false);
  };

  const recordConsent = async (consentData) => {
    try {
      await fetch('/api/consent/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_type: 'website_cookies',
          purpose: 'website_functionality_and_marketing',
          data_categories: Object.keys(consentData).filter(
            (key) => consentData[key],
          ),
        }),
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Your Privacy Matters
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies and collect data to provide you with the best
              booking experience. In compliance with POPIA, we need your consent
              to process your personal information.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
