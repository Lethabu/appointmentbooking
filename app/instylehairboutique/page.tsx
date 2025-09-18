import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AIChat from './ai-chat';
import { inStyleBrand } from './config';
import ChatWindow from '@/components/ChatWindow';

export const metadata: Metadata = {
  metadataBase: new URL('https://your-platform-domain.com'),
  title: 'InStyle Hair Boutique - Premium Hair Services',
  description:
    'Professional hair installations, treatments and styling in South Africa. Book your appointment today.',
  openGraph: {
    title: 'InStyle Hair Boutique',
    description: 'Premium hair services and installations',
    images: ['/tenants/instyle/og-image.png'],
  },
};

const services = [
  {
    name: 'Middle & Side Installation',
    price: 'R450',
    duration: '60 minutes',
    description:
      'Professional installation of middle and side part weaves for a natural, elegant look.',
  },
  {
    name: 'Maphondo & Lines Installation',
    price: 'R600',
    duration: '90 minutes',
    description:
      'Intricate Maphondo and lines installation creating stunning geometric patterns.',
  },
  {
    name: 'Hair Treatment',
    price: 'R250',
    duration: '30 minutes',
    description:
      'Rejuvenating hair treatment to restore health, shine and vitality to your hair.',
  },
];

export default function InStylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-.between">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">
                InStyle Hair Boutique
              </h1>
              <p className="text-gray-600">Premium Hair Services</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/book/instylehairboutique">Book Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Look
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional hair installations, treatments and styling services.
            Experience the art of beautiful hair at InStyle Hair Boutique.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Link href="/book/instylehairboutique">Book Appointment</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Link href="/instylehairboutique/shop">Shop Products</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="#services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-purple-600">
                    {service.name}
                  </CardTitle>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{service.duration}</span>
                    <span className="font-bold text-amber-600">
                      {service.price}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                  <Button
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    asChild
                  >
                    <Link href="/book/instylehairboutique">
                      Book This Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Chat with Nia</h3>
          <p className="text-center text-gray-600 mb-8">
            Have questions? Chat with our AI assistant Nia about services,
            pricing, and bookings.
          </p>
          <AIChat />
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Follow Us</h3>
          <div className="flex justify-center gap-6">
            {Object.entries(inStyleBrand.socials).map(([platform, url]) => (
              <Button key={platform} variant="outline" asChild>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 InStyle Hair Boutique. All rights reserved.</p>
          <p className="text-gray-400 mt-2">
            Premium hair services in South Africa
          </p>
        </div>
      </footer>
      
      {/* Chat Window */}
      <ChatWindow tenantId="instyle" />
    </div>
  );
}
