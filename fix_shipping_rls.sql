-- Enable RLS for Shipping Tables
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- Policy for shipping_zones: Allow authenticated admins/managers full access
CREATE POLICY "Admins and managers can manage shipping zones"
ON shipping_zones
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'shop_manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'shop_manager')
  )
);

-- Policy for shipping_rates: Allow authenticated admins/managers full access
CREATE POLICY "Admins and managers can manage shipping rates"
ON shipping_rates
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'shop_manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'shop_manager')
  )
);

-- Policy to allow all users (including non-admins/unauthenticated if needed) to VIEW shipping zones/rates
-- For now, let's keep it restricted to authenticated for the dashboard fix
CREATE POLICY "Anyone can view active shipping zones"
ON shipping_zones
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can view shipping rates"
ON shipping_rates
FOR SELECT
TO authenticated
USING (true);
