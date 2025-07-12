import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

async function authorizeUser(supabase, salonId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', session.user.id)
    .single();

  if (salonError || !salon) {
    console.error('Authorization error:', salonError);
    return { authorized: false, response: NextResponse.json({ error: 'Forbidden: Not salon owner' }, { status: 403 }) };
  }
  return { authorized: true };
}

export async function GET(req) {
  const supabase = await getSupabaseClient();

  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salon_id');

  if (!salonId) {
    return NextResponse.json({ error: 'Missing salon_id parameter' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { data: resources, error } = await supabase
    .from('resources')
    .select('id, name, description, is_active')
    .eq('salon_id', salonId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(resources);
}

export async function POST(req) {
  const supabase = await getSupabaseClient();
  const resourceData = await req.json();
  const { salon_id, name, description, is_active } = resourceData;

  if (!salon_id || !name) {
    return NextResponse.json({ error: 'Missing required resource fields' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('resources')
    .insert({
      salon_id,
      name,
      description,
      is_active: is_active !== undefined ? is_active : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  const supabase = await getSupabaseClient();
  const resourceData = await req.json();
  const { id, salon_id, name, description, is_active } = resourceData;

  if (!id || !salon_id) {
    return NextResponse.json({ error: 'Missing resource ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('resources')
    .update({
      name,
      description,
      is_active,
    })
    .eq('id', id)
    .eq('salon_id', salon_id) // Ensure the resource belongs to the salon
    .select()
    .single();

  if (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req) {
  const supabase = await getSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const salonId = searchParams.get('salon_id');

  if (!id || !salonId) {
    return NextResponse.json({ error: 'Missing resource ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
    .eq('salon_id', salonId); // Ensure the resource belongs to the salon

  if (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 204 });
}
