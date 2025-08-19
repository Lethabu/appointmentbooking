import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { event, data } = body;
    
    if (event === 'charge.success') {
      const tenant_id = data.metadata.tenant_id;
      
      // Update appointment status to confirmed
      await supabase
        .from('appointments')
        .update({ status: 'confirmed', payment_status: 'paid' })
        .eq('tenant_id', tenant_id)
        .eq('status', 'pending_payment');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}