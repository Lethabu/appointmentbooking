import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabaseAndSalon(req) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: { message: 'Unauthorized' }, status: 401 };

  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single();

  if (!salon) return { error: { message: 'No salon found' }, status: 403 };

  return { supabase, salon, error: null, status: 200 };
}

export async function GET(req) {
  const { supabase, salon, error, status } = await getSupabaseAndSalon(req);
  if (error) return NextResponse.json({ error: error.message }, { status });

  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salon.id)
    .order('created_at', { ascending: true });

  return NextResponse.json(data);
}

export async function POST(req) {
  const { supabase, salon, error, status } = await getSupabaseAndSalon(req);
  if (error) return NextResponse.json({ error: error.message }, { status });

  const body = await req.json();
  const { error: insertError } = await supabase.from('services').insert({ ...body, salon_id: salon.id });

  return insertError
    ? NextResponse.json({ error: insertError.message }, { status: 500 })
    : NextResponse.json({ success: true }, { status: 201 });
}
