-- Add payment settings to the settings table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS stripe_test_mode BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS stripe_test_secret_key TEXT,
ADD COLUMN IF NOT EXISTS stripe_test_publishable_key TEXT,
ADD COLUMN IF NOT EXISTS stripe_live_secret_key TEXT,
ADD COLUMN IF NOT EXISTS stripe_live_publishable_key TEXT,
ADD COLUMN IF NOT EXISTS enable_cod BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_stripe BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_bank_transfer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bank_transfer_details TEXT DEFAULT 'Please transfer the total amount to the following bank account...';
