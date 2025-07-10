-- Create the resources table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security for the resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's resources
CREATE POLICY "Allow select on own tenant resources"
ON public.resources
FOR SELECT
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to INSERT their own resources
CREATE POLICY "Allow insert on own tenant resources"
ON public.resources
FOR INSERT
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to UPDATE their own resources
CREATE POLICY "Allow update on own tenant resources"
ON public.resources
FOR UPDATE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()))
WITH CHECK (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));

-- Policy: Allow salon owners to DELETE their own resources
CREATE POLICY "Allow delete on own tenant resources"
ON public.resources
FOR DELETE
USING (salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid()));
