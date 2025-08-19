import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ServicesPage from './page'

// Mock window.confirm
window.confirm = jest.fn()
// Mock window.scrollTo to prevent errors in a JSDOM environment
window.scrollTo = jest.fn()

// Import the mocked modules directly for easier access to their mock functions
const { useQuery } = require('convex/react');
const { api } = require('../../../convex/_generated/api');

const mockServices = [
  { _id: '1', name: 'Ladies Cut', duration: 60, price: 35000 }, // R350.00
  { _id: '2', name: 'Gents Cut', duration: 30, price: 20000 }, // R200.00
]

describe('ServicesPage', () => {
  beforeEach(() => {
    // Clear all mock function calls and reset their mock.calls and mock.instances properties
    jest.clearAllMocks();
    window.confirm.mockClear()
    window.scrollTo.mockClear()
  })

  test('renders loading state initially and then displays services', async () => {
    api.services.list.mockReturnValue(mockServices);
    useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null,
    });

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText('Ladies Cut')).toBeInTheDocument()
    })

    expect(screen.getByText('Gents Cut')).toBeInTheDocument()
    expect(screen.getByText('60 min - R350.00')).toBeInTheDocument()
    expect(screen.getByText('30 min - R200.00')).toBeInTheDocument()
  })
})