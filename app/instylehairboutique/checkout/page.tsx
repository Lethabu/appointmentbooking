import CheckoutForm from '@/components/ecommerce/CheckoutForm';
import Cart from '@/components/Cart';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <CheckoutForm tenantId="instylehairboutique" />
          <div className="sticky top-8">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
}
