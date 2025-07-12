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
  const serviceId = searchParams.get('service_id');

  if (!salonId) {
    return NextResponse.json({ error: 'Missing salon_id parameter' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  let query = supabase
    .from('service_resources')
    .select('*, services(name), resources(name)');

  // Filter by service_id if provided
  if (serviceId) {
    query = query.eq('service_id', serviceId);
  }

  // Ensure only resources for the current salon's services are fetched
  const { data: serviceResources, error } = await query
    .in('service_id', supabase.from('services').select('id').eq('salon_id', salonId));

  if (error) {
    console.error('Error fetching service resources:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(serviceResources);
}

export async function POST(req) {
  const supabase = await getSupabaseClient();
  const { service_id, resource_id, salon_id } = await req.json();

  if (!service_id || !resource_id || !salon_id) {
    return NextResponse.json({ error: 'Missing required fields: service_id, resource_id, salon_id' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  // Verify that the service and resource belong to the salon
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id')
    .eq('id', service_id)
    .eq('salon_id', salon_id)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: 'Service not found or does not belong to this salon' }, { status: 404 });
  }

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id')
    .eq('id', resource_id)
    .eq('salon_id', salon_id)
    .single();

  if (resourceError || !resource) {
    return NextResponse.json({ error: 'Resource not found or does not belong to this salon' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('service_resources')
    .insert({ service_id, resource_id })
    .select()
    .single();

  if (error) {
    console.error('Error linking service to resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req) {
  const supabase = await getSupabaseClient();
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('service_id');
  const resourceId = searchParams.get('resource_id');
  const salonId = searchParams.get('salon_id');

  if (!serviceId || !resourceId || !salonId) {
    return NextResponse.json({ error: 'Missing required parameters: service_id, resource_id, salon_id' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  // Verify that the service and resource belong to the salon before deleting
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id')
    .eq('id', serviceId)
    .eq('salon_id', salonId)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: 'Service not found or does not belong to this salon' }, { status: 404 });
  }

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id')
    .eq('id', resourceId)
    .eq('salon_id', salonId)
    .single();

  if (resourceError || !resource) {
    return NextResponse.json({ error: 'Resource not found or does not belong to this salon' }, { status: 404 });
  }

  const { error } = await supabase
    .from('service_resources')
    .delete()
    .eq('service_id', serviceId)
    .eq('resource_id', resourceId);

  if (error) {
    console.error('Error unlinking service from resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Service-resource link deleted successfully' }, { status: 204 });
}
