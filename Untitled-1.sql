-- InStyle Hair Boutique - Data Seeding Script
-- IMPORTANT: Replace 'YOUR_SALON_ID_HERE' with the actual salon ID from the 'salons' table.

DO $$
DECLARE
    v_salon_id UUID := 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'; -- <<< PASTE THE NEW SALON ID FROM STEP 2 HERE
BEGIN

-- Clear existing data for this salon to prevent duplicates
DELETE FROM services WHERE salon_id = v_salon_id;
DELETE FROM products WHERE salon_id = v_salon_id;

-- == CORE SERVICES (MVP) ==
-- Prices are in cents (e.g., R350.00 is 35000)

INSERT INTO services (salon_id, name, description, price, duration_minutes, category) VALUES
(v_salon_id, 'Maphondo & Lines Installation', 'Professional installation of Maphondo & Lines hairstyles.', 35000, 60, 'Installation'),
(v_salon_id, 'Middle & Side Installation', 'Professional installation for middle and side part hairstyles.', 30000, 60, 'Installation');

END $$;