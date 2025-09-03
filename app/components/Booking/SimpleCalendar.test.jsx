import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimpleCalendar from './SimpleCalendar';
import { supabase } from '@/app/utils/supabaseClient';
import { useRouter } from 'next/navigation';

// Mock supabase
jest.mock('@/app/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test_nanoid_123'),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ authorization_url: 'https://paystack.com/pay/test' }),
    ok: true,
  })
);

describe('SimpleCalendar', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  useRouter.mockReturnValue(mockRouter);

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'test@example.com' } } },
    });

    const fromMock = supabase.from;
    fromMock.mockImplementation((tableName) => {
      if (tableName === 'services') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { price_cents: 10000 },
            error: null,
          }),
        };
      }
      if (tableName === 'staff') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: [{ id: 'stylist-1', name: 'Test Stylist' }],
            error: null,
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
      };
    });
  });

  it('should call the correct payment API with correct details on booking', async () => {
    render(<SimpleCalendar salonId="salon-1" serviceId="service-1" />);

    // Select a date
    const dateButton = await screen.findByText('15');
    fireEvent.click(dateButton);

    // Select a time
    const timeButton = await screen.findByText('09:00');
    fireEvent.click(timeButton);

    // Click the booking button
    const bookingButton = screen.getByRole('button', { name: /Confirm Appointment/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/payments/paystack/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: 'booking_test_nanoid_123',
          amount: 10000,
          email: 'test@example.com',
          currency: 'ZAR',
        }),
      });
    });
  });
});
