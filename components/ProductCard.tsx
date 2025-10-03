'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  images: string[];
  inventory: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
<<<<<<< HEAD
    const { addToCart, addItem } = useCart() as any;

  const handleAddToCart = async () => {
    setIsAdding(true);
      // Prefer `addToCart` if available, otherwise fallback to `addItem` from older JS context
      if (typeof addToCart === 'function') {
        await addToCart(product);
      } else if (typeof addItem === 'function') {
        await addItem(product);
      }
=======
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(product);
>>>>>>> origin/feat/instyle-whitelabel
    setIsAdding(false);
  };

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(0)}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 right-2 bg-purple-600">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
<<<<<<< HEAD

=======
        
>>>>>>> origin/feat/instyle-whitelabel
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(product.price_cents)}
          </span>
          <span className="text-sm text-gray-500">
            {product.inventory} in stock
          </span>
        </div>

<<<<<<< HEAD
        <Button
=======
        <Button 
>>>>>>> origin/feat/instyle-whitelabel
          onClick={handleAddToCart}
          disabled={isAdding || product.inventory === 0}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
<<<<<<< HEAD
          {isAdding
            ? 'Adding...'
            : product.inventory === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
=======
          {isAdding ? 'Adding...' : product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
>>>>>>> origin/feat/instyle-whitelabel
        </Button>
      </CardContent>
    </Card>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/feat/instyle-whitelabel
