---
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import ServiceCard from '../../components/booking/ServiceCard';
import ProductCard from '../../components/booking/ProductCard';

export default function SalonBookingPage({ salon, services, products, error }) {

  if (error) return <div className="text-center p-20"><h1>Error</h1><p>{error}</p></div>;
  if (!salon) return <div className="text-center p-20"><h1>Salon Not Found</h1><p>The salon you are looking for does not exist.</p></div>;

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <>
      <Head>
        <title>Book an Appointment at {salon.name}</title>
        <meta name="description" content={`Online booking and product shop for ${salon.name}.`} />
      </Head>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-16 text-center">
            <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">{salon.name}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Your style, our passion. Book your appointment with our expert stylists and browse our premium hair products.</p>
          </div>
        </div>

        <div className="container mx-auto p-6 max-w-6xl">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Services & Products */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Services Section */}
              <section id="services">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Services</h2>
                <div className="space-y-8">
                  {Object.entries(servicesByCategory).map(([category, services]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-primary pb-2">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map(service => (
                          <ServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Products Section */}
              <section id="products">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop Our Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Booking Form (Sticky) */}
            <aside className="lg:sticky top-6">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-center">Book Now</h3>
                <p className='text-center text-gray-500 mb-6'>Select your services, then give us a call to finalize your time slot. Online payment coming soon!</p>
                <form className="space-y-4">
                  <div>
                    <label className="font-medium">Your Name</label>
                    <input type='text' placeholder='Full Name' className='w-full border rounded-md p-3 mt-1' />
                  </div>
                  <div>
                    <label className="font-medium">Your Phone Number</label>
                    <input type='tel' placeholder='e.g., +27 123 4567' className='w-full border rounded-md p-3 mt-1' />
                  </div>
                  <div className='pt-4'>
                    <button 
                      type='button' // Changed from submit to prevent page reload
                      className="w-full p-4 text-lg font-bold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
                      Call to Confirm Time
                    </button>
                     <p className='text-center text-gray-500 text-xs mt-2'>Full interactive booking coming in Phase 2!</p>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { subdomain } = ctx.params;
  const supabase = createServerSupabaseClient(ctx);

  try {
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, name')
      .eq('subdomain', subdomain)
      .single();

    if (salonError || !salon) {
      return { props: { error: 'Salon not found.' } };
    }

    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('salon_id', salon.id)
      .order('name');
      
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('salon_id', salon.id)
      .order('name');

    if (servicesError || productsError) {
      return { props: { error: 'Could not fetch salon details.' } };
    }

    return { props: { salon, services: services || [], products: products || [] } };
  } catch (e) {
    return { props: { error: 'An unexpected error occurred.' } };
  }
};
---