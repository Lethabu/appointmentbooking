import '@testing-library/jest-dom';

// Mock convex/react hooks globally
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  })),
}));
