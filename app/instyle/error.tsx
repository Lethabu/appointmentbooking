// Next.js App Router error boundary for /app/instyle
'use client';
import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-gray-700 mb-2">We couldn't load the page. Please try again later.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="bg-gray-100 p-4 rounded text-xs text-red-800 max-w-xl overflow-auto">
          {error?.message}
        </pre>
      )}
      <button
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
