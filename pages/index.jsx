import Layout from '../components/Layout';

export default function InStyleHomePage() {
  return (
      <div className="w-full max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
          Welcome to InStyle Hair Boutique
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Experience luxury and convenience. Book your next appointment with our expert stylists online, anytime.
        </p>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* 
            NOTE: The `src` attribute for the iframe should be replaced with the actual URL 
            provided by the SuperSaaS booking widget service for InStyle Hair Boutique.
            e.g., "https://your-supersaas-provider.com/widget/instyle-hair-boutique"
          */}
          <iframe
            src="https://www.supersaas.com/schedule/InStyle_Hair_Boutique/Instyle_Hair_Boutique?view=widget"
            title="InStyle Hair Boutique Booking Widget"
            className="w-full h-[70vh] min-h-[600px] border-0"
            allow="fullscreen"
          >
            <p>Your browser does not support iframes. Please use a modern browser to book your appointment.</p>
          </iframe>
        </div>
      </div>
    </main>
  );
}