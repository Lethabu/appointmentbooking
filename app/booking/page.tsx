"use client"

import { useState } from "react"
import { BookingHeader } from "@/components/booking/booking-header"
import { ServiceList } from "@/components/booking/service-list"
import { ProductShowcase } from "@/components/booking/product-showcase"
import { AppointmentSummary } from "@/components/booking/appointment-summary"
import { LiveBookingStatus } from "@/app/components/BookingWidget/LiveBookingStatus"
import type { Service, Product } from "@/types"

// Mock data for Instyle Hair Boutique
const mockServices: Service[] = [
  {
    id: "1",
    name: "Signature Cut & Style",
    description: "Premium haircut with personalized styling consultation",
    category: "Styling",
    duration_minutes: 90,
    price: 450,
  },
  {
    id: "2",
    name: "Luxury Blowout",
    description: "Professional blow-dry with premium products",
    category: "Styling",
    duration_minutes: 45,
    price: 280,
  },
  {
    id: "3",
    name: "Full Color Transformation",
    description: "Complete color service with consultation and aftercare",
    category: "Colour",
    duration_minutes: 180,
    price: 850,
  },
  {
    id: "4",
    name: "Root Touch-Up",
    description: "Quick root color refresh",
    category: "Colour",
    duration_minutes: 60,
    price: 320,
  },
  {
    id: "5",
    name: "Keratin Treatment",
    description: "Smoothing treatment for frizz-free hair",
    category: "Treatments",
    duration_minutes: 120,
    price: 650,
  },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Shampoo",
    description: "Sulfate-free luxury shampoo for all hair types",
    price: 180,
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Hydrating Hair Mask",
    description: "Deep conditioning treatment for damaged hair",
    price: 220,
    image_url: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Heat Protection Spray",
    description: "Professional-grade heat protectant",
    price: 150,
    image_url: "/placeholder.svg?height=200&width=200",
  },
]

const salon = {
  id: "1",
  name: "Instyle Hair Boutique",
  logo_url: "/placeholder.svg?height=60&width=200",
  subdomain: "instyle",
}

export default function BookingPage() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
  })

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.find((s) => s.id === service.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBookingSubmit = () => {
    // Handle booking submission
    console.log("Booking submitted:", { selectedServices, formData })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BookingHeader salon={salon} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services and Products */}
          <div className="lg:col-span-2 space-y-8">
            <ServiceList
              services={mockServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
            <ProductShowcase products={mockProducts} />
          </div>

          {/* Right Column - Appointment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <AppointmentSummary
                selectedServices={selectedServices}
                formData={formData}
                onFormChange={handleFormChange}
                onSubmit={handleBookingSubmit}
              />
              
              {/* Real-time booking status */}
              <LiveBookingStatus 
                appointmentId="demo-123"
                tenantId={process.env.NEXT_PUBLIC_INSTYLE_TENANT_ID || "instyle"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
