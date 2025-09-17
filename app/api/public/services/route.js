import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const salon = searchParams.get('salon');

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookies().get(name)?.value,
        },
      },
    );

    const { data: services, error } = await supabase
      .from('services')
      .select(
        `

        id,
        name,
        price,
        duration,
        category,
        is_active,
        salons!inner(subdomain)
      `,
      )
      .eq('salons.subdomain', salon)
      .eq('is_active', true);

    if (error) {
      console.error('Services query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 },
      );
    }

    return NextResponse.json({ services: services || [] });
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
