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
  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id, name, logo_url')
    .or(`subdomain.eq.${salonIdentifier},custom_domain.eq.${salonIdentifier}`)
    .single()

  if (salonError || !salon) {
    return new NextResponse('Salon not found', { status: 404 })
  }

  // Fetch the active, in-stock products for that salon
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, description, price, image_urls, stock_quantity')
    .eq('salon_id', salon.id)
    .gt('stock_quantity', 0) // Only show products that are in stock
    .order('name', { ascending: true })

  if (productsError) return new NextResponse('Error fetching products', { status: 500 })

  // Return both salon details and its products
  return NextResponse.json({ salon, products })
}