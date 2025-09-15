import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// A helper to verify the service belongs to the logged-in user's salon
async function verifyServiceOwnership(supabase, serviceId, userId) {
    const { data: service } = await supabase
        .from('services')
        .select('*, salons(owner_id)')
        .eq('id', serviceId)
        .single()

    if (!service || service.salons.owner_id !== userId) {
        return false
    }
    return true
}

export async function PUT(req, { params }) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session || !await verifyServiceOwnership(supabase, params.id, session.user.id)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase.from('services').update(body).eq('id', params.id).select()

    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json(data[0])
}

export async function DELETE(req, { params }) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session || !await verifyServiceOwnership(supabase, params.id, session.user.id)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { error } = await supabase.from('services').delete().eq('id', params.id)

    if (error) return new NextResponse(error.message, { status: 500 })

    return new NextResponse(null, { status: 204 })
}