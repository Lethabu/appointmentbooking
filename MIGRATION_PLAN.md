# Convex + Clerk + Paystack Migration Plan

## Phase 1: Add Convex Real-time Layer (Week 1)

### 1.1 Install Convex
```bash
npm install convex @clerk/nextjs @paystack/inline-js
npx convex dev
```

### 1.2 Create Convex Schema
```ts
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Real-time booking updates
  bookingUpdates: defineTable({
    tenantId: v.string(),
    appointmentId: v.string(),
    status: v.string(),
    timestamp: v.number(),
  }).index('by_tenant', ['tenantId']),
  
  // Live chat messages
  chatMessages: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    message: v.string(),
    timestamp: v.number(),
  }).index('by_tenant_time', ['tenantId', 'timestamp']),
});
```

### 1.3 Add Real-time Booking Updates
```tsx
// app/components/BookingWidget/LiveBookingStatus.tsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function LiveBookingStatus({ appointmentId, tenantId }) {
  const updates = useQuery(api.bookings.getUpdates, { appointmentId, tenantId });
  
  return (
    <div className="live-status">
      {updates?.map(update => (
        <div key={update._id} className="status-update">
          {update.status} - {new Date(update.timestamp).toLocaleTimeString()}
        </div>
      ))}
    </div>
  );
}
```

## Phase 2: Integrate Clerk Auth (Week 2)

### 2.1 Add Clerk Provider
```tsx
// app/layout.tsx - Update existing layout
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          {/* Keep existing Supabase provider */}
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### 2.2 Dual Auth Strategy
```ts
// lib/auth/hybrid-auth.ts
import { useUser } from '@clerk/nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function useHybridAuth() {
  const { user: clerkUser } = useUser();
  const supabase = useSupabaseClient();
  
  // Use Clerk for new features, Supabase for existing
  return {
    clerkUser,
    supabaseAuth: supabase.auth,
    isNewUser: !!clerkUser && !supabaseUser,
  };
}
```

## Phase 3: Add Paystack Integration (Week 3)

### 3.1 Paystack Hook
```ts
// lib/payments/paystack.ts
import PaystackPop from '@paystack/inline-js';

export function usePaystack() {
  const payWithPaystack = ({
    email, amount, appointmentId, tenantId, onSuccess
  }: PaystackProps) => {
    const handler = new PaystackPop();
    handler.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'ZAR',
      ref: `${tenantId}_${appointmentId}_${Date.now()}`,
      onSuccess: (transaction) => {
        // Update both Supabase and Convex
        onSuccess(transaction);
      },
    });
  };
  
  return { payWithPaystack };
}
```

### 3.2 Payment Method Selection
```tsx
// app/components/Booking/PaymentSelector.tsx
export function PaymentSelector({ amount, onPaymentSuccess }) {
  const { payWithPaystack } = usePaystack();
  const { payWithPayFast } = usePayFast(); // Existing
  
  return (
    <div className="payment-methods">
      <Button onClick={() => payWithPaystack({ amount, onSuccess: onPaymentSuccess })}>
        Pay with Paystack (Recommended for SA)
      </Button>
      <Button onClick={() => payWithPayFast({ amount, onSuccess: onPaymentSuccess })}>
        Pay with PayFast
      </Button>
    </div>
  );
}
```

## Phase 4: Gradual Data Migration (Week 4)

### 4.1 Sync Critical Data to Convex
```ts
// scripts/sync-to-convex.ts
import { ConvexHttpClient } from 'convex/browser';
import { createClient } from '@supabase/supabase-js';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const supabase = createClient(/* your config */);

async function syncBookingsToConvex() {
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('status', 'confirmed');
    
  for (const appointment of appointments) {
    await convex.mutation(api.bookings.create, {
      tenantId: appointment.tenant_id,
      appointmentId: appointment.id,
      status: appointment.status,
    });
  }
}
```

## Environment Variables to Add

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Paystack
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

## Benefits of This Approach

1. **Zero Downtime**: Existing system continues working
2. **Gradual Migration**: Test new features with subset of users
3. **Risk Mitigation**: Fallback to existing systems if issues arise
4. **Cost Optimization**: Only pay for new features you use
5. **Performance Boost**: Real-time updates without full rewrite

## Success Metrics

- [ ] Real-time booking updates working
- [ ] Clerk auth for new user signups
- [ ] Paystack payments processing
- [ ] No disruption to existing bookings
- [ ] Improved user experience metrics