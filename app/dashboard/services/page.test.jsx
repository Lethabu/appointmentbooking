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
  })

  test('renders loading state initially and then displays services', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices,
    })

    render(<ServicesPage />)

    expect(screen.getByText('Loading services...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Ladies Cut')).toBeInTheDocument()
    })

    expect(screen.getByText('Gents Cut')).toBeInTheDocument()
    expect(screen.getByText('60 min - R350.00')).toBeInTheDocument()
    expect(screen.getByText('30 min - R200.00')).toBeInTheDocument()
  })

  test('displays an error message if fetching services fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Network Error' }),
    })

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText('Error: Network Error')).toBeInTheDocument()
    })
  })

  test('displays empty state when no services are available', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText("You haven't added any services yet.")).toBeInTheDocument()
    })
  })

  test('allows adding a new service', async () => {
    // Initial fetch is empty
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<ServicesPage />)

    await waitFor(() => {
      expect(screen.getByText("You haven't added any services yet.")).toBeInTheDocument()
    })

    // Mock the POST request for adding a service
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '3', name: 'Manicure', duration_minutes: 45, price: 25000 }),
    })
    // Mock the re-fetch after adding
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '3', name: 'Manicure', duration_minutes: 45, price: 25000 }],
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
      const lastCall = fetch.mock.calls[1]
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
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices,
    })

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

    // Mock the PUT request and subsequent re-fetch
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 37550 }) })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: '1', name: 'Ladies Cut', duration_minutes: 60, price: 37550 }, mockServices[1]] })

    fireEvent.click(screen.getByRole('button', { name: 'Update Service' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard/services/1', expect.objectContaining({ method: 'PUT' }))
    })

    await waitFor(() => {
      expect(screen.getByText('60 min - R375.50')).toBeInTheDocument()
    })
  })

  test('allows deleting a service after confirmation', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockServices })
    render(<ServicesPage />)
    await waitFor(() => expect(screen.getByText('Ladies Cut')).toBeInTheDocument())

    window.confirm.mockReturnValue(true)

    // Mock the DELETE request and subsequent re-fetch
    fetch.mockResolvedValueOnce({ ok: true })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [mockServices[1]] })

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