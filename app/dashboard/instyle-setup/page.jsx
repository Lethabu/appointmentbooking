
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function InStyleSetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const supabase = createClient();

  const inStyleServices = [
    {
      name: "Hair Wash & Blow Dry",
      description: "Professional hair washing and styling with blow dry",
      price: 180,
      duration: 45,
      category: "styling"
    },
    {
      name: "Hair Treatment",
      description: "Deep conditioning and nourishing hair treatment",
      price: 350,
      duration: 60,
      category: "treatment"
    },
    {
      name: "Hair Styling",
      description: "Special occasion hair styling and updos",
      price: 280,
      duration: 60,
      category: "styling"
    },
    {
      name: "Color Touch-up",
      description: "Root touch-up and color refresh",
      price: 450,
      duration: 90,
      category: "coloring"
    },
    {
      name: "Full Hair Color",
      description: "Complete hair coloring service",
      price: 650,
      duration: 120,
      category: "coloring"
    },
    {
      name: "Highlights",
      description: "Professional highlights and lowlights",
      price: 750,
      duration: 150,
      category: "coloring"
    },
    {
      name: "Hair Extensions",
      description: "Professional hair extension application",
      price: 800,
      duration: 180,
      category: "extensions"
    },
    {
      name: "Bridal Hair",
      description: "Complete bridal hair styling package",
      price: 1200,
      duration: 120,
      category: "special"
    }
  ];

  const inStyleProducts = [
    {
      name: "Professional Shampoo",
      description: "Salon-grade moisturizing shampoo",
      price: 180,
      stock_quantity: 25
    },
    {
      name: "Deep Conditioning Mask",
      description: "Intensive repair hair mask",
      price: 220,
      stock_quantity: 15
    },
    {
      name: "Hair Serum",
      description: "Anti-frizz and shine serum",
      price: 150,
      stock_quantity: 30
    },
    {
      name: "Heat Protection Spray",
      description: "Thermal protection for styling",
      price: 140,
      stock_quantity: 20
    },
    {
      name: "Hair Oil Treatment",
      description: "Nourishing argan oil treatment",
      price: 200,
      stock_quantity: 18
    }
  ];

  const setupInStyleData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please log in first');
        return;
      }

      // Find or create InStyle salon
      let { data: salon } = await supabase
        .from('salons')
        .select('*')
        .eq('subdomain', 'instylehairboutique')
        .single();

      if (!salon) {
        const { data: newSalon, error: salonError } = await supabase
          .from('salons')
          .insert({
            name: 'InStyle Hair Boutique',
            subdomain: 'instylehairboutique',
            custom_domain: 'instylehairboutique.co.za',
            owner_id: user.id,
            plan: 'professional',
            settings: {
              currency: 'ZAR',
              timezone: 'Africa/Johannesburg',
              booking_hours: {
                monday: { open: '09:00', close: '17:00' },
                tuesday: { open: '09:00', close: '17:00' },
                wednesday: { open: '09:00', close: '17:00' },
                thursday: { open: '09:00', close: '17:00' },
                friday: { open: '09:00', close: '17:00' },
                saturday: { open: '08:00', close: '16:00' },
                sunday: { closed: true }
              }
            }
          })
          .select()
          .single();

        if (salonError) throw salonError;
        salon = newSalon;
      }

      // Add services
      const servicesWithSalonId = inStyleServices.map(service => ({
        ...service,
        salon_id: salon.id,
        is_active: true
      }));

      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesWithSalonId);

      if (servicesError && !servicesError.message.includes('duplicate')) {
        throw servicesError;
      }

      // Add products
      const productsWithSalonId = inStyleProducts.map(product => ({
        ...product,
        salon_id: salon.id,
        is_active: true
      }));

      const { error: productsError } = await supabase
        .from('products')
        .insert(productsWithSalonId);

      if (productsError && !productsError.message.includes('duplicate')) {
        throw productsError;
      }

      setSuccess('InStyle Hair Boutique setup completed successfully!');
    } catch (err) {
      setError('Setup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          InStyle Hair Boutique Setup
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">What will be set up:</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Services (No Hair Cuts)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {inStyleServices.map((service, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{service.name}</span>
                    <span>R{service.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {inStyleProducts.map((product, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{product.name}</span>
                    <span>R{product.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={setupInStyleData}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up...' : 'Setup InStyle Hair Boutique'}
        </button>

        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Complete the setup by clicking the button above</li>
            <li>Visit <strong>instylehairboutique.co.za</strong> to see the booking page</li>
            <li>Create client accounts using the signup page</li>
            <li>Test the booking system with the SuperSaaS integration</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
