'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
  totalAppointments: number
  todayAppointments: number
  totalRevenue: number
  monthlyRevenue: number
  totalCustomers: number
  upcomingAppointments: Array<{
    id: string
    datetime: string
    customerName: string
    serviceName: string
    price: number
  }>
}

export function RealTimeDashboard({ tenantId }: { tenantId: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadDashboardStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        tenant_uuid: tenantId
      })
      
      if (error) throw error
      setStats(data)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    loadDashboardStats()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' },
        () => loadDashboardStats()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadDashboardStats])

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{(stats.monthlyRevenue / 100).toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.upcomingAppointments?.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{appointment.customerName}</div>
                  <div className="text-sm text-gray-600">{appointment.serviceName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">R{(appointment.price / 100).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(appointment.datetime).toLocaleString('en-ZA')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
