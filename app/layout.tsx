import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import './globals.css'
import { ConvexClientProvider } from './providers'
import { ClerkProvider } from '@clerk/nextjs'
import { CSPostHogProvider } from '@/components/PostHogProvider'
export { reportWebVitals } from './vitals';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique - Appointment Booking',
  description: 'Professional hair salon appointment booking system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: '#8B5CF6' },
      }}
    >
      <CSPostHogProvider>
        <html lang="en">
          <body className={inter.className}>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  )
}