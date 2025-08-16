-- Instyle Hair Boutique - Complete Database Setup
-- Migration: 20250812_instyle_handover.sql

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Instyle tenant
INSERT INTO tenants (id, name, domain, settings) VALUES 
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Instyle Hair Boutique', 'instylehairboutique.co.za', 
'{"location": "Soshanguve, Pretoria", "phone": "+27123456789", "hours": "Mon-Sat 9AM-5PM"}')
ON CONFLICT (id) DO NOTHING;

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_zar INTEGER NOT NULL, -- Price in cents
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Instyle services
INSERT INTO services (tenant_id, name, description, price_zar, duration_minutes) VALUES 
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Women''s Cut & Blow', 'Professional cut and blow dry', 35000, 90),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Men''s Cut', 'Classic men''s haircut', 25000, 45),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Color', 'Full hair coloring service', 65000, 180),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Treatment', 'Deep conditioning treatment', 45000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Wash & Set', 'Wash and styling', 30000, 75)
ON CONFLICT DO NOTHING;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    service_id UUID REFERENCES services(id),
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    notes TEXT,
    consent_popia BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats(tenant_uuid UUID)
RETURNS TABLE(
    todays_bookings BIGINT,
    weekly_revenue NUMERIC,
    monthly_bookings BIGINT,
    pending_payments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM bookings WHERE tenant_id = tenant_uuid AND DATE(start_time) = CURRENT_DATE),
        (SELECT COALESCE(SUM(s.price_zar::NUMERIC), 0) FROM bookings b 
         JOIN services s ON b.service_id = s.id 
         WHERE b.tenant_id = tenant_uuid AND b.start_time > CURRENT_DATE - INTERVAL '7 days'),
        (SELECT COUNT(*) FROM bookings WHERE tenant_id = tenant_uuid AND DATE(start_time) >= DATE_TRUNC('month', CURRENT_DATE)),
        0::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_time ON bookings(tenant_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_services_tenant ON services(tenant_id, is_active);