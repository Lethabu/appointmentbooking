import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET() {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(services || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
