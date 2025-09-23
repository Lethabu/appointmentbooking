-- Run this script in your Supabase SQL Editor

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table with tenant isolation
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(tenant_uuid uuid)
RETURNS TABLE (
  todays_bookings bigint,
  weekly_revenue numeric,
  total_clients bigint,
  avg_rating numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM appointments 
     WHERE tenant_id = tenant_uuid 
     AND DATE(datetime) = CURRENT_DATE) as todays_bookings,
    
    (SELECT COALESCE(SUM(price), 0) FROM appointments 
     WHERE tenant_id = tenant_uuid 
     AND datetime >= CURRENT_DATE - INTERVAL '7 days') as weekly_revenue,
    
    (SELECT COUNT(DISTINCT customer_id) FROM appointments 
     WHERE tenant_id = tenant_uuid 
     AND customer_id IS NOT NULL) as total_clients,
    
    4.8::numeric as avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert Instyle Hair Boutique as default tenant
INSERT INTO tenants (id, name, subdomain, custom_domain) 
VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'InStyle Hair Boutique',
  'instyle',
  'instylehairboutique.co.za'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample services for Instyle
INSERT INTO services (tenant_id, name, description, price, duration) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Cut & Style', 'Professional haircut with styling', 25000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Color', 'Full color service with consultation', 45000, 120),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Treatment', 'Deep conditioning treatment', 35000, 90),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Wash & Blowdry', 'Professional wash and styling', 18000, 45),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Highlights', 'Partial or full highlights', 38000, 150)
ON CONFLICT DO NOTHING;