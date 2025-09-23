import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SmartProductShowcase from '@/components/ecommerce/SmartProductShowcase';
import Cart from '@/components/Cart';

export const metadata: Metadata = {
  metadataBase: new URL('https://your-platform-domain.com'),
  title: 'Shop - InStyle Hair Boutique',
  description:
    'Shop premium hair products and book services at InStyle Hair Boutique',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/instylehairboutique"
                className="text-3xl font-bold text-purple-600"
              >
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
            <SmartProductShowcase
              tenantId="instylehairboutique"
              customerId={undefined} // Add customer ID when available
            />
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
