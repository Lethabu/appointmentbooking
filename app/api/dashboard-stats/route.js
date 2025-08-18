import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenant_id') || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

    const { data: stats, error } = await supabase
      .rpc('get_dashboard_stats', { tenant_uuid: tenantId })
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      stats: {
        todaysBookings: parseInt(stats.todays_bookings),
        weeklyRevenue: parseFloat(stats.weekly_revenue),
        totalClients: parseInt(stats.total_clients),
        avgRating: parseFloat(stats.avg_rating)
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}