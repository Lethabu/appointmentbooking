import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabaseAndSalonForService(serviceId) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { error: { message: 'Unauthorized' }, status: 401 };

  // Verify the user owns the salon that this service belongs to
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('salons(owner_id)')
    .eq('id', serviceId)
    .single();

  if (serviceError || !service || service.salons.owner_id !== session.user.id) {
    return { error: { message: 'Forbidden' }, status: 403 };
  }

  return { supabase, error: null, status: 200 };
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { supabase, error, status } = await getSupabaseAndSalonForService(id);
  if (error) return NextResponse.json({ error: error.message }, { status });

  const body = await req.json();
  const { error: updateError } = await supabase
    .from('services')
    .update(body)
    .eq('id', id);

  return updateError
    ? NextResponse.json({ error: updateError.message }, { status: 500 })
    : NextResponse.json({ success: true }, { status: 200 });
}
