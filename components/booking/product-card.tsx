import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative">
        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">R {product.price}</span>
          <Button size="sm" variant="outline">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
