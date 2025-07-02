
-- Add missing updated_at column to tests table
ALTER TABLE public.tests 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have updated_at value
UPDATE public.tests 
SET updated_at = created_at 
WHERE updated_at IS NULL;
