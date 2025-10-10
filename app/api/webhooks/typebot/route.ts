import { NextRequest, NextResponse } from 'next/server';
import { aisensy } from '@/lib/aisensy';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Create server-side Supabase client
function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// It's a good practice to validate incoming data to prevent errors.
// Libraries like Zod are excellent for this.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Add signature verification for the webhook if Typebot supports it.

    const { variables } = body;

    // Validate required variables
    if (!variables || !variables.service || !variables.date || !variables.customerName || !variables.tenantId) {
      return NextResponse.json({ error: 'Missing required variables in webhook payload' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const {
      customerName,
      customerPhone,
      service,
      date,
      tenantId,
    } = variables;

    // Fetch tenant and service data in parallel
    const [serviceRes, tenantRes] = await Promise.all([
      supabase.from('services').select('*').eq('name', service).eq('tenant_id', tenantId).single(),
      supabase.from('tenants').select('name').eq('id', tenantId).single()
    ]);

    const { data: serviceData, error: serviceError } = serviceRes;
    const { data: tenantData, error: tenantError } = tenantRes;

    if (serviceError || !serviceData) {
      console.error('Service not found for tenant:', { service, tenantId, serviceError });
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    if (tenantError || !tenantData) {
        console.error('Tenant not found:', { tenantId, tenantError });
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // For atomicity, consider moving this logic to a Supabase RPC function
    const { data: customer } = await supabase
      .from('customers')
      .upsert({ tenant_id: tenantId, name: customerName, phone: customerPhone, consent_data_processing: true })
      .select('id')
      .single();

    if (!customer?.id) {
      console.error('Failed to create or retrieve customer');
      return NextResponse.json({ error: 'Customer creation failed' }, { status: 500 });
    }

    const { data: appointment } = await supabase
      .from('appointments')
      .insert({ tenant_id: tenantId, service_id: serviceData.id, customer_id: customer.id, datetime: date, price: serviceData.price, status: 'pending' })
      .select('id')
      .single();

    if (!appointment?.id) {
      console.error('Failed to create appointment');
      return NextResponse.json({ error: 'Appointment creation failed' }, { status: 500 });
    }

    // Send a dynamic confirmation message
    const message = `🎉 Booking confirmed!\n\nService: ${service}\nDate: ${new Date(date).toLocaleDateString('en-ZA')}\nPrice: R${(serviceData.price / 100).toFixed(2)}\n\nSee you soon! - ${tenantData.name}`;
    await aisensy.sendMessage(customerPhone, message);

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
    });

  } catch (error) {
    console.error('Typebot webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
