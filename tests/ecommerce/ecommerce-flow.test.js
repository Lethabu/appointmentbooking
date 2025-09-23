import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmartProductShowcase from '../../components/ecommerce/SmartProductShowcase';
import * as cartStore from '../../app/utils/cartStore';

// Mock cart store
jest.mock('../../app/utils/cartStore', () => ({
  useCartStore: jest.fn(() => ({
    addItem: jest.fn(),
    items: [],
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe('E-Commerce Flow', () => {
  beforeEach(() => {
    fetch.mockClear();
    cartStore.useCartStore.mockReturnValue({
      addItem: jest.fn(),
      items: [],
    });
  });

  it('should load products and add to cart', async () => {
    const mockProducts = [
      {
        id: 'prod_1',
        name: 'Hair Kit',
        price: 25000,
        stock_quantity: 10,
        image_urls: [],
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const mockAddItem = jest.fn();
    cartStore.useCartStore.mockReturnValue({
      addItem: mockAddItem,
      items: [],
    });

    render(<SmartProductShowcase tenantId="test" />);

    await waitFor(() => {
      expect(screen.getByText('Hair Kit')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      id: 'prod_1',
      name: 'Hair Kit',
      price: 250,
      salonSlug: 'test',
    });
  });

  it('should show AI recommendations when customer ID provided', async () => {
    const mockProducts = [
      {
        id: 'prod_1',
        name: 'Hair Kit',
        price: 25000,
        stock_quantity: 10,
        image_urls: [],
      },
    ];
    const mockRecommendations = {
      recommendations: [{ id: 'prod_1', reason: 'Perfect for your hair type' }],
    };

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecommendations,
      });

    render(<SmartProductShowcase tenantId="test" customerId="customer_1" />);

    await waitFor(() => {
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      expect(
        screen.getByText('Perfect for your hair type'),
      ).toBeInTheDocument();
    });
  });
});

describe('Paystack Checkout API', () => {
  it('should create order and initialize payment', async () => {
    const mockOrderData = {
      cartItems: [{ id: 'prod_1', price: 250, quantity: 1 }],
      customerData: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
      },
      tenantId: 'test',
    };

    // Mock Paystack response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        data: {
          authorization_url: 'https://checkout.paystack.com/test',
          reference: 'test_ref_123',
        },
      }),
    });

    const response = await fetch('/api/checkout/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOrderData),
    });

    const result = await response.json();

    expect(result.success).toBe(true);
    expect(result.authorization_url).toBe('https://checkout.paystack.com/test');
  });
});
