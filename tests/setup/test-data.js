// Test data for InStyle Hair Boutique
export const mockServices = [
  {
    id: 'service-1',
    name: 'Haircut & Blow Dry',
    description: 'Professional haircut with styling',
    price: 350,
    duration: 60,
    category: 'haircut',
  },
  {
    id: 'service-2',
    name: 'Hair Styling',
    description: 'Special occasion styling',
    price: 250,
    duration: 45,
    category: 'styling',
  },
  {
    id: 'service-3',
    name: 'Hair Treatment',
    description: 'Deep conditioning treatment',
    price: 450,
    duration: 90,
    category: 'treatment',
  },
];

export const mockAppointments = [
  {
    id: 'apt-1',
    serviceId: 'service-1',
    clientName: 'Sarah Johnson',
    clientPhone: '+27123456789',
    clientEmail: 'sarah@example.com',
    scheduledTime: new Date('2024-01-15T10:00:00Z'),
    status: 'confirmed',
    tenantId: 'instyle-boutique',
  },
  {
    id: 'apt-2',
    serviceId: 'service-2',
    clientName: 'Lisa Smith',
    clientPhone: '+27987654321',
    clientEmail: 'lisa@example.com',
    scheduledTime: new Date('2024-01-15T14:00:00Z'),
    status: 'pending',
    tenantId: 'instyle-boutique',
  },
];

export const mockClients = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',
    phone: '+27123456789',
    email: 'sarah@example.com',
    totalBookings: 5,
    lastVisit: new Date('2024-01-10T10:00:00Z'),
  },
  {
    id: 'client-2',
    name: 'Lisa Smith',
    phone: '+27987654321',
    email: 'lisa@example.com',
    totalBookings: 2,
    lastVisit: new Date('2024-01-08T14:00:00Z'),
  },
];

export const mockPaymentData = {
  amount: 35000, // R350 in cents
  currency: 'ZAR',
  email: 'sarah@example.com',
  reference: 'booking-apt-1',
};
