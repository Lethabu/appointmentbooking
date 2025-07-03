-- Enable RLS for all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Salon owner access
CREATE POLICY "Salon owner full access" ON salons
FOR ALL USING (auth.uid() = owner_id);

-- Salon-scoped services
CREATE POLICY "Service owner access" ON services
FOR ALL USING (
  salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
);

-- Public service view
CREATE POLICY "Public service visibility" ON services
FOR SELECT USING (
  is_active = true AND
  salon_id IN (SELECT id FROM salons WHERE plan != 'free')
);

-- Appointment creation
CREATE POLICY "Client appointment creation" ON appointments
FOR INSERT WITH CHECK (
  salon_id IN (SELECT id FROM salons WHERE plan != 'free')
);