// Mock API functions with simulated delays
export const fetchServices = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 1, name: 'Haircut', duration: '30 mins', price: 150 },
    { id: 2, name: 'Coloring', duration: '2 hrs', price: 450 },
    { id: 3, name: 'Styling', duration: '1 hr', price: 200 },
  ];
};

export const fetchAppointments = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { 
      id: 1,
      client: 'John Doe',
      service: 'Haircut',
      datetime: '2025-07-15 10:00',
      status: 'confirmed',
      price: 150
    },
    {
      id: 2,
      client: 'Jane Smith',
      service: 'Coloring',
      datetime: '2025-07-15 14:30',
      status: 'pending',
      price: 450
    },
  ];
};

export const fetchDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalAppointments: 24,
    revenue: 12500,
    upcomingBookings: 8
  };
};