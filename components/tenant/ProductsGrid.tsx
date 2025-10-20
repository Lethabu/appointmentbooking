import Image from 'next/image';
import { Product } from '../../app/[tenant]/page'; // Import type

interface ProductsGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const price = (product.price_cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <Image
        src={product.image_url || '/placeholder.jpg'}
        alt={product.name}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1">{product.name}</h4>
        <p className="text-[#C0392B] font-semibold">{price}</p>
      </div>
    </div>
  );
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="text-center py-8">No products available.</p>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}