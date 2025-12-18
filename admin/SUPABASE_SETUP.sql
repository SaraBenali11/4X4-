-- ============================================
-- SUPABASE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Add profile fields to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admins';

