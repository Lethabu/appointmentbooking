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
    name: 'Middle & Side Installation',
    price: 'R300',
    duration: '60 minutes',
    description: 'Professional installation of middle and side part weaves for a natural, elegant look.',
  },
  {
    name: 'Maphondo & Lines Installation',
    price: 'R350',
    duration: '90 minutes',
    description: 'Intricate Maphondo and lines installation creating stunning geometric patterns.',
  },
  {
    name: 'Hair Treatment',
    price: 'R250',
    duration: '30 minutes',
    description: 'Rejuvenating hair treatment to restore health, shine and vitality to your hair.',
  },
  {
    name: 'Gel Maphondo',
    price: 'R350',
    duration: '60 minutes',
    description: 'Sleek gel-based Maphondo styling for a polished, long-lasting look.',
  },
  {
    name: 'Frontal Ponytail',
    price: 'R950',
    duration: '2 hours',
    description: 'Elegant frontal ponytail installation for a sophisticated, versatile style.',
  },
  {
    name: 'Makeup Soft Glam',
    price: 'R450',
    duration: '2 hours',
    description: 'Professional soft glam makeup application for a natural, radiant look.',
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
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-purple-600">{service.name}</CardTitle>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{service.duration}</span>
                  <span className="font-bold text-amber-600">{service.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/instylehairboutique/book">Book This Service</Link>
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