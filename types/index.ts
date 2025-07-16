export interface Tenant {
  id: string
  name: string
  subdomain: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  created_at: string
  settings: TenantSettings
}

export interface TenantSettings {
  currency: "ZAR" | "USD" | "EUR"
  timezone: string
  language: "en" | "af" | "zu"
  booking_window_days: number
  auto_confirm_bookings: boolean
}

export interface Service {
  id: string
  tenant_id: string
  name: string
  description: string
  category: string
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  tenant_id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  is_active: boolean
}

export interface Appointment {
  id: string
  tenant_id: string
  client_name: string
  client_phone: string
  client_email?: string
  service_id: string
  service_name: string
  date: string
  time: string
  duration_minutes: number
  price: number
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  notes?: string
  created_at: string
  updated_at: string
}

export interface BookingFormData {
  full_name: string
  phone_number: string
  email?: string
  selected_services: Service[]
  preferred_date?: string
  preferred_time?: string
  notes?: string
}

export interface AIAgent {
  id: string
  name: string
  description: string
  avatar_url?: string
  capabilities: string[]
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  agent_id?: string
  timestamp: Date
  metadata?: Record<string, any>
}
