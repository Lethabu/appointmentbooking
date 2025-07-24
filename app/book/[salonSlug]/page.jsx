'use client';

import React from 'react';

export default function TestHydrationPage() {
  const handleClick = () => {
    console.log("Test button clicked on salonSlug page!");
    alert("Test button clicked on salonSlug page!");
  };

  return (
    <div className="p-8 text-center">
      <h1>Test Hydration Page for [salonSlug]</h1>
      <button 
        className="p-3 bg-green-500 text-white rounded"
        onClick={handleClick}
      >
        Click Me to Test Hydration
      </button>
    </div>
  );
}
