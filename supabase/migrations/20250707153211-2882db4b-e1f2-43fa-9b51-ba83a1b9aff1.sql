
-- Add verification_status column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN verification_status TEXT DEFAULT 'pending' 
CHECK (verification_status IN ('pending', 'approved', 'rejected'));
