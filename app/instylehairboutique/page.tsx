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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50" style={{minHeight: '100vh', background: 'linear-gradient(to bottom right, #faf5ff, #fffbeb)'}}>
      {/* Header */}
      <header className="bg-white shadow-sm" style={{backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>        <div className="max-w-7xl mx-auto px-4 py-6" style={{maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem'}}>
          <div className="flex items-center justify-between" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <h1 className="text-3xl font-bold text-purple-600" style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#9333ea'}}>
                InStyle Hair Boutique
              </h1>
              <p className="text-gray-600" style={{color: '#4b5563'}}>Premium Hair Services</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700" style={{backgroundColor: '#9333ea', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', display: 'inline-block'}}>
              <Link href="/instylehairboutique/book">Book Now</Link>
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
              <Link href="/instylehairboutique/book">Book Appointment</Link>
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
                    <Link href="/instylehairboutique/book">
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
