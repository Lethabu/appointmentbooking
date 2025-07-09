-- Enable Row Level Security for the services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's services
CREATE POLICY "Allow select on own tenant"
ON public.services
FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Policy: Allow users to INSERT services for their own tenant
CREATE POLICY "Allow insert on own tenant"
ON public.services
FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to UPDATE their own tenant's services
CREATE POLICY "Allow update on own tenant"
ON public.services
FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to DELETE their own tenant's services
CREATE POLICY "Allow delete on own tenant"
ON public.services
FOR DELETE
USING (tenant_id = public.current_tenant_id());