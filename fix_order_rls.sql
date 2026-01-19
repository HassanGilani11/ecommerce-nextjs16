-- FIX: Allow authenticated users to create their own orders
-- Run this in your Supabase SQL Editor

-- 1. Policy for inserting orders
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 2. Policy for inserting order items
-- Requires that the user owns the order they are adding items to
CREATE POLICY "Users can create their own order items" 
ON public.order_items 
FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id AND user_id = auth.uid()
    )
);

-- Note: Ensure that the 'orders' table has 'user_id' as a foreign key to auth.users.id
-- And that Row Level Security (RLS) is enabled on both tables.
