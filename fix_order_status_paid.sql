-- FIX: Add 'paid' status to orders_status_check constraint
-- Run this in your Supabase SQL Editor to resolve the check constraint violation error.

-- 1. Remove the existing status constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- 2. Add the updated check constraint with 'paid' included
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN (
    'pending', 
    'paid', 
    'processing', 
    'shipped', 
    'delivered', 
    'completed', 
    'cancelled', 
    'refunded', 
    'on-hold', 
    'archived'
));

-- 3. Ensure the default remains 'pending'
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';
