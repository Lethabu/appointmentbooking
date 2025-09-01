import './globals.css'; // Global CSS only here
import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { ConvexClientProvider } from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </CSPostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}