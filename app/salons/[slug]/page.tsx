import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const salon = await convex.query(api.tenants.getBySlug, { slug });
  
  if (!salon) return { title: 'Salon Not Found' };

  return {
    title: `${salon.name} – Online Booking`,
    description: `Book appointments at ${salon.name}. Rated ${salon.rating || 4.9}/5 by customers.`,
    openGraph: {
      images: [salon.ogImage || '/placeholder.jpg'],
      type: 'website',
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: salon.name,
        image: salon.logo || '/placeholder.jpg',
        address: salon.address,
        telephone: salon.phone,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: salon.rating || 4.9,
          reviewCount: salon.reviewCount || 100,
        },
      }),
    },
  };
}

export default async function SalonPage({ params }: Props) {
  const { slug } = await params;
  const salon = await convex.query(api.tenants.getBySlug, { slug });
  const services = salon?._id ? await convex.query(api.services.list, { tenantId: salon._id }) : [];

  if (!salon) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {salon.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg">{salon.rating || 4.9}/5</span>
                <span className="text-sm opacity-80">({salon.reviewCount || 100} reviews)</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {salon.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{salon.address}</span>
                  </div>
                )}
                {salon.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{salon.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Open Today 9:00 AM - 6:00 PM</span>
                </div>
              </div>
              
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href={`/book/${salon.slug}`}>Book Appointment</Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={salon.ogImage || '/placeholder.jpg'} 
                alt={salon.name}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <Card key={service._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.duration} minutes</CardDescription>
                    </div>
                    <Badge variant="secondary">R{service.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Link href={`/book/${salon.slug}?service=${service._id}`}>
                      Book Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to look amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment today and experience the difference.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link href={`/book/${salon.slug}`}>Book Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}