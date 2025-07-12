import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { CartProvider } from './context/CartContext.js';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'InStyle Hair Boutique - Powered by AppointmentBookings.co.za',
  description: 'Your premium destination for hair care and styling. Book your appointment with us seamlessly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <CartProvider>
        <body className="bg-gray-100 text-gray-800">
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-200 mt-16">
              <div className="container mx-auto px-4 py-6 text-center text-gray-600">
                <p>Powered by AppointmentBookings.co.za</p>
              </div>
            </footer>
          </div>
        </body>
      </CartProvider>
    </html>
  );
}