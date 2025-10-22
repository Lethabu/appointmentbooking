-- Add SuperSaaS sync columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS supersaas_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_appointments_supersaas_id ON appointments(supersaas_id);

-- Insert Instyle services
INSERT INTO services (salon_id, name, description, price_cents, duration_minutes) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional middle-part weave install', 50000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 'Intricate braided Maphondo style', 50000, 60)
ON CONFLICT DO NOTHING;