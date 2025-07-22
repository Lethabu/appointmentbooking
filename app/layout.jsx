import { GeistSans } from 'geist/font/sans';
import { CartProvider } from '@/app/context/CartContext';
import './globals.css';

import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata = {
  title: 'Salon Booking System',
  description: 'Next-gen salon management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
