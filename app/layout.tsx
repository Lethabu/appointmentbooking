import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import './globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import Providers from './providers';

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}