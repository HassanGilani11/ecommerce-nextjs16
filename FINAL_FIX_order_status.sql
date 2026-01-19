-- FINAL COMPREHENSIVE FIX: Update Order Status Constraints
-- Run this in your Supabase SQL Editor to allow 'shipped', 'delivered', and 'archived' statuses.

-- 1. Remove ANY existing status constraints from the orders table
-- This handles cases where the constraint might have a different name
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.orders'::regclass 
        AND contype = 'c' 
        AND (conname LIKE '%status%' OR pg_get_constraintdef(oid) LIKE '%status%')
    ) LOOP
        EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- 2. Add the comprehensive check constraint
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN (
    'pending', 
    'processing', 
    'shipped', 
    'delivered', 
    'completed', 
    'cancelled', 
    'refunded', 
    'on-hold', 
    'archived'
));

-- 3. Ensure default is set
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- 4. Verify the change by listing constraints (Optional check for you)
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.orders'::regclass;
