
-- Add RLS policies for tests table to allow admin operations
-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Everyone can view active tests" ON public.tests;

-- Create comprehensive policies for tests table
CREATE POLICY "Everyone can view active tests" 
  ON public.tests 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can create tests" 
  ON public.tests 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update tests" 
  ON public.tests 
  FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete tests" 
  ON public.tests 
  FOR DELETE 
  USING (is_admin(auth.uid()));
