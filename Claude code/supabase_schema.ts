-- supabase/migrations/20250812_instyle_handover.sql
-- Critical tables for Instyle Hair Boutique handover

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table for multi-tenant architecture
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    domain TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table for hair salon services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_zar INTEGER NOT NULL, -- Price in cents
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table with POPIA compliance fields
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    consent_popia BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table for PayFast integration
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    amount_zar INTEGER NOT NULL, -- Amount in cents
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payfast_payment_id TEXT,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY tenant_isolation_services ON services 
    USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_bookings ON bookings 
    USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_payments ON payments 
    USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- Dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats(_tenant_id UUID)
RETURNS TABLE (
    todays_bookings BIGINT,
    weekly_revenue NUMERIC,
    monthly_bookings BIGINT,
    pending_payments BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE DATE(start_time) = CURRENT_DATE) as todays_bookings,
        COALESCE(SUM(s.price_zar::NUMERIC / 100) FILTER (WHERE start_time > CURRENT_DATE - INTERVAL '7 days'), 0) as weekly_revenue,
        COUNT(*) FILTER (WHERE start_time > CURRENT_DATE - INTERVAL '30 days') as monthly_bookings,
        COUNT(p.*) FILTER (WHERE p.status = 'pending') as pending_payments
    FROM bookings b
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN payments p ON b.id = p.booking_id
    WHERE b.tenant_id = _tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Realtime publication for live updates
CREATE PUBLICATION dashboard_changes FOR TABLE bookings, payments;

-- Seed data for Instyle Hair Boutique
INSERT INTO tenants (id, name, subdomain, domain) VALUES 
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Instyle Hair Boutique', 'instyle', 'instylehairboutique.co.za');

-- Seed services for Instyle
INSERT INTO services (tenant_id, name, description, price_zar, duration_minutes) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Women''s Cut & Blow', 'Professional cut and blow dry', 35000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Color Treatment', 'Full color treatment with consultation', 85000, 120),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Men''s Cut', 'Classic men''s haircut', 25000, 30),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Wash & Set', 'Wash and styling service', 30000, 45),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Relaxer Treatment', 'Chemical relaxer with after-care', 65000, 90);

-- Indexes for performance
CREATE INDEX idx_bookings_tenant_date ON bookings(tenant_id, start_time);
CREATE INDEX idx_services_tenant_active ON services(tenant_id, is_active);
CREATE INDEX idx_payments_booking ON payments(booking_id);
