import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Helper to verify that the product belongs to the logged-in user's salon
async function verifyProductOwnership(supabase, productId, userId) {
  const { data: product } = await supabase
    .from('products')
    .select('id, salon_id, salons(owner_id)')
    .eq('id', productId)
    .single()

  if (!product || product.salons.owner_id !== userId) {
    return false
  }
  return true
}

export async function PUT(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !await verifyProductOwnership(supabase, params.id, session.user.id)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  // Ensure salon_id is not changed
  delete body.salon_id
  delete body.id

  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !await verifyProductOwnership(supabase, params.id, session.user.id)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', params.id)

  if (error) return new NextResponse(error.message, { status: 500 })

  return new NextResponse(null, { status: 204 })
}