-- Pup Picks Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Dog Profiles Table
CREATE TABLE IF NOT EXISTS dog_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  photo TEXT,
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'giant')),
  chew_strength TEXT CHECK (chew_strength IN ('gentle', 'moderate', 'aggressive', 'destroyer')),
  play_style TEXT CHECK (play_style IN ('fetch', 'tug', 'cuddle', 'puzzle')),
  birthday DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add birthday column if table already exists
-- Run this separately if you already created the table:
-- ALTER TABLE dog_profiles ADD COLUMN IF NOT EXISTS birthday DATE;

-- Enable Row Level Security
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own dog profile
CREATE POLICY "Users can view own dog profile"
  ON dog_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own dog profile
CREATE POLICY "Users can insert own dog profile"
  ON dog_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own dog profile
CREATE POLICY "Users can update own dog profile"
  ON dog_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own dog profile
CREATE POLICY "Users can delete own dog profile"
  ON dog_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS dog_profiles_user_id_idx ON dog_profiles(user_id);

-- Optional: Purchase History Table (for future use)
CREATE TABLE IF NOT EXISTS purchase_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for purchase history
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchase_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own purchases
CREATE POLICY "Users can insert own purchases"
  ON purchase_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS purchase_history_user_id_idx ON purchase_history(user_id);
