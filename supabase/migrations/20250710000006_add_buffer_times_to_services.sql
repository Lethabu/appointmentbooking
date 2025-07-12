-- Add buffer_before_minutes and buffer_after_minutes to services table
ALTER TABLE public.services
ADD COLUMN buffer_before_minutes INT DEFAULT 0,
ADD COLUMN buffer_after_minutes INT DEFAULT 0;
