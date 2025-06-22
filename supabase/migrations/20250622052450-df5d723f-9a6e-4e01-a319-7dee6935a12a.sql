
-- Create youtube_videos table
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view videos (public content)
CREATE POLICY "Anyone can view youtube videos" 
  ON public.youtube_videos 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy for admins to manage videos
CREATE POLICY "Admins can manage youtube videos" 
  ON public.youtube_videos 
  FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
