import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { CartProvider } from "./context/CartContext";
import PerformanceObserver from "@/components/PerformanceObserver";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AppointmentBookings.co.za - The All-in-One Platform for Salons",
  description: "AI-powered booking, e-commerce, and management for modern salons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        <CartProvider>
          <PerformanceObserver />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
