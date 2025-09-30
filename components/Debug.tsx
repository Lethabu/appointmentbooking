'use client';

import { useEffect, useState } from 'react';

interface DebugInfo {
  hostname: string;
  pathname: string;
  cssLoaded: boolean;
  tailwindLoaded: boolean;
  userAgent: string;
  viewport: string;
  errors: string[];
}

export default function Debug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or with debug query param
    const urlParams = new URLSearchParams(window.location.search);
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = urlParams.get('debug') === 'true';
    
    if (!isDev && !hasDebugParam) return;

    const checkCSS = () => {
      // Create a test element with Tailwind classes
      const testEl = document.createElement('div');
      testEl.className = 'bg-purple-600 text-white p-4 hidden';
      testEl.textContent = 'CSS Test';
      document.body.appendChild(testEl);

      const styles = window.getComputedStyle(testEl);
      const bgColor = styles.backgroundColor;
      const padding = styles.padding;

      document.body.removeChild(testEl);

      return {
        cssLoaded: bgColor !== '' && bgColor !== 'rgba(0, 0, 0, 0)',
        tailwindLoaded: bgColor === 'rgb(147, 51, 234)' && padding === '16px'
      };
    };

    const errors: string[] = [];
    
    // Check for common errors
    if (!window.getComputedStyle) {
      errors.push('getComputedStyle not available');
    }

    const cssCheck = checkCSS();
    
    setDebugInfo({
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      cssLoaded: cssCheck.cssLoaded,
      tailwindLoaded: cssCheck.tailwindLoaded,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      errors
    });

    setIsVisible(true);

    // Listen for keyboard shortcut to show/hide debug info
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!debugInfo) return null;

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full text-xs z-50 hover:bg-gray-700"
        title="Click to toggle debug info (or press Ctrl+Shift+D)"
      >
        🐛
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md text-xs z-50 font-mono">
          <h3 className="text-sm font-bold mb-2 text-yellow-400">Debug Info</h3>
          
          <div className="space-y-2">
            <div>
              <strong>Hostname:</strong> {debugInfo.hostname}
            </div>
            <div>
              <strong>Pathname:</strong> {debugInfo.pathname}
            </div>
            <div>
              <strong>Viewport:</strong> {debugInfo.viewport}
            </div>
            <div className="flex items-center gap-2">
              <strong>CSS Loaded:</strong> 
              <span className={debugInfo.cssLoaded ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.cssLoaded ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <strong>Tailwind Loaded:</strong> 
              <span className={debugInfo.tailwindLoaded ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.tailwindLoaded ? '✅' : '❌'}
              </span>
            </div>
            
            {debugInfo.errors.length > 0 && (
              <div>
                <strong className="text-red-400">Errors:</strong>
                <ul className="list-disc list-inside text-red-300">
                  {debugInfo.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick fixes */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <h4 className="text-sm font-bold mb-2 text-blue-400">Quick Fixes</h4>
            <div className="space-y-1">
              {!debugInfo.tailwindLoaded && (
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full text-left px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
                >
                  🔄 Reload Page
                </button>
              )}
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="block w-full text-left px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
              >
                🧹 Clear Cache & Reload
              </button>
            </div>
          </div>

          <div className="mt-2 text-gray-400 text-xs">
            Press Ctrl+Shift+D to toggle
          </div>
        </div>
      )}
    </>
  );
}