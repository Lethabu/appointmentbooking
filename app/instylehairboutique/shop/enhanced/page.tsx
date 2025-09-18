'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  MessageCircle, 
  Instagram, 
  Star,
  Truck,
  Shield,
  Zap
} from 'lucide-react';

const featuredProducts = [
  {
    id: 'lace-front-20',
    name: 'Premium Lace Front Wig - 20"',
    description: 'High-quality human hair lace front wig, natural black, pre-plucked hairline',
    price: 45000,
    originalPrice: 55000,
    category: 'Wigs',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    rating: 4.8,
    reviews: 24,
    inStock: true,
    features: ['100% Human Hair', 'Pre-plucked', '13x4 Lace', 'Natural Hairline'],
    whatsappOrder: true
  },
  {
    id: 'brazilian-bundle-18',
    name: 'Brazilian Hair Bundle - 18"',
    description: 'Premium Brazilian virgin hair bundle, natural wave pattern, tangle-free',
    price: 35000,
    category: 'Hair Bundles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    rating: 4.9,
    reviews: 31,
    inStock: true,
    features: ['Virgin Hair', 'Natural Wave', 'Double Weft', 'Color 1B'],
    whatsappOrder: true
  },
  {
    id: 'care-kit-premium',
    name: 'Premium Hair Care Kit',
    description: 'Complete care system: sulfate-free shampoo, deep conditioner, treatment oil',
    price: 15000,
    category: 'Care Products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    rating: 4.7,
    reviews: 18,
    inStock: true,
    features: ['Sulfate-Free', 'Argan Oil', 'Color Safe', '3-Step System'],
    whatsappOrder: true
  },
  {
    id: 'silk-bonnet',
    name: 'Silk Hair Bonnet',
    description: 'Premium mulberry silk bonnet for overnight hair protection and moisture retention',
    price: 8000,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400',
    rating: 4.6,
    reviews: 12,
    inStock: true,
    features: ['100% Mulberry Silk', 'Adjustable Band', 'Breathable', 'Anti-Frizz'],
    whatsappOrder: true
  }
];

const services = [
  {
    name: 'Professional Installation + Care Kit',
    description: 'Expert wig installation with complimentary care products',
    price: 60000,
    duration: '2-3 hours',
    includes: ['Installation', 'Styling', 'Care Kit', '1-Week Touch-up']
  },
  {
    name: 'Hair Treatment + Consultation',
    description: 'Deep conditioning treatment with personalized hair care plan',
    price: 25000,
    duration: '1 hour',
    includes: ['Scalp Analysis', 'Treatment', 'Care Plan', 'Product Samples']
  }
];

export default function EnhancedShopPage() {
  const [cart, setCart] = useState([]);
  const whatsappNumber = '+27123456789';
  
  const orderViaWhatsApp = (product: any) => {
    const message = `Hi! I'm interested in ordering the ${product.name} (R${(product.price / 100).toFixed(2)}). Can you help me with the details?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/instylehairboutique" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-600">InStyle Hair Boutique</h1>
                <p className="text-sm text-gray-600">Premium Hair Shop</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Order
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/book/instylehairboutique">Book Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Hair Products & Services
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Shop authentic hair products with WhatsApp ordering. Fast delivery across South Africa. 
            Professional installation services available.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-600" />
              Free delivery over R500
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Authentic products only
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              WhatsApp instant ordering
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="products" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              {/* Featured Products */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8">Featured Products</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Save R{((product.originalPrice - product.price) / 100).toFixed(0)}
                          </Badge>
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{product.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-purple-600">
                                R{(product.price / 100).toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  R{(product.originalPrice / 100).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => orderViaWhatsApp(product)}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              WhatsApp
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-center mb-8">Professional Services</h3>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {services.map((service, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-purple-600">{service.name}</CardTitle>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{service.duration}</span>
                          <span className="text-2xl font-bold text-amber-600">
                            R{(service.price / 100).toFixed(2)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{service.description}</p>
                        <div>
                          <h4 className="font-semibold mb-2">Includes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {service.includes.map((item, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                          <Link href="/book/instylehairboutique">Book This Service</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-12 px-4 bg-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">Order via WhatsApp</h3>
          <p className="text-lg text-gray-600 mb-6">
            Get instant assistance, product recommendations, and place orders directly through WhatsApp. 
            Our team responds within minutes!
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hi! I'd like to browse your hair products and services.`, '_blank')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start WhatsApp Chat
          </Button>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Follow Our Work</h3>
          <div className="flex justify-center space-x-6">
            <Button variant="outline" asChild>
              <Link href="https://www.instagram.com/instyle_hair_boutique_/" target="_blank">
                <Instagram className="w-5 h-5 mr-2" />
                @instyle_hair_boutique_
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://www.tiktok.com/@instylehairboutique" target="_blank">
                <span className="w-5 h-5 mr-2 font-bold">T</span>
                @instylehairboutique
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}