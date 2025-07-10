-- Add schedule_type and date columns to staff_schedules table
ALTER TABLE public.staff_schedules
ADD COLUMN schedule_type TEXT NOT NULL DEFAULT 'working_hours',
ADD COLUMN schedule_date DATE; -- For specific days off or exceptions

-- Add a check constraint for schedule_type
ALTER TABLE public.staff_schedules
ADD CONSTRAINT check_schedule_type
CHECK (schedule_type IN ('working_hours', 'break', 'day_off'));
