-- ===================================================================
-- InStyle Smart Salon - Database Schema
-- Corrected and consolidated version
-- ===================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- 1. PROFILES TABLE (User Management)
-- ===================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'staff', 'admin', 'owner')),
  tenant_id TEXT DEFAULT 'instyle',
  profile_image_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ===================================================================
-- 2. SERVICES TABLE (Salon Services)
-- ===================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'instyle' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC(10,2) NOT NULL,
  category TEXT, -- e.g., 'haircut', 'color', 'styling', 'treatment'
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for services
CREATE INDEX IF NOT EXISTS idx_services_tenant ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- ===================================================================
-- 3. STAFF TABLE (Salon Staff/Stylists)
-- ===================================================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tenant_id TEXT DEFAULT 'instyle' NOT NULL,
  display_name TEXT NOT NULL,
  specialties TEXT[], -- Array of specialties
  bio TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for staff
CREATE INDEX IF NOT EXISTS idx_staff_tenant ON staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_available ON staff(is_available);

-- ===================================================================
-- 4. STAFF AVAILABILITY TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS staff_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for staff availability
CREATE INDEX IF NOT EXISTS idx_staff_availability_staff ON staff_availability(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_availability_day ON staff_availability(day_of_week);

-- ===================================================================
-- 5. APPOINTMENTS TABLE (Bookings)
-- ===================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'instyle' NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  client_name TEXT, -- For guest bookings
  client_phone TEXT, -- For guest bookings
  client_email TEXT, -- For guest bookings
  confirmation_sent BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ===================================================================
-- 6. CHAT LOGS TABLE (AI Agent Conversations)
-- ===================================================================
CREATE TABLE IF NOT EXISTS chat_logs (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT, -- For tracking conversations
  agent_name TEXT NOT NULL CHECK (agent_name IN ('Nia', 'Blaze', 'Nova')),
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- For storing additional context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for chat logs
CREATE INDEX IF NOT EXISTS idx_chat_logs_user ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_agent ON chat_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created ON chat_logs(created_at DESC);

-- ===================================================================
-- 7. NOTIFICATIONS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'reminder', 'cancellation', 'update')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push')),
  recipient TEXT NOT NULL, -- Email address or phone number
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_appointment ON notifications(appointment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- ===================================================================
-- 8. TENANTS TABLE (Multi-tenant Support)
-- ===================================================================
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  branding JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tenant (InStyle)
INSERT INTO tenants (id, name, domain, subdomain, branding)
VALUES (
  'instyle',
  'InStyle Hair Boutique',
  'instylehairboutique.co.za',
  'instyle',
  '{"primaryColor": "#d4af37", "secondaryColor": "#2d2d2d", "logo": "/logo.png"}'
)
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles in their tenant"
  ON profiles FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant', TRUE)
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'owner')
    )
  );

-- SERVICES policies (publicly viewable)
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Staff can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- STAFF policies
CREATE POLICY "Anyone can view active staff"
  ON staff FOR SELECT
  USING (is_available = TRUE);

CREATE POLICY "Staff can update their own profile"
  ON staff FOR UPDATE
  USING (user_id = auth.uid());

-- APPOINTMENTS policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL -- Allow guest bookings
  );

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Staff can view all appointments in their tenant"
  ON appointments FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant', TRUE)
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'owner')
    )
  );

-- CHAT LOGS policies
CREATE POLICY "Users can view their own chat logs"
  ON chat_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat messages"
  ON chat_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all chat logs in their tenant"
  ON chat_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- NOTIFICATIONS policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- TENANTS policies
CREATE POLICY "Anyone can view active tenants"
  ON tenants FOR SELECT
  USING (is_active = TRUE);

-- ===================================================================
-- FUNCTIONS & TRIGGERS
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- SEED DATA (for testing)
-- ===================================================================

-- Insert sample services for InStyle
INSERT INTO services (tenant_id, name, description, duration_minutes, price, category, is_active)
VALUES
  ('instyle', 'Ladies Cut & Style', 'Professional haircut and styling for women', 45, 150.00, 'haircut', TRUE),
  ('instyle', 'Gents Cut', 'Classic men''s haircut', 30, 100.00, 'haircut', TRUE),
  ('instyle', 'Full Color Treatment', 'Complete hair coloring service', 120, 450.00, 'color', TRUE),
  ('instyle', 'Highlights', 'Partial highlights or lowlights', 90, 350.00, 'color', TRUE),
  ('instyle', 'Blowout & Style', 'Professional blow dry and styling', 30, 120.00, 'styling', TRUE),
  ('instyle', 'Deep Conditioning Treatment', 'Intensive hair treatment', 45, 200.00, 'treatment', TRUE),
  ('instyle', 'Bridal Package', 'Complete bridal hair and makeup', 180, 800.00, 'special', TRUE),
  ('instyle', 'Kids Cut', 'Haircut for children under 12', 20, 80.00, 'haircut', TRUE)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- CLEANUP OLD DUPLICATE POLICIES (if any exist)
-- ===================================================================

-- Drop duplicate policies if they exist
DO $$
BEGIN
  -- This will help clean up any duplicate policies from previous migrations
  PERFORM pg_advisory_lock(123456);
  -- Add cleanup logic here if needed
  PERFORM pg_advisory_unlock(123456);
END $$;

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Run these after applying schema to verify everything is set up correctly:

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check policies
-- SELECT schemaname, tablename, policyname FROM pg_policies ORDER BY tablename, policyname;

-- Verify seed data
-- SELECT COUNT(*) as service_count FROM services WHERE tenant_id = 'instyle';

-- ===================================================================
-- END OF SCHEMA
-- ===================================================================
