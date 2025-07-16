"use client"
import { TenantProvider } from "@/contexts/tenant-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { BookingPageContent } from "@/components/booking/booking-page-content"

interface BookingPageProps {
  params: {
    subdomain: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <TenantProvider>
      <ThemeProvider>
        <BookingPageContent />
      </ThemeProvider>
    </TenantProvider>
  )
}
