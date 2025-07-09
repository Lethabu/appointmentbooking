import { GeistSans } from 'geist/font/sans';
import { CartProvider } from '@/components/cart-provider'; // Please adjust this import path if your component is located elsewhere
import './globals.css';

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
      </body>
    </html>
  )
}