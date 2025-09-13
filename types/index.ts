export interface Tenant {
  id: string
  name: string
  subdomain: string
  custom_domain?: string
  config: {
    branding?: {
      primary_color?: string
      secondary_color?: string
      logo_url?: string
    }
    features?: {
      ai_enabled?: boolean
      analytics_enabled?: boolean
      multi_location?: boolean
    }
  }
  created_at: string
  updated_at: string
  settings?: {
    currency: string;
  }
}

export interface Salon {
  id: string;
  name: string;
  logo_url?: string;
}

export interface Service {
  id: string
  tenant_id: string
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface Appointment {
  id: string
  tenant_id: string
  service_id: string
  customer_id?: string
  staff_id?: string
  datetime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  price: number
  created_at: string
  updated_at: string
  client_name: string
  service_name: string
  client_phone?: string
  time?: string
}

export interface Customer {
  id: string
  tenant_id: string
  name: string
  email?: string
  phone?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  tenant_id: string
  name: string
  email: string
  phone?: string
  role: 'owner' | 'manager' | 'stylist' | 'receptionist'
  active: boolean
  created_at: string
  updated_at: string
}

export interface LaunchStage {
  id: number
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
  sequence: number
}

export interface LaunchMetrics {
  traffic_percent: number
  request_rate: number
  total_requests: number
  error_rate: number
  error_count: number
  p95_latency: number
  regions: Array<{
    name: string
    status: 'operational' | 'degraded' | 'down'
  }>
}

export interface BookingFormData {
  selected_services: Service[];
  full_name: string;
  phone_number: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  agent_id?: string;
  timestamp: Date;
  metadata?: any;
}
