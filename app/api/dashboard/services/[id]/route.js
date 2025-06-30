import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  // Fetch the user's salon ID to ensure operations are scoped correctly.
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  const body = await req.json()
  // Sanitize body to prevent changing immutable fields
  delete body.id
  delete body.salon_id
  delete body.created_at

  const { data, error } = await supabase
    .from('services')
    .update(body)
    // The .eq('salon_id', salon.id) ensures a user can only update a service that belongs to their salon.
    .eq('id', params.id)
    .eq('salon_id', salon?.id) // Use optional chaining in case salon is null
    .select()
    .single()

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  if (!data) {
    return new NextResponse(JSON.stringify({ error: 'Service not found or you do not have permission to edit it.' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  return NextResponse.json(data)
}

export async function DELETE(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  }

  // Fetch the user's salon ID to ensure operations are scoped correctly.
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  const { error, count } = await supabase
    .from('services')
    .delete({ count: 'exact' })
    .eq('id', params.id)
    .eq('salon_id', salon?.id) // Use optional chaining in case salon is null

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })

  if (count === 0) {
    return new NextResponse(JSON.stringify({ error: 'Service not found or you do not have permission to delete it.' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }

  return new NextResponse(null, { status: 204 })
}