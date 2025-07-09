-- Enable Row Level Security for the products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to SELECT their own tenant's products
CREATE POLICY "Allow select on own tenant"
ON public.products
FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Policy: Allow users to INSERT products for their own tenant
CREATE POLICY "Allow insert on own tenant"
ON public.products
FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to UPDATE their own tenant's products
CREATE POLICY "Allow update on own tenant"
ON public.products
FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- Policy: Allow users to DELETE their own tenant's products
CREATE POLICY "Allow delete on own tenant"
ON public.products
FOR DELETE
USING (tenant_id = public.current_tenant_id());