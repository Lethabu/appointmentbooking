// app/lib/validators/appointmentValidator.js
import { z } from 'zod';

export const appointmentSchema = z.object({
  salon_id: z.string().uuid(),
  service_id: z.string().uuid(),
  start_time: z.string().datetime(),
  client_name: z.string().min(1, "Client name is required"),
  client_phone: z.string().optional(),
  staff_id: z.string().uuid().optional(),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']).default('scheduled'),
  recurrence_rule: z.string().optional(),
});