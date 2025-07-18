-- tenants
create table tenants (
  id uuid primary key default gen_random_uuid(),
  subdomain text unique not null,
  name text not null,
  config jsonb not null default '{}',
  created_at timestamptz default now()
);

-- services
create table services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  duration_min int not null,
  price_cents int not null,
  category text,
  created_at timestamptz default now()
);

-- clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  phone text unique,
  email text,
  name text,
  persona text default 'Default_Client',
  consent jsonb default '{}',
  created_at timestamptz default now()
);

-- bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  client_id uuid references clients(id),
  service_id uuid references services(id),
  start_at timestamptz not null,
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- RLS
alter table services enable row level security;
create policy services_tenant_isolation on services
  using (tenant_id = current_setting('app.tenant_id')::uuid);

alter table clients enable row level security;
create policy clients_tenant_isolation on clients
  using (tenant_id = current_setting('app.tenant_id')::uuid);

alter table bookings enable row level security;
create policy bookings_tenant_isolation on bookings
  using (tenant_id = current_setting('app.tenant_id')::uuid);
