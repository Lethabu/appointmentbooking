
-- Insert products for InStyle Hair Boutique
INSERT OR REPLACE INTO Product (id, tenant_id, name, description, price_cents, category, images, inventory) VALUES
('prod_1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Premium Hair Treatment Kit', 'Complete hair treatment kit for healthy, shiny hair', 25000, 'Treatment', '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"]', 10),
('prod_2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Professional Hair Extensions', 'High-quality hair extensions for volume and length', 45000, 'Extensions', '["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400"]', 5),
('prod_3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Styling Product Bundle', 'Complete styling bundle with gel, mousse, and spray', 18000, 'Styling', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]', 15);
