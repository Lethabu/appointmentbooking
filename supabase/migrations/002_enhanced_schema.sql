-- Enhanced multi-tenant schema with POPIA compliance

-- Add branding and configuration to tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS 
  branding JSONB DEFAULT '{
    "primaryColor": "#6366f1",
    "logo": "",
    "whatsappNumber": "",
    "businessHours": {"mon": "09:00-17:00", "tue": "09:00-17:00", "wed": "09:00-17:00", "thu": "09:00-17:00", "fri": "09:00-17:00", "sat": "09:00-15:00", "sun": "closed"}
  }';

-- Add POPIA compliance fields
ALTER TABLE customers ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS consent_data_processing BOOLEAN DEFAULT true;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'staff',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table for upsells
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT DEFAULT 'product',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment_products for upsells
CREATE TABLE IF NOT EXISTS appointment_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price INTEGER NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Tenant isolation for staff" ON staff FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant isolation for products" ON products FOR ALL USING (tenant_id = current_tenant_id());

-- Create dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats(tenant_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalAppointments', (SELECT COUNT(*) FROM appointments WHERE tenant_id = tenant_uuid),
    'todayAppointments', (SELECT COUNT(*) FROM appointments WHERE tenant_id = tenant_uuid AND DATE(datetime) = CURRENT_DATE),
    'totalRevenue', (SELECT COALESCE(SUM(price), 0) FROM appointments WHERE tenant_id = tenant_uuid AND status = 'completed'),
    'monthlyRevenue', (SELECT COALESCE(SUM(price), 0) FROM appointments WHERE tenant_id = tenant_uuid AND status = 'completed' AND DATE_TRUNC('month', datetime) = DATE_TRUNC('month', CURRENT_DATE)),
    'totalCustomers', (SELECT COUNT(DISTINCT customer_id) FROM appointments WHERE tenant_id = tenant_uuid),
    'upcomingAppointments', (
      SELECT json_agg(json_build_object(
        'id', a.id,
        'datetime', a.datetime,
        'customerName', c.name,
        'serviceName', s.name,
        'price', a.price
      ))
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.tenant_id = tenant_uuid 
      AND a.datetime > NOW()
      ORDER BY a.datetime
      LIMIT 5
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create data anonymization function for POPIA compliance
CREATE OR REPLACE FUNCTION anonymize_customer_data(customer_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE customers 
  SET 
    name = 'Anonymous Customer',
    email = NULL,
    phone = NULL,
    notes = 'Data anonymized per POPIA request'
  WHERE id = customer_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;