import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';

export const metadata: Metadata = {
  title: 'Shop - InStyle Hair Boutique',
  description: 'Shop premium hair products and book services at InStyle Hair Boutique',
};

const products = [
  {
    id: 'prod_1',
    name: 'Premium Hair Treatment Kit',
    description: 'Complete hair treatment kit for healthy, shiny hair. Includes deep conditioning mask, repair serum, and styling cream.',
    price_cents: 25000,
    category: 'Treatment',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'],
    inventory: 10
  },
  {
    id: 'prod_2', 
    name: 'Professional Hair Extensions - 18 inch',
    description: 'High-quality human hair extensions for volume and length. Available in multiple colors.',
    price_cents: 45000,
    category: 'Extensions',
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'],
    inventory: 5
  },
  {
    id: 'prod_3',
    name: 'Styling Product Bundle',
    description: 'Complete styling bundle with gel, mousse, heat protectant spray, and finishing serum.',
    price_cents: 18000,
    category: 'Styling',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    inventory: 15
  },
  {
    id: 'prod_4',
    name: 'Maphondo Installation Kit',
    description: 'Everything needed for professional Maphondo installation including tools and accessories.',
    price_cents: 35000,
    category: 'Installation',
    images: ['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400'],
    inventory: 8
  },
  {
    id: 'prod_5',
    name: 'Hair Care Maintenance Set',
    description: 'Monthly maintenance set with shampoo, conditioner, and leave-in treatment.',
    price_cents: 15000,
    category: 'Care',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    inventory: 20
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/instylehairboutique" className="text-3xl font-bold text-purple-600">
                InStyle Hair Boutique
              </Link>
              <p className="text-gray-600">Premium Hair Products</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/instylehairboutique">Back to Home</Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/book/instylehairboutique">Book Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold mb-8">Shop Products</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}