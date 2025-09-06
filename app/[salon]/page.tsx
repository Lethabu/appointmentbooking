import { createServerSupabaseClient, setTenantContext } from '@/lib/supabase'
import { BookingWidget } from '@/components/booking/booking-widget'
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
    .or(`subdomain.eq.${params.salon},custom_domain.eq.${params.salon}`)
    .single()

  if (!tenant) {
    notFound()
  }

  await setTenantContext(tenant.id)

  // Get services for this tenant
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name')

  const branding = tenant.branding || {}

  return (
    <div className="min-h-screen" style={{ backgroundColor: branding.backgroundColor || '#f9fafb' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {branding.logo && (
              <img src={branding.logo} alt={tenant.name} className="h-12 w-auto" />
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: branding.primaryColor || '#1f2937' }}>
                {tenant.name}
              </h1>
              <p className="text-gray-600">Book your appointment online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Booking Widget */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <BookingWidget 
          tenantId={tenant.id}
          services={services || []}
          branding={branding}
        />
      </main>

      {/* Typebot Chat Widget */}
      <div id="typebot-container" className="fixed bottom-4 right-4">
        <script 
          type="module" 
          dangerouslySetInnerHTML={{
            __html: `
              import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js'
              
              Typebot.initBubble({
                typebot: "${process.env.NEXT_PUBLIC_TYPEBOT_ID}",
                theme: {
                  button: { backgroundColor: "${branding.primaryColor || '#6366f1'}" }
                },
                prefilledVariables: {
                  tenantId: "${tenant.id}",
                  tenantName: "${tenant.name}"
                }
              })
            `
          }}
        />
      </div>
    </div>
  )
}