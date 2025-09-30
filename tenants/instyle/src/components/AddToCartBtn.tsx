// tenants/instyle/src/components/AddToCartBtn.tsx
import { useState } from 'react';

interface Product {
  priceCents: number;
  // Add other product properties as needed
}

// Assuming useCart is defined elsewhere or will be implemented
const useCart = () => ({
  add: (product: Product) => console.log('Adding to cart:', product),
});

export default function AddToCartBtn({ product }: { product: Product }) {
  const { add } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    add(product);
    setLoading(true);
    const { url } = await fetch('/api/paystack-create', {
      method: 'POST',
      body: JSON.stringify({
        amount: product.priceCents,
        items: [product],
        tenantId: 'instyle',
      }),
    }).then((r) => r.json());
    window.location.href = url; // PayStack light-box
  };

  return (
    <button onClick={handleClick} disabled={loading} className="add-to-cart">
      {loading ? 'Redirecting…' : 'Buy Now'}
    </button>
  );
}