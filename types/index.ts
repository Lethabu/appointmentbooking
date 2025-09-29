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
  // Add other fields as needed
}
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}
