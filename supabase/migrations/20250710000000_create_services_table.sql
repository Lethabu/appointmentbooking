-- Create the services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security for the services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's services
CREATE POLICY "Allow select on own tenant services"
ON public.services
FOR SELECT
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to INSERT their own services
CREATE POLICY "Allow insert on own tenant services"
ON public.services
FOR INSERT
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to UPDATE their own services
CREATE POLICY "Allow update on own tenant services"
ON public.services
FOR UPDATE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()))
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to DELETE their own services
CREATE POLICY "Allow delete on own tenant services"
ON public.services
FOR DELETE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));
