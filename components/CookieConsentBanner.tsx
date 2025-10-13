'use client';

// ============================================================================
// COMPONENT 1: Cookie Consent Banner
// Spec: POPIA/GDPR Compliant Cookie Consent
// ============================================================================
import React, { useState, useEffect } from 'react';
import { X, Shield, Cookie, Lock, FileText, CheckCircle } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);

    // Initialize analytics if accepted
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const acceptNecessary = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
  };

  const savePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setIsVisible(false);

    // Update consent for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Cookie Preferences
              </h2>
            </div>
            <button
              onClick={acceptNecessary}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showPreferences ? (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and
                personalize content. By clicking &quot;Accept All&quot;, you consent to our use
                of cookies.
              </p>
              <p className="text-sm text-gray-600">
                See our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>{' '}
                for more details.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Necessary Cookies
                    </h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Always Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Analytics Cookies
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Marketing Cookies
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Used to deliver personalized advertisements.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3">
          {!showPreferences ? (
            <>
              <button
                onClick={acceptAll}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Accept All
              </button>
              <button
                onClick={acceptNecessary}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Necessary Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 transition font-semibold"
              >
                Customize Preferences
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowPreferences(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Back
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Save Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
