ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS subdomain TEXT,
ADD COLUMN IF NOT EXISTS custom_domain TEXT;

-- It's good practice to add unique constraints if they are expected
-- The prisma schema shows slug and subdomain are unique.
ALTER TABLE public.tenants
ADD CONSTRAINT tenants_slug_unique UNIQUE (slug),
ADD CONSTRAINT tenants_subdomain_unique UNIQUE (subdomain);

-- Backfill the slug for the existing Instyle tenant
UPDATE public.tenants
SET
  slug = 'instylehairboutique',
  subdomain = 'instylehairboutique',
  custom_domain = 'www.instylehairboutique.co.za'
WHERE id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
