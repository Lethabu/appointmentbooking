-- Add opening_time and closing_time to salons table
ALTER TABLE public.salons
ADD COLUMN opening_time TIME DEFAULT '09:00:00',
ADD COLUMN closing_time TIME DEFAULT '17:00:00';
