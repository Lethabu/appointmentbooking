"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Users, Clock } from "lucide-react"
import { AppointmentLiveView } from "@/components/dashboard/appointment-live-view"
import { ServiceManagement } from "@/components/dashboard/service-management"
import { AIChat } from "@/components/dashboard/ai-chat"
import { KPIWidget } from "@/components/dashboard/kpi-widget"
import { useRealtime } from "@/hooks/use-realtime"
import { useTenantContext } from "@/contexts/tenant-context"
import { useTheme } from "@/contexts/theme-context"
import { formatCurrency } from "@/utils/format-currency"
import type { Appointment } from "@/types"
import { TenantProvider } from "@/contexts/tenant-context"
import { ThemeProvider } from "@/contexts/theme-context"

export default function DashboardPage() {
  return (
    <TenantProvider>
      <ThemeProvider>
        <DashboardPageContent />
      </ThemeProvider>
    </TenantProvider>
  )
}

function DashboardPageContent() {
  const { tenant } = useTenantContext()
  const { tenantName } = useTheme()

  const { data: appointments } = useRealtime<Appointment>("appointments", undefined, tenant?.id)

  // Calculate KPIs from real-time data
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((apt) => apt.date === today)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekAppointments = appointments.filter((apt) => new Date(apt.date) >= weekStart)

  const weeklyRevenue = weekAppointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + apt.price, 0)

  const newClientsThisWeek = new Set(weekAppointments.map((apt) => apt.client_phone)).size

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending").length

  const kpiData = [
    {
      title: "Today's Bookings",
      value: todayAppointments.length.toString(),
      change: "+2 from yesterday",
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Weekly Revenue",
      value: formatCurrency(weeklyRevenue, tenant?.settings.currency),
      change: "+5.2%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "New Clients (This Week)",
      value: newClientsThisWeek.toString(),
      change: "2 more than last week",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.toString(),
      change: "Requires attention",
      trend: "neutral" as const,
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {tenantName}!</h1>
        <p className="text-gray-600">Here's what's happening with your salon today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KPIWidget key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Live Appointments</TabsTrigger>
          <TabsTrigger value="services">Manage Services</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Chat Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentLiveView />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServiceManagement />
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-4">
          <AIChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}
