import { z } from 'zod';

export const appointmentSchema = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  datetime: z.string().datetime(),
  duration: z.number().int().positive(),
  clientEmail: z.string().email(),
});

export const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().positive(),
  is_active: z.boolean().optional(),
});

export const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
});
