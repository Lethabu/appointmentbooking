import { z } from 'zod';

export const appointmentSchema = z.object({
  datetime: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Appointment must be in the future',
  }),
  duration: z.number().int().positive(),
  clientEmail: z.string().email(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().positive(),
});

export const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
