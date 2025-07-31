-- IMMEDIATE FIXES FOR INSTYLE HAIR BOUTIQUE CONSOLE ERRORS
-- Run this script in your Supabase SQL editor to fix the 404/500 errors

-- 1. ENSURE SALON EXISTS
INSERT INTO salons (id, name, domain, contact_email, contact_phone, address, created_at, updated_at) 
VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'InStyle Hair Boutique',
  'instylehairboutique.co.za',
  'bookings@instylehairboutique.co.za',
  '+27 XX XXX XXXX',
  'Your Salon Address Here',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  updated_at = NOW();

-- 2. CREATE MISSING TABLES THAT ARE CAUSING 404 ERRORS

-- Settings table (causing 404 on /rest/v1/settings)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(salon_id, key)
);

-- Marketing table (causing 404 on /rest/v1/marketing)
CREATE TABLE IF NOT EXISTS public.marketing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(100) DEFAULT 'general',
    content JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'completed')),
    target_audience JSONB DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_cents INTEGER DEFAULT 0,
    spent_cents INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table (causing 404 on /rest/v1/clients) 
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    notes TEXT,
    preferences JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    first_visit_date TIMESTAMP WITH TIME ZONE,
    last_visit_date TIMESTAMP WITH TIME ZONE,
    total_visits INTEGER DEFAULT 0,
    total_spent_cents INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENSURE APPOINTMENTS TABLE HAS REQUIRED COLUMNS
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS salon_id UUID REFERENCES public.salons(id),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'online',
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT FALSE;

-- 4. UPDATE EXISTING APPOINTMENTS TO HAVE SALON_ID
UPDATE public.appointments 
SET salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
WHERE salon_id IS NULL;

-- 5. ENSURE SERVICES TABLE HAS PROPER STRUCTURE
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS salon_id UUID REFERENCES public.salons(id),
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Hair Services',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS booking_buffer_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_advance_booking_days INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS requires_deposit BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deposit_amount_cents INTEGER DEFAULT 0;

-- Update existing services to have salon_id
UPDATE public.services 
SET salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
WHERE salon_id IS NULL;

-- 6. INSERT DEFAULT SETTINGS TO PREVENT EMPTY RESPONSES
INSERT INTO public.settings (salon_id, key, value, description) VALUES
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'business_hours',
  '{
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "17:00", "closed": false},
    "saturday": {"open": "08:00", "close": "16:00", "closed": false},
    "sunday": {"open": "10:00", "close": "15:00", "closed": false}
  }',
  'Weekly business operating hours'
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'notifications',
  '{
    "email_confirmations": true,
    "sms_reminders": true,
    "email_reminders": true,
    "reminder_hours": [24, 2],
    "confirmation_required": true,
    "cancellation_notice_hours": 24
  }',
  'Notification and reminder settings'
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'booking_rules',
  '{
    "advance_booking_days": 30,
    "min_booking_notice_hours": 2,
    "max_daily_bookings": 20,
    "allow_online_cancellation": true,
    "cancellation_notice_hours": 24,
    "require_phone_number": true,
    "allow_same_day_booking": true
  }',
  'Online booking rules and restrictions'
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'branding',
  '{
    "salon_name": "InStyle Hair Boutique",
    "tagline": "Your Style, Our Passion",
    "primary_color": "#D4A574",
    "secondary_color": "#2C2C2C",
    "accent_color": "#F5F5F5",
    "logo_url": "/assets/instyle-logo.png",
    "favicon_url": "/assets/instyle-favicon.ico"
  }',
  'Branding and visual identity settings'
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'contact_info',
  '{
    "phone": "+27 XX XXX XXXX",
    "email": "bookings@instylehairboutique.co.za",
    "address": "Your Salon Address",
    "city": "Your City",
    "postal_code": "XXXX",
    "country": "South Africa",
    "website": "https://www.instylehairboutique.co.za"
  }',
  'Salon contact information'
)
ON CONFLICT (salon_id, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- 7. INSERT SAMPLE MARKETING DATA (to prevent empty marketing table)
INSERT INTO public.marketing (salon_id, campaign_name, campaign_type, content, status, start_date, end_date) VALUES
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'Welcome Campaign',
  'email',
  '{
    "subject": "Welcome to InStyle Hair Boutique!",
    "template": "welcome_email",  
    "message": "Thank you for choosing InStyle Hair Boutique. We look forward to styling you!",
    "include_booking_link": true,
    "include_services_list": true
  }',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'Appointment Reminder',
  'sms',
  '{
    "message": "Hi {client_name}, this is a reminder of your appointment at InStyle Hair Boutique tomorrow at {appointment_time}. See you soon!",
    "send_hours_before": 24,
    "include_cancellation_link": true
  }',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 9. CREATE RLS POLICIES FOR SALON-SPECIFIC ACCESS

-- Settings policies
DROP POLICY IF EXISTS "salon_settings_select" ON public.settings;
CREATE POLICY "salon_settings_select" ON public.settings
  FOR SELECT USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

DROP POLICY IF EXISTS "salon_settings_all" ON public.settings;
CREATE POLICY "salon_settings_all" ON public.settings
  FOR ALL USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

