'use client';

import React from 'react';

export default function TestClickPage() {
  const handleClick = () => {
    alert('Test button clicked!');
    console.log('Test button clicked!');
  };

  return (
    <div className="p-8 text-center">
      <h1>Test Click Page</h1>
      <button
        className="p-3 bg-blue-500 text-white rounded"
        onClick={handleClick}
      >
        Click Me
      </button>
    </div>
  );
}
