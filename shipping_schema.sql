-- Shipping Configuration Schema

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    countries JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping Rates Table
CREATE TABLE IF NOT EXISTS shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('flat', 'weight_based')),
    base_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_weight NUMERIC(10, 3) DEFAULT 0.000,
    max_weight NUMERIC(10, 3),
    price_per_kg NUMERIC(10, 2) DEFAULT 0.00,
    estimated_delivery TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone_id ON shipping_rates(zone_id);

-- Updated at trigger setup (optional but recommended for consistency)
-- Assuming a generic update_updated_at_column function exists or is standard in this DB
-- CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- CREATE TRIGGER update_shipping_rates_updated_at BEFORE UPDATE ON shipping_rates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
