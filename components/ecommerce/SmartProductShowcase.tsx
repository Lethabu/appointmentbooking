'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/app/utils/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
  description: string;
  stock_quantity: number;
}

interface SmartProductShowcaseProps {
  tenantId: string;
  customerId?: string;
}

export default function SmartProductShowcase({
  tenantId,
  customerId,
}: SmartProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('/api/products', {
          headers: { 'x-tenant-id': tenantId },
        });
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Fetch AI recommendations if customer ID available
        if (customerId) {
          const recsRes = await fetch('/api/products/ai-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId,
              customerData: { id: customerId },
            }),
          });
          const recsData = await recsRes.json();
          setRecommendations(recsData.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId, customerId]);

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price / 100, // Convert from cents
      salonSlug: tenantId,
    });
  };

  if (loading)
    return <div className="text-center p-8">Loading products...</div>;

  return (
    <div className="space-y-8">
      {cart.items.length > 0 && (
        <div className="bg-purple-100 p-4 rounded-lg flex justify-between items-center">
          <span>{cart.items.length} items in cart</span>
          <Button asChild>
            <a href="/instylehairboutique/checkout">Checkout</a>
          </Button>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-600">
            Recommended for You
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const product = products.find((p) => p.id === rec.id);
              if (!product) return null;

              return (
                <Card key={product.id} className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                    <p className="text-xs text-gray-600">{rec.reason}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        R{(product.price / 100).toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">All Products</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="text-sm">{product.name}</CardTitle>
                {product.image_urls?.[0] && (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    width={500} // Assuming a reasonable default width
                    height={500} // Assuming a reasonable default height
                    className="w-full h-32 object-cover rounded"
                  />
                )}
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    R{(product.price / 100).toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                  >
                    {product.stock_quantity === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
