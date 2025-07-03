// middleware.ts
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const host = req.headers.get('host');
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: salon } = await supabase
    .from('salons')
    .select()
    .or(`subdomain.eq.${host.split('.')[0]},custom_domain.eq.${host}`)
    .single();

  if (salon) {
    req.headers.set('x-salon-id', salon.id);
  }
  
  return res;
}