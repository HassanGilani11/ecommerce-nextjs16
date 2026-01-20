-- FINAL SHIPPING SCHEMA FIX
-- This script ensures all columns and constraints are present for Shipping V2

-- 1. Add ZIP matching to zones
ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS zip_codes TEXT;

-- 2. Update rate types to include 'free'
ALTER TABLE shipping_rates DROP CONSTRAINT IF EXISTS shipping_rates_type_check;
ALTER TABLE shipping_rates ADD CONSTRAINT shipping_rates_type_check CHECK (type IN ('flat', 'weight_based', 'free'));

-- 3. Add min_order_subtotal for free shipping
ALTER TABLE shipping_rates ADD COLUMN IF NOT EXISTS min_order_subtotal NUMERIC(10, 2) DEFAULT 0.00;

-- 4. Reload PostgREST Schema Cache
-- Note: This requires the 'reload' notification to be picked up by Supabase
NOTIFY pgrst, 'reload schema';

-- Verification Query
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shipping_rates' 
AND column_name IN ('type', 'min_order_subtotal');
