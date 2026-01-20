-- Add financial and tracking columns to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'COD',
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_payout NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Update existing orders with default values where appropriate
UPDATE public.orders SET payment_method = 'COD' WHERE payment_method IS NULL;
UPDATE public.orders SET shipping_cost = 10 WHERE shipping_cost = 0;
