-- This is a consolidated migration file. It will drop everything in the public schema and then create the full schema from scratch.

-- Drop everything in the public schema
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- ######################################################
-- ##    APPOINTMENTBOOKINGS SAAS SCHEMA v4.0            ##
-- ##    Enterprise-Grade: RBAC, Analytics, AI, Ops      ##
-- ######################################################


-- =========== TABLE 1: SALONS ===========
CREATE TABLE salons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    logo_url TEXT,
    primary_color TEXT,
    plan TEXT DEFAULT 'trial' NOT NULL, -- 'trial' | 'essential' | 'pro' | 'elite' | 'free'
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_status TEXT, -- 'active', 'past_due', 'cancelled'
    billing_cycle TEXT DEFAULT 'monthly', -- 'monthly', 'annual'
    last_billed_at TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    api_enabled BOOLEAN DEFAULT false,
    whatsapp_enabled BOOLEAN DEFAULT false,
    pricing_model JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 2: PROFILES ===========
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    phone TEXT,
    -- Role is now managed in staff_members for non-clients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 3: STAFF MEMBERS & RBAC ===========
CREATE TABLE staff_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL, -- 'owner', 'manager', 'staff'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(salon_id, user_id)
);

CREATE TABLE staff_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    token TEXT DEFAULT extensions.uuid_generate_v4() UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 4: E-COMMERCE ===========
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INT NOT NULL, -- in cents
    image_urls TEXT[],
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    variants JSONB,
    stock_threshold INT,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES profiles(id),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    total INT NOT NULL, -- in cents
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price INT NOT NULL -- in cents
);

-- =========== TABLE 5: BOOKING & SERVICES ===========
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    duration_minutes INT,
    price INT, -- in cents
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_members(id),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled' NOT NULL, -- 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 6: PAYMENTS & BILLING ===========
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    amount INT NOT NULL, -- in cents
    method TEXT, -- 'payflex', 'netcash_card'
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    transaction_id TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    amount INT NOT NULL,
    type TEXT, -- 'subscription', 'ecommerce_payout'
    status TEXT,
    payment_method TEXT,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 7: AI & OPERATIONAL LOGS ===========