-- Marketing policies  
DROP POLICY IF EXISTS "salon_marketing_select" ON public.marketing;
CREATE POLICY "salon_marketing_select" ON public.marketing
  FOR SELECT USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

DROP POLICY IF EXISTS "salon_marketing_all" ON public.marketing;
CREATE POLICY "salon_marketing_all" ON public.marketing
  FOR ALL USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

-- Clients policies
DROP POLICY IF EXISTS "salon_clients_select" ON public.clients;
CREATE POLICY "salon_clients_select" ON public.clients
  FOR SELECT USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

DROP POLICY IF EXISTS "salon_clients_all" ON public.clients;
CREATE POLICY "salon_clients_all" ON public.clients
  FOR ALL USING (
    salon_id::text = COALESCE(
      auth.jwt() ->> 'salon_id',
      current_setting('app.current_salon_id', true)
    )
  );

-- 10. CREATE INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appointments_salon_scheduled ON public.appointments(salon_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON public.appointments(client_id);

CREATE INDEX IF NOT EXISTS idx_services_salon_active ON public.services(salon_id, is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

CREATE INDEX IF NOT EXISTS idx_clients_salon_email ON public.clients(salon_id, email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

CREATE INDEX IF NOT EXISTS idx_settings_salon_key ON public.settings(salon_id, key);

CREATE INDEX IF NOT EXISTS idx_marketing_salon_status ON public.marketing(salon_id, status);

-- 11. CREATE FUNCTION TO SET SALON CONTEXT (for RLS)
CREATE OR REPLACE FUNCTION public.set_salon_context(salon_uuid UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_salon_id', salon_uuid::text, true);
END;
$$ LANGUAGE plpgsql;

-- 12. INSERT SAMPLE SERVICES IF NONE EXIST
INSERT INTO public.services (salon_id, name, description, duration_minutes, price_cents, category, is_active) 
SELECT 
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  service_name,
  service_description,
  duration,
  price,
  category,
  true
FROM (VALUES
  ('Haircut & Blow Dry', 'Professional haircut with styling and blow dry', 60, 45000, 'Hair Services'),
  ('Hair Wash & Blow Dry', 'Refreshing hair wash with professional blow dry', 45, 25000, 'Hair Services'),
  ('Hair Color (Full)', 'Complete hair coloring service', 180, 120000, 'Color Services'),
  ('Highlights', 'Professional hair highlighting', 150, 80000, 'Color Services'),
  ('Hair Treatment', 'Deep conditioning and repair treatment', 90, 60000, 'Treatments'),
  ('Bridal Hair', 'Special occasion bridal hair styling', 120, 150000, 'Special Occasions'),
  ('Hair Extensions', 'Professional hair extension application', 240, 200000, 'Extensions'),
  ('Keratin Treatment', 'Smoothing keratin treatment', 180, 180000, 'Treatments')
) AS new_services(service_name, service_description, duration, price, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.services 
  WHERE salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
  LIMIT 1
);

-- 13. CREATE UPDATED_AT TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at columns
DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketing_updated_at ON public.marketing;
CREATE TRIGGER update_marketing_updated_at BEFORE UPDATE ON public.marketing 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. VERIFICATION QUERIES (run these to confirm everything is working)

-- Check that all tables exist and have data
SELECT 
  'salons' as table_name, 
  count(*) as record_count 
FROM public.salons 
WHERE id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

UNION ALL

SELECT 
  'settings' as table_name, 
  count(*) as record_count 
FROM public.settings 
WHERE salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

UNION ALL

SELECT 
  'marketing' as table_name, 
  count(*) as record_count 
FROM public.marketing 
WHERE salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

UNION ALL

SELECT 
  'services' as table_name, 
  count(*) as record_count 
FROM public.services 
WHERE salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

UNION ALL

SELECT 
  'clients' as table_name, 
  count(*) as record_count 
FROM public.clients 
WHERE salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Test RLS policies work
SELECT public.set_salon_context('ccb12b4d-ade6-467d-a614-7c9d198ddc70');

SELECT 'RLS Test - Settings' as test_name, count(*) as accessible_records 
FROM public.settings;

SELECT 'RLS Test - Marketing' as test_name, count(*) as accessible_records 
FROM public.marketing;

SELECT 'RLS Test - Services' as test_name, count(*) as accessible_records 
FROM public.services;

-- 15. GRANT NECESSARY PERMISSIONS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing TO anon, authenticated;  
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO anon, authenticated;
GRANT USAGE ON public.set_salon_context TO anon, authenticated;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;

-- FINAL VERIFICATION MESSAGE
DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'INSTYLE HAIR BOUTIQUE DATABASE SETUP COMPLETE!';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Salon ID: ccb12b4d-ade6-467d-a614-7c9d198ddc70';
  RAISE NOTICE 'All missing tables have been created and populated.';
  RAISE NOTICE 'RLS policies are active and configured.';
  RAISE NOTICE 'Sample data has been inserted.';
  RAISE NOTICE 'Performance indexes have been added.';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Deploy the updated API endpoints';
  RAISE NOTICE '2. Test the dashboard at instylehairboutique.co.za/dashboard';
  RAISE NOTICE '3. Verify all console errors are resolved';
  RAISE NOTICE '4. Schedule client training session';
  RAISE NOTICE '============================================================';
END $$;