---
export default function ProductCard({ product }) {
  const imageUrl = product.image_urls && product.image_urls[0] ? product.image_urls[0] : 'https://via.placeholder.com/300';

  return (
    <div className='border rounded-lg bg-white overflow-hidden group hover:shadow-xl transition-shadow'>
      <div className="h-48 bg-gray-200">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-gray-800 truncate">{product.name}</h4>
        <p className="text-sm text-gray-600 mt-1 h-10">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
            <p className="font-semibold text-lg text-primary">R {product.price / 100}</p>
            <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                View Product
            </button>
        </div>
      </div>
    </div>
  );
}
---