-- Enable Row Level Security for the appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's appointments
CREATE POLICY "Allow select on own tenant"
ON public.appointments
FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Policy: Allow users to INSERT appointments for their own tenant
CREATE POLICY "Allow insert on own tenant"
ON public.appointments
FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to UPDATE their own tenant's appointments
CREATE POLICY "Allow update on own tenant"
ON public.appointments
FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to DELETE their own tenant's appointments
CREATE POLICY "Allow delete on own tenant"
ON public.appointments
FOR DELETE
USING (tenant_id = public.current_tenant_id());