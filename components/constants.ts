import { Service } from './types';

/**
 * The public name of the application.
 */
export const AppName = 'Smart Salon';

/**
 * A collection of application routes.
 */
export const AppRoutes = {
  DASHBOARD: '/',
  AGENT_CHAT: '/agent-chat',
  BOOKINGS: '/bookings',
};

/**
 * Mock data for services offered. In a real application, this would come from an API.
 */
export const MockServices: Service[] = [
  { id: 'svc-1', name: 'Ladies Cut & Style', durationMinutes: 60, price: 450 },
  { id: 'svc-2', name: 'Gents Cut', durationMinutes: 30, price: 250 },
  { id: 'svc-3', name: 'Full Color', durationMinutes: 120, price: 900 },
  { id: 'svc-4', name: 'Highlights', durationMinutes: 150, price: 1200 },
  { id: 'svc-5', name: 'Keratin Treatment', durationMinutes: 180, price: 2000 },
  { id: 'svc-6', name: 'Blow Dry', durationMinutes: 30, price: 200 },
];