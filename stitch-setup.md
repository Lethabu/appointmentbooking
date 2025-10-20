# Stitch UI Integration Setup

This document outlines the integration pattern for using Stitch, an open-source AI-driven UI generation tool, in the multi-tenant appointment booking platform. It aligns with the [UI Enhancement (Stitch) v1.0 spec](docs/specs/ui-enhancement-stitch-v1.0.md), focusing on generating tenant-specific components via CLI prompts, ensuring isolation, and integrating with Next.js 14. Stitch CLI (freemium) generates TSX components from natural language prompts, which are then incorporated into tenant subdomains without full code rewrites.

## Integration Pattern

1. **Prompt Generation**: Admins/tenants submit prompts via a dashboard or CLI to generate UI components (e.g., booking forms, dashboards).
2. **CLI Execution**: Run Stitch CLI to output TSX/CSS files, customized per tenant (e.g., using design tokens from Specify).
3. **Storage & Isolation**: Store generated components in Supabase (e.g., `ui_components` table with RLS on `tenant_id`) or as static files in `components/tenants/[tenant]/`.
4. **Runtime Loading**: Use Next.js dynamic imports or a hook to load components based on resolver.ts tenant context.
5. **Deployment**: Build-time inclusion for static components; runtime fetch for dynamic ones via Supabase Edge Functions.
6. **Validation**: Run health checks post-generation (e.g., `scripts/validate-ui.js`) to ensure no 404s or isolation breaches.
7. **Fallbacks**: Default to platform components if generation fails; cache in Vercel Edge for performance.

This pattern resolves audit issues like 404s on tenant pages (e.g., Instyle e-commerce) by ensuring generated UIs route correctly via `[tenant]` dynamic segments.

## Example Prompt for Booking Form

Use this prompt in Stitch CLI for a tenant-specific booking form:

```bash
Generate a responsive booking form component for a hair salon appointment booking platform. Include:
- Service selection dropdown (fetched from Supabase via useServices hook).
- Realtime calendar for availability (integrate Supabase subscription for slots).
- Client details form (name, email, phone) with Clerk auth prefill.
- Time slot picker with drag-and-drop.
- Submit button that calls createBooking API.
- Styling: Use Tailwind classes with design tokens (e.g., primary color from --tenant-primary).
- Accessibility: ARIA labels, keyboard nav.
- Tenant isolation: Props for tenant_id in queries.
- Error handling: Show loading spinner and error toasts.
Output as React TSX component named BookingForm.tsx, compatible with Next.js 14.
```

Run: `npx stitch generate --prompt "above prompt" --output components/tenants/[tenant]/BookingForm.tsx`

## Next.js Snippet for Component Integration

Integrate generated components in tenant pages, e.g., `app/[tenant]/book/page.tsx`. Use dynamic import for code-splitting and error boundaries.

```typescript
// app/[tenant]/book/page.tsx
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr'; // For RLS
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { getTenant } from '@/lib/resolver'; // Existing tenant resolver

// Dynamically import generated Stitch component
const BookingForm = dynamic(() => import(`../tenants/${params.tenant}/BookingForm`), {
  loading: () => <div>Loading booking form...</div>,
  ssr: false, // Client-side for realtime
});

export default async function BookPage({ params }: { params: { tenant: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
    },
  });

  const { data: tenant } = await getTenant(params.tenant, supabase);
  if (!tenant) notFound();

  // RLS enforced in Supabase queries within component

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Book Appointment for {tenant.name}</h1>
      <BookingForm tenantId={tenant.id} /> {/* Pass tenant_id for isolation */}
    </div>
  );
}
```

### Security in Snippet

- **RLS**: All Supabase queries in `BookingForm` use `tenant_id = auth.jwt()->>'tenant_id'` policy.
- **Auth**: Clerk session via middleware; prefill form with user data if authenticated.

### Jest Test Snippet for Integration

```typescript
// __tests__/useStitchComponent.test.tsx (see hook below for full usage)
import { render, screen } from '@testing-library/react';
import BookingForm from '@/components/tenants/instyle/BookingForm';

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ data: mockServices }),
    }),
  }),
}));

test('BookingForm renders with tenant isolation', () => {
  render(<BookingForm tenantId="instyle" />);
  expect(screen.getByText('Select Service')).toBeInTheDocument();
  // Test RLS: Mock should only return tenant data
});
```

This setup ensures rapid UI enhancements with tenant isolation, compatible with existing Next.js/Supabase/Clerk stack. For data pipeline needs, refer to legacy ETL notes in appendix.

</final>
