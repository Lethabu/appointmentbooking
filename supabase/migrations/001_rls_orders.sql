-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for customers: can select/insert own orders (assuming user_id from Clerk synced)
CREATE POLICY "Customers can view and create own orders" ON orders
  FOR ALL USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy for admins: full access
CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND public_metadata->>'role' = 'admin'))
  WITH CHECK (true);

-- Similar for order_items if needed
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items access tied to orders" ON order_items
  FOR ALL USING (order_id IN (SELECT id FROM orders WHERE auth.uid()::text = orders.user_id OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND public_metadata->>'role' = 'admin')))
  WITH CHECK (true);