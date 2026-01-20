-- Add ZIP codes to zones for intelligent matching
ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS zip_codes TEXT;

-- Update rates to support Free Shipping with conditions
ALTER TABLE shipping_rates DROP CONSTRAINT IF EXISTS shipping_rates_type_check;
ALTER TABLE shipping_rates ADD CONSTRAINT shipping_rates_type_check CHECK (type IN ('flat', 'weight_based', 'free'));

ALTER TABLE shipping_rates ADD COLUMN IF NOT EXISTS min_order_subtotal NUMERIC(10, 2) DEFAULT 0.00;
