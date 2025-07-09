-- Enable Row Level Security for the customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's customers
CREATE POLICY "Allow select on own tenant"
ON public.customers
FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Policy: Allow users to INSERT customers for their own tenant
CREATE POLICY "Allow insert on own tenant"
ON public.customers
FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to UPDATE their own tenant's customers
CREATE POLICY "Allow update on own tenant"
ON public.customers
FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to DELETE their own tenant's customers
CREATE POLICY "Allow delete on own tenant"
ON public.customers
FOR DELETE
USING (tenant_id = public.current_tenant_id());