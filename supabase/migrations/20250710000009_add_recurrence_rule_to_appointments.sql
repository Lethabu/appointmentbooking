-- Add recurrence_rule to appointments table
ALTER TABLE public.appointments
ADD COLUMN recurrence_rule TEXT;
