import './globals.css'

// ... rest of your layout component
export default function RootLayout({ children }) {
  // ...
}
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import PerformanceObserver from "./components/PerformanceObserver";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Providers from "./providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AppointmentBookings - Professional Salon Management",
  description: "Complete salon management platform with booking, payments, and AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <PerformanceObserver />
        </Providers>
      </body>
    </html>
  );
}
