// Strapi CMS integration with tenant isolation
const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

interface StrapiProduct {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    image: string;
    tenant_id: string;
    category: string;
    in_stock: boolean;
  };
}

// Fallback static products for when Strapi is unavailable
const getStaticProducts = (tenantId: string) => {
  const staticProducts = {
    instyle: [
      {
        id: 1,
        name: 'Premium Hair Serum',
        description: 'Nourishing serum for all hair types',
        price: 299,
        image: '/products/serum.jpg',
        category: 'Hair Care',
        in_stock: true,
      },
      {
        id: 2,
        name: 'Luxury Shampoo',
        description: 'Professional grade shampoo',
        price: 199,
        image: '/products/shampoo.jpg',
        category: 'Hair Care',
        in_stock: true,
      },
    ],
  };

  return staticProducts[tenantId as keyof typeof staticProducts] || [];
};

export async function getProducts(tenantId: string) {
  // Return static data if Strapi not configured
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.warn('Strapi not configured, using static products');
    return getStaticProducts(tenantId);
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/products?filters[tenant_id][$eq]=${tenantId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Strapi data to our format
    return data.data.map((item: StrapiProduct) => ({
      id: item.id,
      name: item.attributes.name,
      description: item.attributes.description,
      price: item.attributes.price,
      image: item.attributes.image,
      category: item.attributes.category,
      in_stock: item.attributes.in_stock,
    }));
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    // Fallback to static products
    return getStaticProducts(tenantId);
  }
}

export async function getProduct(tenantId: string, productId: string) {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    const products = getStaticProducts(tenantId);
    return products.find((p) => p.id.toString() === productId);
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/products/${productId}?filters[tenant_id][$eq]=${tenantId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Product not found: ${response.status}`);
    }

    const data = await response.json();
    const item = data.data;

    return {
      id: item.id,
      name: item.attributes.name,
      description: item.attributes.description,
      price: item.attributes.price,
      image: item.attributes.image,
      category: item.attributes.category,
      in_stock: item.attributes.in_stock,
    };
  } catch (error) {
    console.error('Error fetching product from Strapi:', error);
    return null;
  }
}
