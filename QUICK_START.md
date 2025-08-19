# 🚀 Quick Start: Add Convex + Clerk + Paystack

## 1. Install Dependencies (2 min)
```bash
npm install convex @clerk/nextjs @paystack/inline-js
```

## 2. Initialize Convex (3 min)
```bash
npx convex dev
# Follow prompts to create account and deployment
```

## 3. Update Environment Variables
Add to your `.env.local`:
```env
# Get these from convex.dev dashboard
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Get these from clerk.com dashboard  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Get these from paystack.com dashboard
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

## 4. Add Providers to Layout (5 min)
```tsx
// app/layout.tsx - Update your existing layout
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <html>
          <body>
            {/* Keep your existing providers */}
            {children}
          </body>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  );
}
```

## 5. Test Real-time Booking Updates (2 min)
Add to any booking page:
```tsx
import { LiveBookingStatus } from '@/app/components/BookingWidget/LiveBookingStatus';

// In your component
<LiveBookingStatus 
  appointmentId="123" 
  tenantId={process.env.INSTYLE_TENANT_ID} 
/>
```

## 6. Test Paystack Payments (2 min)
Add to checkout page:
```tsx
import { PaymentSelector } from '@/app/components/Booking/PaymentSelector';

// In your component
<PaymentSelector
  amount={750}
  email="customer@example.com"
  appointmentId="123"
  tenantId={process.env.INSTYLE_TENANT_ID}
  onPaymentSuccess={(tx) => console.log('Payment success:', tx)}
/>
```

## 7. Deploy (1 min)
```bash
npx convex deploy
npm run build
```

## ✅ Success Checklist
- [ ] Convex dashboard shows your schema
- [ ] Real-time updates appear in browser
- [ ] Paystack test payment works
- [ ] Existing Supabase features still work
- [ ] No breaking changes to current users

## 🎯 Next Steps
1. Gradually migrate hot-path operations to Convex
2. Add Clerk auth for new user flows
3. A/B test Paystack vs PayFast conversion rates
4. Monitor performance improvements

**Total setup time: ~15 minutes**