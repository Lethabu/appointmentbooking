-- Complete InStyle Hair Boutique Setup

-- Update InStyle tenant with full branding and configuration
UPDATE tenants 
SET 
  branding = '{
    "primaryColor": "#e91e63",
    "secondaryColor": "#f8bbd9",
    "logo": "/instyle-logo.svg",
    "whatsappNumber": "+27123456789",
    "businessHours": {
      "mon": "09:00-17:00",
      "tue": "09:00-17:00", 
      "wed": "09:00-17:00",
      "thu": "09:00-17:00",
      "fri": "09:00-17:00",
      "sat": "08:00-16:00",
      "sun": "closed"
    },
    "address": "123 Main Street, Cape Town, 8001",
    "phone": "+27214567890",
    "email": "bookings@instylehairboutique.co.za",
    "description": "Premium hair salon specializing in cuts, color, and treatments"
  }',
  config = '{
    "paymentsEnabled": true,
    "whatsappEnabled": true,
    "aiChatEnabled": true,
    "onlineBookingEnabled": true,
    "typebotId": "instyle-booking-flow",
    "timezone": "Africa/Johannesburg"
  }'
WHERE id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Insert InStyle services
INSERT INTO services (tenant_id, name, description, price, duration, active) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Wash & Cut', 'Professional wash, cut and blow-dry', 35000, 60, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Balayage', 'Hand-painted highlights for natural look', 65000, 120, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Treatment', 'Deep conditioning and repair treatment', 45000, 90, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Color & Cut', 'Full color service with cut and style', 55000, 150, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Manicure', 'Professional nail care and polish', 18000, 45, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pedicure', 'Foot care and nail polish service', 22000, 60, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Eyebrow Shaping', 'Professional eyebrow threading and shaping', 15000, 30, true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Blowdry & Style', 'Professional styling and blowdry', 25000, 45, true)
ON CONFLICT DO NOTHING;

-- Insert InStyle staff
INSERT INTO staff (tenant_id, name, email, phone, role, active) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sarah Johnson', 'sarah@instylehairboutique.co.za', '+27721234567', 'senior_stylist', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Michelle Adams', 'michelle@instylehairboutique.co.za', '+27721234568', 'colorist', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lisa Brown', 'lisa@instylehairboutique.co.za', '+27721234569', 'nail_technician', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Emma Wilson', 'emma@instylehairboutique.co.za', '+27721234570', 'receptionist', true)
ON CONFLICT DO NOTHING;

-- Insert InStyle products for upsells
INSERT INTO products (tenant_id, name, description, price, category, active) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Serum', 'Professional leave-in treatment serum', 12000, 'hair_care', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Shampoo & Conditioner Set', 'Salon-quality hair care set', 18000, 'hair_care', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Mask', 'Deep conditioning hair mask', 15000, 'hair_care', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nail Polish', 'Premium nail polish collection', 8000, 'nail_care', true),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hand Cream', 'Moisturizing hand cream', 6000, 'nail_care', true)
ON CONFLICT DO NOTHING;