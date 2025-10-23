import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Services - InStyle Hair Boutique',
  description: 'Professional hair installation and treatment services',
};

const services = [
  {
    id: 'middle-side-install',
    name: 'Middle & Side Installation',
    price: 'R300',
    duration: '60 minutes',
    category: 'Hair Installation',
    description: 'Professional installation of middle and side part weaves for a natural, elegant look.',
    features: ['Natural look', 'Professional styling', 'Long-lasting'],
  },
  {
    id: 'maphondo-lines',
    name: 'Maphondo & Lines Installation',
    price: 'R350',
    duration: '90 minutes',
    category: 'Hair Installation',
    description: 'Intricate Maphondo and lines installation creating stunning geometric patterns.',
    features: ['Geometric patterns', 'Artistic design', 'Custom styling'],
  },
  {
    id: 'hair-treatment',
    name: 'Deep Hair Treatment',
    price: 'R250',
    duration: '45 minutes',
    category: 'Hair Care',
    description: 'Rejuvenating deep conditioning treatment to restore health, shine and vitality.',
    features: ['Deep conditioning', 'Scalp massage', 'Hair restoration'],
  },
  {
    id: 'gel-maphondo',
    name: 'Gel Maphondo Styling',
    price: 'R350',
    duration: '60 minutes',
    category: 'Hair Styling',
    description: 'Sleek gel-based Maphondo styling for a polished, long-lasting look.',
    features: ['Sleek finish', 'Long-lasting hold', 'Professional styling'],
  },
  {
    id: 'frontal-ponytail',
    name: 'Frontal Ponytail Installation',
    price: 'R950',
    duration: '2.5 hours',
    category: 'Premium Installation',
    description: 'Elegant frontal ponytail installation for a sophisticated, versatile style.',
    features: ['Premium installation', 'Versatile styling', 'Natural hairline'],
  },
  {
    id: 'soft-glam-makeup',
    name: 'Soft Glam Makeup',
    price: 'R450',
    duration: '90 minutes',
    category: 'Beauty Services',
    description: 'Professional soft glam makeup application for a natural, radiant look.',
    features: ['Natural glow', 'Professional products', 'Event ready'],
  },
  {
    id: 'wash-blowdry',
    name: 'Wash & Blow Dry',
    price: 'R180',
    duration: '45 minutes',
    category: 'Basic Services',
    description: 'Professional wash and blow dry service for healthy, styled hair.',
    features: ['Deep cleanse', 'Professional styling', 'Volume boost'],
  },
  {
    id: 'braids-cornrows',
    name: 'Braids & Cornrows',
    price: 'R400',
    duration: '2 hours',
    category: 'Protective Styling',
    description: 'Traditional braiding and cornrow styles for protective hair care.',
    features: ['Protective styling', 'Long-lasting', 'Custom patterns'],
  },
  {
    id: 'wig-install',
    name: 'Wig Installation & Styling',
    price: 'R650',
    duration: '2 hours',
    category: 'Wig Services',
    description: 'Professional wig installation and custom styling for natural look.',
    features: ['Secure installation', 'Natural styling', 'Comfort fit'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Professional hair services tailored for you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="text-xs text-purple-500 font-medium mb-1">{service.category}</div>
                <CardTitle className="text-purple-600 text-lg">{service.name}</CardTitle>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>⏱️ {service.duration}</span>
                  <span className="font-bold text-amber-600 text-lg">{service.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3 text-sm">{service.description}</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {service.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href={`/instylehairboutique/book?service=${service.id}`}>Book This Service</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/instylehairboutique">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}