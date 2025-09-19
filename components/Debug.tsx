'use client';

import { useState, useEffect } from 'react';

export default function Debug() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Only show in development or with debug query param
    const urlParams = new URLSearchParams(window.location.search);
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = urlParams.get('debug') === 'true';
    
    if (isDev || hasDebugParam) {
      setIsVisible(true);
      
      // Check if Tailwind CSS is loaded by testing a known class
      const testElement = document.createElement('div');
      testElement.className = 'bg-purple-600 text-white p-4 hidden';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const tailwindLoaded = computedStyle.backgroundColor === 'rgb(147, 51, 234)'; // purple-600
      
      document.body.removeChild(testElement);
      
      // Collect debug information
      const info = {
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        tailwindLoaded,
        tailwindBgColor: computedStyle.backgroundColor,
      };
      
      setDebugInfo(info);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black text-white p-4 rounded-lg shadow-lg max-w-sm text-xs">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Debug Info</h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-1">
          <div><strong>Host:</strong> {debugInfo.hostname}</div>
          <div><strong>Path:</strong> {debugInfo.pathname}</div>
          <div><strong>Tailwind:</strong> 
            <span className={debugInfo.tailwindLoaded ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.tailwindLoaded ? ' ✓ Loaded' : ' ✗ Failed'}
            </span>
          </div>
          <div><strong>Time:</strong> {debugInfo.timestamp?.split('T')[1]?.split('.')[0]}</div>
        </div>
      </div>
    </div>
  );
}