CREATE TABLE chat_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    agent_name TEXT,
    role TEXT, -- 'user' or 'agent'
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reminder_queue (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    send_at TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    phone TEXT,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID,
    salon_id UUID,
    action TEXT,
    path TEXT,
    status INT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 8: SYSTEM & ADMIN ===========
CREATE TABLE api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    key TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE system_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT,
    size BIGINT,
    url TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rate_limits (
    ip INET PRIMARY KEY,
    count INT,
    last_request TIMESTAMP WITH TIME ZONE
);

CREATE TABLE security_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    type TEXT,
    ip INET,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========== TABLE 9: TENANT COMPONENTS ===========
CREATE TABLE tenant_components (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID REFERENCES salons(id) ON DELETE CASCADE,
  comp_type     TEXT CHECK (comp_type IN ('header','footer','hero','menu')),
  comp_name     TEXT,          -- e.g. "InstyleHeader"
  html_chunk    TEXT,          -- pre-rendered safe HTML
  css           TEXT,          -- full CSS string
  version       INTEGER DEFAULT 1,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed for Instyle:
WITH instyle_salon AS (
    INSERT INTO salons (name, subdomain, custom_domain)
    VALUES ('Instyle Hair Boutique', 'instyle', 'instylehairboutique.co.za')
    RETURNING id
)
INSERT INTO tenant_components(tenant_id,comp_type,comp_name,html_chunk,css)
SELECT
    id,
    'header',
    'InstyleHeader',
    '<header class="instyle-header"><img src="https://cdn-instyle/logo.svg"/>...</header>',
    ':root { --primary: #d946ef; --font: "Poppins"; }'
FROM instyle_salon
UNION ALL
SELECT
    id,
    'footer',
    'InstyleFooter',
    '<footer class="instyle-footer"><p>© 2025 Instyle Hair Boutique</p></footer>',
    '{}'
FROM instyle_salon;

-- =========== SECURITY: ROW LEVEL SECURITY (RLS) ===========
-- Enable RLS on all tenant-facing tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Allow public read access to salons" ON salons FOR SELECT USING (true);
CREATE POLICY "Salon owners can manage their own salon details" ON salons FOR ALL USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION get_user_salon_id(user_id_param UUID)
RETURNS UUID AS $$
DECLARE
  salon_uuid UUID;
BEGIN
  SELECT salon_id INTO salon_uuid FROM staff_members WHERE user_id = user_id_param;
  IF NOT FOUND THEN
    SELECT id INTO salon_uuid FROM salons WHERE owner_id = user_id_param;
  END IF;
  RETURN salon_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Staff can access their salon's data" ON services
FOR ALL USING (salon_id = get_user_salon_id(auth.uid()));

CREATE POLICY "Staff can access their salon's data" ON appointments
FOR ALL USING (salon_id = get_user_salon_id(auth.uid()));

CREATE POLICY "Staff can access their salon's data" ON products
FOR ALL USING (salon_id = get_user_salon_id(auth.uid()));

CREATE POLICY "Staff can access their salon's data" ON orders
FOR ALL USING (salon_id = get_user_salon_id(auth.uid()));

-- ... add similar policies for all other tenant-scoped tables ...

-- =========== POSTGRESQL FUNCTIONS (RPCs) ===========

-- Function for user role lookup
CREATE OR REPLACE FUNCTION get_user_role(p_salon_id uuid, p_user_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if owner first
  PERFORM 1 FROM salons WHERE id = p_salon_id AND owner_id = p_user_id;
  IF FOUND THEN
    RETURN 'owner';
  END IF;

  -- Check staff_members table
  SELECT role INTO user_role
  FROM staff_members
  WHERE salon_id = p_salon_id AND user_id = p_user_id;

  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql;

-- Function for global search within a salon
CREATE OR REPLACE FUNCTION global_search(search_term text, p_salon_id uuid)
RETURNS TABLE(id uuid, type text, title text, subtitle text) AS $$
BEGIN
  RETURN QUERY
    -- Appointments
    SELECT a.id, 'appointment' AS type, p.full_name AS title,
           CONCAT('Service: ', s.name, ' • ', TO_CHAR(a.start_time, 'DD Mon HH24:MI')) AS subtitle
    FROM appointments a
    JOIN profiles p ON p.id = a.client_id
    JOIN services s ON s.id = a.service_id
    WHERE a.salon_id = p_salon_id AND (p.full_name ILIKE '%' || search_term || '%' OR s.name ILIKE '%' || search_term || '%')
    UNION ALL
    -- Clients
    SELECT pr.id, 'client' AS type, pr.full_name AS title,
           CONCAT('Phone: ', COALESCE(pr.phone, 'N/A')) AS subtitle
    FROM profiles pr
    WHERE pr.salon_id = p_salon_id AND (pr.full_name ILIKE '%' || search_term || '%' OR pr.phone ILIKE '%' || search_term || '%')
    UNION ALL
    -- Products
    SELECT prod.id, 'product' AS type, prod.name AS title,
           CONCAT('Stock: ', prod.stock_quantity, ' • Price: R', (prod.price/100)::money) AS subtitle
    FROM products prod
    WHERE prod.salon_id = p_salon_id AND prod.name ILIKE '%' || search_term || '%'
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- ... other advanced functions like get_platform_stats, get_salon_financials, etc. would go here ...

-- =========== TRIGGERS ===========

-- Trigger to auto-update appointment status based on time
CREATE OR REPLACE FUNCTION update_appointment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'scheduled';
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.start_time <= NOW() AND (NEW.end_time IS NULL OR NEW.end_time >= NOW()) THEN
      NEW.status := 'in_progress';
    ELSIF NEW.end_time < NOW() THEN
      NEW.status := 'completed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_status_trigger
BEFORE INSERT OR UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_appointment_status();

-- Trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========== INDEXES ===========
CREATE INDEX idx_appointments_salon_time ON appointments (salon_id, start_time);
CREATE INDEX idx_services_salon_active ON services (salon_id, is_active);
CREATE INDEX idx_orders_salon_date ON orders (salon_id, created_at);
CREATE INDEX idx_staff_members_salon_user ON staff_members (salon_id, user_id);

-- Supabase RPC for get_dashboard_stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(salon_id_param uuid)
RETURNS TABLE(total_appointments bigint, total_revenue numeric, latest_booking timestamp with time zone)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM appointments WHERE salon_id = salon_id_param) as total_appointments,
    (SELECT SUM(price) FROM services s JOIN appointments a ON s.id = a.service_id WHERE a.salon_id = salon_id_param) as total_revenue,
    (SELECT MAX(created_at) FROM appointments WHERE salon_id = salon_id_param) as latest_booking;
END;
$$;
