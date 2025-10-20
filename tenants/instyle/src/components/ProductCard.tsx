// tenants/instyle/src/components/ProductCard.tsx
// This is a placeholder for the ProductCard component.

import React from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, priceCents, stock }) => {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>Price: R{(priceCents / 100).toFixed(2)}</p>
      <p>Stock: {stock}</p>
      {/* Add more product details and UI elements here */}
    </div>
  );
};

export default ProductCard;