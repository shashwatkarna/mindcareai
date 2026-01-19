-- Run this in your Supabase SQL Editor to add the premium status column

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Optional: Update existing users to be non-premium by default (redundant with default false, but good for clarity)
UPDATE profiles SET is_premium = FALSE WHERE is_premium IS NULL;
