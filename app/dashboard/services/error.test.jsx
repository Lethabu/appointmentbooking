import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesPageContent from './page'; // Assuming ServicesPageContent is exported

// Mock @tanstack/react-query's useQuery and useMutation hooks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

describe('ServicesPageContent Error Rendering', () => {
  test('displays the error message when an error occurs', () => {
    // Mock useQuery to return an error state
    useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Test Network Error'),
    });

    render(<ServicesPageContent />);

    expect(screen.getByText('Error: Test Network Error')).toBeInTheDocument();
  });
});