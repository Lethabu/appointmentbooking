-- Emergency tenant data insertion
DO $$
DECLARE
    instyle_tenant_id UUID;
BEGIN
    -- Ensure Instyle tenant exists
    INSERT INTO salons (name, subdomain, custom_domain, primary_color)
    VALUES ('InStyle Hair Boutique', 'instyle', 'www.instylehairboutique.co.za', '#d946ef')
    ON CONFLICT (subdomain) DO UPDATE SET 
        custom_domain = EXCLUDED.custom_domain,
        primary_color = EXCLUDED.primary_color
    RETURNING id INTO instyle_tenant_id;

    -- Insert emergency services
    INSERT INTO services (salon_id, name, duration_minutes, price, is_active)
    VALUES 
        (instyle_tenant_id, 'Hair Cut & Style', 90, 35000, true),
        (instyle_tenant_id, 'Hair Color', 180, 65000, true),
        (instyle_tenant_id, 'Lace Wig Install', 240, 85000, true),
        (instyle_tenant_id, 'Braids & Styling', 300, 45000, true)
    ON CONFLICT (salon_id, name) DO NOTHING;

    -- Insert emergency tenant components
    INSERT INTO tenant_components (tenant_id, comp_type, comp_name, html_chunk, css)
    VALUES 
        (instyle_tenant_id, 'header', 'InstyleHeader', 
         '<header class="instyle-header bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
            <div class="container mx-auto flex items-center justify-between">
              <h1 class="text-2xl font-bold">InStyle Hair Boutique</h1>
              <nav class="hidden md:flex space-x-6">
                <a href="/" class="hover:text-purple-200">Home</a>
                <a href="/book" class="hover:text-purple-200">Book Now</a>
                <a href="/services" class="hover:text-purple-200">Services</a>
                <a href="/contact" class="hover:text-purple-200">Contact</a>
              </nav>
            </div>
          </header>',
         ':root { --primary: #d946ef; --secondary: #ec4899; }'),
        (instyle_tenant_id, 'footer', 'InstyleFooter',
         '<footer class="instyle-footer bg-gray-900 text-white p-8">
            <div class="container mx-auto text-center">
              <p>&copy; 2025 InStyle Hair Boutique. All rights reserved.</p>
              <p class="mt-2 text-gray-400">Professional hair styling services in Johannesburg</p>
            </div>
          </footer>',
         '.instyle-footer { font-family: "Inter", sans-serif; }')
    ON CONFLICT (tenant_id, comp_type) DO UPDATE SET
        html_chunk = EXCLUDED.html_chunk,
        css = EXCLUDED.css;
END $$;

-- Enable emergency RLS policies
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_components ENABLE ROW LEVEL SECURITY;

-- Create emergency RLS policies
CREATE OR REPLACE FUNCTION get_tenant_id_from_context()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION WHEN others THEN
  RETURN null;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenant isolation policies
DROP POLICY IF EXISTS "Tenant isolation" ON services;
CREATE POLICY "Tenant isolation" ON services
FOR ALL USING (salon_id = get_tenant_id_from_context());

DROP POLICY IF EXISTS "Tenant component isolation" ON tenant_components;
CREATE POLICY "Tenant component isolation" ON tenant_components
FOR ALL USING (tenant_id = get_tenant_id_from_context());
