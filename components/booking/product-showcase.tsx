import type { Product } from '@/types';
import { ProductCard } from './product-card';

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Shop Our Premium Products
        </h2>
        <p className="text-gray-600">
          Take the salon experience home with our curated collection
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
