-- Create the service_resources join table
CREATE TABLE public.service_resources (
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (service_id, resource_id)
);

-- Enable Row Level Security for the service_resources table
ALTER TABLE public.service_resources ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT service_resources for their own tenant's services
CREATE POLICY "Allow select on own tenant service resources"
ON public.service_resources
FOR SELECT
USING (service_id IN (SELECT id FROM public.services WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

-- Policy: Allow salon owners to INSERT service_resources for their own tenant's services
CREATE POLICY "Allow insert on own tenant service resources"
ON public.service_resources
FOR INSERT
WITH CHECK (service_id IN (SELECT id FROM public.services WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));

-- Policy: Allow salon owners to DELETE service_resources for their own tenant's services
CREATE POLICY "Allow delete on own tenant service resources"
ON public.service_resources
FOR DELETE
USING (service_id IN (SELECT id FROM public.services WHERE salon_id IN (SELECT id FROM public.salons WHERE owner_id = auth.uid())));
