'use client';

import React from 'react';

const ThemeInjector = ({ cssVariables }) => {
  if (!cssVariables) {
    return null;
  }

  // Using <style jsx global> in a Client Component is the correct way
  // to inject dynamic global styles in the App Router.
  return (
    <style jsx global>{`
      :root {
        ${cssVariables}
      }
    `}</style>
  );
};

export default ThemeInjector;