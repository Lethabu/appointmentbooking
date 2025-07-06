export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  service: Service;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}