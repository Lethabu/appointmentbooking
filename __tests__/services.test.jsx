
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesPage from '../app/(main)/dashboard/services/page';
import { render } from './test-utils';
import { useQuery } from '@tanstack/react-query';

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // import and retain default behavior
  useQuery: jest.fn(),
}));

// Mock window confirmation
global.confirm = jest.fn(() => true);

// Mock scrollTo
global.scrollTo = jest.fn();

const mockServices = [
  { id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 35000 },
  { id: '2', name: 'Gents Cut', duration_minutes: 30, price: 20000 },
];

describe('ServicesPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    useQuery.mockClear();
    global.confirm.mockClear();
    global.scrollTo.mockClear();
  });

  test('renders loading state initially', () => {
    useQuery.mockReturnValue({ isLoading: true, data: undefined });
    render(<ServicesPage />);
    expect(screen.getByText(/Loading services.../i)).toBeInTheDocument();
  });

  test('renders services when data is loaded', async () => {
    useQuery.mockReturnValue({ isLoading: false, data: mockServices });
    render(<ServicesPage />);

    // Wait for services to be rendered
    await waitFor(() => {
      expect(screen.getByText('Ladies Cut')).toBeInTheDocument();
    });

    // Check for all elements
    expect(screen.getByText('Gents Cut')).toBeInTheDocument();
    expect(screen.getByText('60 min - R350.00')).toBeInTheDocument();
    expect(screen.getByText('30 min - R200.00')).toBeInTheDocument();
  });

  test('renders no services message when data is empty', async () => {
    useQuery.mockReturnValue({ isLoading: false, data: [] });
    render(<ServicesPage />);

    await waitFor(() => {
      // Updated to match the actual component text
      expect(screen.getByText(/You haven't added any services yet./i)).toBeInTheDocument();
    });
  });
});
