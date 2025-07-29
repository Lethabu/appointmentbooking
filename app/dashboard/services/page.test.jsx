import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ServicesPage from './page'

// Mock the global fetch function
global.fetch = jest.fn()
// Mock window.confirm
window.confirm = jest.fn()
// Mock window.scrollTo to prevent errors in a JSDOM environment
window.scrollTo = jest.fn()

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

const mockServices = [
  { id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 35000 }, // R350.00
  { id: '2', name: 'Gents Cut', duration_minutes: 30, price: 20000 }, // R200.00
]

describe('ServicesPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    fetch.mockClear()
    window.confirm.mockClear()
    window.scrollTo.mockClear()
    // No useQuery.mockReset() here
  })

  test('renders loading state initially and then displays services', async () => {
    require('@tanstack/react-query').useQuery.mockReturnValue({
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

  test('displays an error message if fetching services fails', async () => {
    require('@tanstack/react-query').useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Network Error'),
    });

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText(/Error: Network Error/)).toBeInTheDocument()
    })
  })

  test('displays empty state when no services are available', async () => {
    require('@tanstack/react-query').useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText("You haven't added any services yet.")).toBeInTheDocument()
    })
  })

  test('allows adding a new service', async () => {
    // Mock useQuery for initial empty state
    require('@tanstack/react-query').useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText("You haven't added any services yet.")).toBeInTheDocument()
    })

    // Mock useQuery for re-fetch after adding
    require('@tanstack/react-query').useQuery.mockImplementationOnce(() => ({
      data: [{ id: '3', name: 'Manicure', duration_minutes: 45, price: 25000 }],
      isLoading: false,
      error: null,
    }));

    // Mock the POST request for adding a service
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '3', name: 'Manicure', duration_minutes: 45, price: 25000 }),
    })

    fireEvent.change(screen.getByPlaceholderText('Service Name (e.g., Ladies Cut)'), {
      target: { value: 'Manicure' },
    })
    fireEvent.change(screen.getByPlaceholderText('Duration (minutes)'), {
      target: { value: '45' },
    })
    fireEvent.change(screen.getByPlaceholderText('Price (R)'), {
      target: { value: '250.00' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add Service' }))

    await waitFor(() => {
      // Check that the POST request was made correctly
      const lastCall = fetch.mock.calls[0] // Changed from [1] to [0] as useQuery is mocked
      expect(lastCall[0]).toBe('/api/dashboard/services')
      const body = JSON.parse(lastCall[1].body)
      expect(body.name).toBe('Manicure')
      expect(body.duration_minutes).toBe(45)
      expect(body.price).toBe(25000)
    })

    await waitFor(() => {
      expect(screen.getByText('Manicure')).toBeInTheDocument()
    })
    expect(screen.getByText('45 min - R250.00')).toBeInTheDocument()
  })

  test('allows editing a service', async () => {
    // Mock useQuery for initial state
    require('@tanstack/react-query').useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null,
    });

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText('Ladies Cut')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0]) // Click edit for "Ladies Cut"

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ladies Cut')).toBeInTheDocument()
      expect(screen.getByDisplayValue('60')).toBeInTheDocument()
      expect(screen.getByDisplayValue('350.00')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Update Service' })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Price (R)'), {
      target: { value: '375.50' },
    })

    // Mock useQuery for re-fetch after updating
    require('@tanstack/react-query').useQuery.mockImplementationOnce(() => ({
      data: [{ id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 37550 }, mockServices[1]],
      isLoading: false,
      error: null,
    }));

    // Mock the PUT request
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 37550 }) })

    fireEvent.click(screen.getByRole('button', { name: 'Update Service' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard/services/1', expect.objectContaining({ method: 'PUT' }))
    })

    await waitFor(() => {
      expect(screen.getByText('60 min - R375.50')).toBeInTheDocument()
    })
  })

  test('allows deleting a service after confirmation', async () => {
    // Mock useQuery for initial state
    require('@tanstack/react-query').useQuery.mockReturnValue({
      data: mockServices,
      isLoading: false,
      error: null,
    });

    render(<ServicesPage />)
    await waitFor(() => expect(screen.getByText('Ladies Cut')).toBeInTheDocument())

    window.confirm.mockReturnValue(true)

    // Mock useQuery for re-fetch after deleting
    require('@tanstack/react-query').useQuery.mockImplementationOnce(() => ({
      data: [mockServices[1]],
      isLoading: false,
      error: null,
    }));

    // Mock the DELETE request
    fetch.mockResolvedValueOnce({ ok: true })

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButtons[0]) // Click delete for "Ladies Cut"

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this service?')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard/services/1', { method: 'DELETE' })
    })

    await waitFor(() => {
      expect(screen.queryByText('Ladies Cut')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Gents Cut')).toBeInTheDocument()
  })
})