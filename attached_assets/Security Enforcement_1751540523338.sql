-- Sample RLS Policies
CREATE POLICY "Tenant data isolation" ON appointments
FOR ALL USING (
  salon_id IN (
    SELECT id FROM salons 
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Admin override" ON salons
FOR ALL USING (current_setting('app.bypass_rls', true)::boolean = true)
WITH CHECK (false);