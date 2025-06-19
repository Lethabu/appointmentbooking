-- ##################################################
-- ##    APPOINTMENTBOOKINGS SAAS SCHEMA v3.1        ##
-- ##    Multi-Tenant, E-commerce, 3-Tier Pricing    ##
-- ##################################################


-- =========== TABLE 1: SALONS ===========
-- This is the master list of all your tenants.
CREATE TABLE salons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- White-labeling & URL
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    logo_url TEXT,
    
    -- Subscription Tier
    plan TEXT DEFAULT 'trial' NOT NULL, -- 'trial' | 'essential' | 'pro' | 'elite'
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== TABLE 2: PROFILES ===========
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' NOT NULL, -- 'client' | 'staff' | 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== TABLE 3: E-COMMERCE PRODUCTS ===========
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_urls TEXT[],
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== TABLE 4: E-COMMERCE ORDERS ===========
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    shipping_address TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
    payment_provider TEXT, -- e.g., 'payflex', 'card'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== TABLE 5: ORDER ITEMS ===========
-- Links products to orders.
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Use SET NULL so order history remains if product is deleted
    quantity INT NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);


-- =========== TABLE 6: SERVICES ===========
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    duration_minutes INT,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== TABLE 7: APPOINTMENTS ===========
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =========== SECURITY: ROW LEVEL SECURITY ===========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to salons" ON salons FOR SELECT USING (true);
CREATE POLICY "Salon owners can manage their own salon details" ON salons FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Salon-scoped profile access" ON profiles FOR ALL USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Salon-scoped service access" ON services FOR ALL USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Salon-scoped appointment access" ON appointments FOR ALL USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Salon-scoped product access" ON products FOR ALL USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
CREATE POLICY "Salon-scoped order access" ON orders FOR ALL USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
