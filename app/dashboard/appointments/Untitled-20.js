import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const salonIdentifier = searchParams.get('salon')

  if (!salonIdentifier) {
    return new NextResponse('A salon identifier is required', { status: 400 })
  }

  // This uses the public ANON key, so it's safe for public access.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Find the salon by its subdomain or a full custom domain
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name, logo_url')
    .or(`subdomain.eq.${salonIdentifier},custom_domain.eq.${salonIdentifier}`)
    .single()

  if (!salon) {
    return new NextResponse('Salon not found', { status: 404 })
  }

  // Fetch the active services for that salon
  const { data: services } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price')
    .eq('salon_id', salon.id)
    .order('name', { ascending: true })

  // Return both salon details and its services
  return NextResponse.json({ salon, services })
}