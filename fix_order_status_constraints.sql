-- FIX: Update Order Status Constraints
-- Run this in your Supabase SQL Editor to allow 'shipped' and 'delivered' statuses.

-- 1. Identify and drop the existing check constraint
-- In Postgres/Supabase, if no name was specified, it might be 'orders_status_check'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- 2. Add the updated check constraint with all required statuses
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded', 'on-hold', 'archived'));

-- Optional: Ensure the default value is sensible
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';
