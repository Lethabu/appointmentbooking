"use client";
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import ChatWindow from '@/components/ChatWindow';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen flex-grow">
        {children}
      </main>
      <Footer />
      <ChatWindow tenantId={'default'} />
    </>
  );
}
