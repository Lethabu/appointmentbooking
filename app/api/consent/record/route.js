import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const { customer_id, consent_type, purpose, data_categories } =
      await request.json();

    const consentRecord = {
      customer_id,
      consent_type,
      purpose,
      data_categories,
      consent_given: true,
      consent_date: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      tenant_id: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
    };

    const { data, error } = await supabase
      .from('consent_records')
      .insert(consentRecord)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      consent_id: data.id,
      message: 'Consent recorded successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
