import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
