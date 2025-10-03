import { createServerSupabaseClient, setTenantContext } from '@/lib/supabase'
import { BookingWidget } from '@/components/booking/booking-widget'
import { TypebotWidget } from '@/components/typebot/typebot-widget'
import { notFound } from 'next/navigation'

interface TenantPageProps {
  params: { salon: string }
}

export default async function TenantPage({ params }: TenantPageProps) {
  const supabase = createServerSupabaseClient()
  
  // Get tenant by subdomain or custom domain
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .or(`slug.eq.${params.salon},custom_domain.eq.${params.salon}`)
    .single()

  if (!tenant) {
    console.error(`Tenant not found for slug: ${params.salon}`);
    notFound()
  }

  // Set the tenant context for RLS
  await setTenantContext(tenant.id)

  // Get services for this tenant
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('name')

  const branding = tenant.branding || {}

  return (
    <div className="flex flex-col" style={{ backgroundColor: branding.backgroundColor || '#f9fafb' }}>

      {/* The Header and Footer are now in the root layout */}

      {/* Booking Widget */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full">
        <BookingWidget 
          tenantId={tenant.id}
          services={services || []}
          branding={branding}
        />
      </main>

      {/* Typebot Chat Widget */}
      <TypebotWidget 
        typebotId={process.env.NEXT_PUBLIC_TYPEBOT_ID || 'instyle-booking-flow'}
        tenantId={tenant.id}
        theme={{
          button: { backgroundColor: branding.primaryColor || '#6366f1' }
        }}
      />
    </div>
  )
}