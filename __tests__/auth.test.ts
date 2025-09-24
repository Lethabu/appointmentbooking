/// <reference types="jest" />
import { jest } from '@jest/globals';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin, requireCustomerOrAdmin } from '@/lib/auth';

jest.mock('@clerk/nextjs/server');
jest.mock('next/server');

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockCurrentUser = currentUser as jest.MockedFunction<typeof currentUser>;
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

describe('Auth Utilities', () => {
  const mockRequest = {} as NextRequest;
  const mockUser = {
    id: 'user_123',
    publicMetadata: { role: 'admin' },
    emailAddresses: [{ emailAddress: 'admin@example.com' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockReturnValue({ userId: 'user_123' });
    mockCurrentUser.mockResolvedValue(mockUser);
    mockNextResponse.json.mockReturnValue({ json: true });
  });

  describe('getCurrentUser', () => {
    it('should return user with role when authenticated', async () => {
      const result = await getCurrentUser(mockRequest);
      expect(result).toEqual({
        userId: 'user_123',
        role: 'admin',
        email: 'admin@example.com',
      });
      expect(mockCurrentUser).toHaveBeenCalled();
    });

    it('should throw 401 when no userId', async () => {
      mockAuth.mockReturnValue({ userId: null });
      await expect(getCurrentUser(mockRequest)).rejects.toThrow('Unauthorized');
    });

    it('should default to customer role if none set', async () => {
      mockUser.publicMetadata = {};
      const result = await getCurrentUser(mockRequest);
      expect(result.role).toBe('customer');
    });

    it('should throw 404 when user not found (currentUser returns null)', async () => {
      mockCurrentUser.mockResolvedValue(null);
      await expect(getCurrentUser(mockRequest)).rejects.toThrow('User not found');
    });
  });

  describe('requireAdmin', () => {
    it('should allow admin access', async () => {
      const handler = jest.fn().mockResolvedValue(mockNextResponse.json({ data: 'ok' }));
      const wrapped = requireAdmin(handler);
      const result = await wrapped(mockRequest);
      expect(result).toEqual({ json: true });
      expect(handler).toHaveBeenCalledWith(mockRequest);
    });

    it('should deny non-admin access', async () => {
      mockUser.publicMetadata.role = 'customer';
      const handler = jest.fn();
      const wrapped = requireAdmin(handler);
      const result = await wrapped(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith('Forbidden: Admin access required', { status: 403 });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('requireCustomerOrAdmin', () => {
    it('should allow admin access', async () => {
      const handler = jest.fn().mockResolvedValue(mockNextResponse.json({ data: 'ok' }));
      const wrapped = requireCustomerOrAdmin(handler);
      const result = await wrapped(mockRequest);
      expect(result).toEqual({ json: true });
      expect(handler).toHaveBeenCalled();
    });

    it('should allow customer access', async () => {
      mockUser.publicMetadata.role = 'customer';
      const handler = jest.fn().mockResolvedValue(mockNextResponse.json({ data: 'ok' }));
      const wrapped = requireCustomerOrAdmin(handler);
      const result = await wrapped(mockRequest);
      expect(result).toEqual({ json: true });
      expect(handler).toHaveBeenCalled();
    });

    it('should deny other roles', async () => {
      mockUser.publicMetadata.role = 'guest';
      const handler = jest.fn();
      const wrapped = requireCustomerOrAdmin(handler);
      const result = await wrapped(mockRequest);
      expect(mockNextResponse).toHaveBeenCalledWith('Forbidden: Customer or Admin access required', { status: 403 });
      expect(handler).not.toHaveBeenCalled();
    });
  });
});