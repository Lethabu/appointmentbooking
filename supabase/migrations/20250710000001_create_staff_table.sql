-- Create the staff table
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security for the staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's staff
CREATE POLICY "Allow select on own tenant staff"
ON public.staff
FOR SELECT
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to INSERT their own staff
CREATE POLICY "Allow insert on own tenant staff"
ON public.staff
FOR INSERT
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to UPDATE their own staff
CREATE POLICY "Allow update on own tenant staff"
ON public.staff
FOR UPDATE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()))
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to DELETE their own staff
CREATE POLICY "Allow delete on own tenant staff"
ON public.staff
FOR DELETE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));
