-- =========== ECOMMERCE & CONVERSATIONAL COMMERCE ENHANCEMENT ===========
-- Strategic improvements for InStyle Hair Boutique multi-channel commerce

-- Enhanced Products table with social commerce fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_commerce_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS whatsapp_catalog_id TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS social_media_urls JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_metadata JSONB DEFAULT '{}';

-- WhatsApp Catalog Management
CREATE TABLE whatsapp_catalogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    catalog_id TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    last_synced_at TIMESTAMP WITH TIME ZONE,
    product_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversational Commerce Sessions
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_name TEXT,
    platform TEXT NOT NULL, -- 'whatsapp', 'website', 'instagram'
    session_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Management (for abandoned cart recovery)
CREATE TABLE carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    customer_phone TEXT,
    customer_email TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    total_amount INT NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'active', -- 'active', 'abandoned', 'converted', 'expired'
    abandoned_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Integration
CREATE TABLE social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL, -- 'instagram', 'tiktok', 'facebook'
    post_id TEXT NOT NULL,
    post_url TEXT,
    product_tags JSONB DEFAULT '[]',
    engagement_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Automation
CREATE TABLE automation_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- 'abandoned_cart', 'post_purchase', 'booking_reminder'
    conditions JSONB DEFAULT '{}',
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Journey Tracking
CREATE TABLE customer_touchpoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    customer_phone TEXT NOT NULL,
    touchpoint_type TEXT NOT NULL, -- 'website_visit', 'whatsapp_message', 'social_click', 'booking', 'purchase'
    source TEXT, -- 'instagram', 'tiktok', 'whatsapp', 'website', 'google'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Analytics Views
CREATE OR REPLACE VIEW tenant_analytics AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue,
    COUNT(DISTINCT ct.customer_phone) as unique_customers,
    COUNT(DISTINCT cs.id) as chat_sessions,
    COUNT(DISTINCT sp.id) as social_posts
FROM tenants t
LEFT JOIN appointments a ON t.id = a.tenant_id
LEFT JOIN orders o ON t.id = o.tenant_id
LEFT JOIN customer_touchpoints ct ON t.id = ct.tenant_id
LEFT JOIN chat_sessions cs ON t.id = cs.tenant_id
LEFT JOIN social_posts sp ON t.id = sp.tenant_id
GROUP BY t.id, t.name;

-- Indexes for performance
CREATE INDEX idx_products_tenant_category ON products (tenant_id, category);
CREATE INDEX idx_products_sku ON products (sku);
CREATE INDEX idx_carts_status_expires ON carts (status, expires_at);
CREATE INDEX idx_chat_sessions_phone ON chat_sessions (customer_phone);
CREATE INDEX idx_customer_touchpoints_phone_date ON customer_touchpoints (customer_phone, created_at);

-- RLS Policies
ALTER TABLE whatsapp_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_touchpoints ENABLE ROW LEVEL SECURITY;

-- Policies for new tables
CREATE POLICY "Tenant isolation for whatsapp_catalogs" ON whatsapp_catalogs
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

CREATE POLICY "Tenant isolation for chat_sessions" ON chat_sessions
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

CREATE POLICY "Tenant isolation for carts" ON carts
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

CREATE POLICY "Tenant isolation for social_posts" ON social_posts
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

CREATE POLICY "Tenant isolation for automation_workflows" ON automation_workflows
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

CREATE POLICY "Tenant isolation for customer_touchpoints" ON customer_touchpoints
  FOR ALL USING (get_user_tenant_id(auth.uid()) = tenant_id);

-- Seed InStyle Hair Boutique products
INSERT INTO products (tenant_id, name, description, price, category, sku, image_urls, stock_quantity) VALUES
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Premium Lace Front Wig - 20"', 'High-quality human hair lace front wig, 20 inches, natural black', 45000, 'Wigs', 'IHB-LFW-20-BLK', ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'], 5),
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Brazilian Hair Bundle - 18"', 'Premium Brazilian virgin hair bundle, 18 inches, natural wave', 35000, 'Hair Bundles', 'IHB-BRZ-18-NAT', ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'], 8),
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Hair Care Kit', 'Complete hair care kit with shampoo, conditioner, and treatment oil', 15000, 'Care Products', 'IHB-CARE-KIT', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], 20),
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Silk Hair Bonnet', 'Premium silk hair bonnet for overnight protection', 8000, 'Accessories', 'IHB-SILK-BONNET', ARRAY['https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400'], 15),
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Installation Service Bundle', 'Professional installation service with aftercare products', 60000, 'Services', 'IHB-INSTALL-BUNDLE', ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'], 100);

-- Seed automation workflows for InStyle
INSERT INTO automation_workflows (tenant_id, name, trigger_type, conditions, actions) VALUES
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Abandoned Cart Recovery', 'abandoned_cart', 
 '{"delay_hours": 2, "min_cart_value": 10000}',
 '[{"type": "whatsapp_message", "template": "abandoned_cart", "delay_minutes": 120}]'),
((SELECT id FROM tenants WHERE subdomain = 'instyle'), 'Post-Installation Upsell', 'post_purchase',
 '{"service_category": "installation"}',
 '[{"type": "whatsapp_message", "template": "care_product_upsell", "delay_hours": 72}]');