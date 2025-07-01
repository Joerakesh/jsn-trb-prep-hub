
-- Add preview_url and preview_pages columns to the materials table
ALTER TABLE public.materials 
ADD COLUMN preview_url TEXT,
ADD COLUMN preview_pages INTEGER DEFAULT 3;

-- Add a comment to explain the new columns
COMMENT ON COLUMN public.materials.preview_url IS 'Google Drive shareable link for material preview';
COMMENT ON COLUMN public.materials.preview_pages IS 'Number of preview pages available (default 3)';
