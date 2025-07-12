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

  const { data: clients, error } = await supabase
    .from('profiles') // Assuming 'profiles' table stores client information
    .select('id, full_name, phone, email, created_at')
    .eq('salon_id', salonId)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(clients);
}

export async function POST(req) {
  const supabase = await getSupabaseClient();
  const clientData = await req.json();
  const { salon_id, full_name, phone, email } = clientData;

  if (!salon_id || !full_name) {
    return NextResponse.json({ error: 'Missing required client fields' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  // For new clients, we might need to create a new auth.users entry if they don't exist
  // For simplicity, this example assumes clients are managed within the profiles table directly
  // without necessarily having a full auth.users entry unless they sign up.
  // In a real app, you'd link to auth.users or create a dummy user if needed.

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      salon_id,
      full_name,
      phone,
      email,
      // role: 'client', // Assuming default role is client
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  const supabase = await getSupabaseClient();
  const clientData = await req.json();
  const { id, salon_id, full_name, phone, email } = clientData;

  if (!id || !salon_id) {
    return NextResponse.json({ error: 'Missing client ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name,
      phone,
      email,
    })
    .eq('id', id)
    .eq('salon_id', salon_id) // Ensure the client belongs to the salon
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
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
    return NextResponse.json({ error: 'Missing client ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .eq('salon_id', salonId); // Ensure the client belongs to the salon

  if (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Client deleted successfully' }, { status: 204 });
}
