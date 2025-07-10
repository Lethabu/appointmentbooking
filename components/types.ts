export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  buffer_before_minutes?: number;
  buffer_after_minutes?: number;
}

export interface Staff {
  id: string;
  name: string;
}

export interface RawAppointmentData {
  id: string;
  start_time: string;
  status: string;
  client_name: string;
  client_phone: string | null;
  services: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration_minutes: number;
  };
  staff: {
    id: string;
    name: string;
  } | null;
  recurrence_rule: string | null;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string | null;
  service: Service[];
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'scheduled' | 'in_progress' | 'completed' | 'no_show';
  staffId?: string | null;
  recurrence_rule?: string | null;
  staff?: Staff;
}