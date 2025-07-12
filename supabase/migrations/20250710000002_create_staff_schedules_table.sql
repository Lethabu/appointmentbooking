-- Create the staff_schedules table
CREATE TABLE public.staff_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    day_of_week INT NOT NULL, -- 0 for Sunday, 1 for Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE (staff_id, day_of_week, start_time, end_time)
);

-- Enable Row Level Security for the staff_schedules table
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's staff schedules
CREATE POLICY "Allow select on own tenant staff schedules"
ON public.staff_schedules
FOR SELECT
USING (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

-- Policy: Allow salon owners to INSERT their own staff schedules
CREATE POLICY "Allow insert on own tenant staff schedules"
ON public.staff_schedules
FOR INSERT
WITH CHECK (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

-- Policy: Allow salon owners to UPDATE their own staff schedules
CREATE POLICY "Allow update on own tenant staff schedules"
ON public.staff_schedules
FOR UPDATE
USING (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())))
WITH CHECK (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

-- Policy: Allow salon owners to DELETE their own staff schedules
CREATE POLICY "Allow delete on own tenant staff schedules"
ON public.staff_schedules
FOR DELETE
USING (staff_id IN (SELECT id FROM public.staff WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));
