export interface LaunchMetrics {
  traffic_percent: number;
  request_rate: number;
  total_requests: number;
  error_rate: number;
  error_count: number;
  p95_latency: number;
  regions: Array<{ name: string; status: string }>;
}

export interface LaunchStage {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  progress: number;
  sequence: number;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  config?: {
    branding?: {
      logo_url?: string;
      primary_color?: string;
      secondary_color?: string;
    };
  };
  // Add other fields as needed
}
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export interface BookingFormData {
  full_name: string;
  phone_number: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  selected_services: Service[];
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
  sender: 'ai' | 'user';
  timestamp: Date;
  agent_id?: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  service_name: string;
  datetime: string;
  time: string;
  status: string;
  tenant_id: string;
  service_id: string;
  staff_id?: string;
  price: number;
  created_at: string;
  updated_at: string;
}
