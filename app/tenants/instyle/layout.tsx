import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preload" as="image" href="/tenants/instyle/hero.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}