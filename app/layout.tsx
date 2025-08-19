import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from './providers'
import { ClerkProvider } from '@clerk/nextjs'
import { CSPostHogProvider } from '@/components/PostHogProvider' // Import PostHogProvider
export { reportWebVitals } from './vitals';

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
    <ClerkProvider>
      <CSPostHogProvider> {/* Wrap with PostHogProvider */}
        <html lang="en">
          <body>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  )
}
