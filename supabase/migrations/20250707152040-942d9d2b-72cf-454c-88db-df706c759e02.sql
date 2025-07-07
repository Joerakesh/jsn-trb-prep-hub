-- Add verification status to user profiles
ALTER TABLE public.profiles 
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Add payment verification table for manual payments
CREATE TABLE public.payment_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_screenshot_url TEXT,
  upi_transaction_id TEXT,
  payment_method TEXT DEFAULT 'googlepay',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_verifications
CREATE POLICY "Users can view their own payment verifications"
ON public.payment_verifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment verifications"
ON public.payment_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment verifications"
ON public.payment_verifications
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update payment verifications"
ON public.payment_verifications
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Add update trigger
CREATE TRIGGER update_payment_verifications_updated_at
  BEFORE UPDATE ON public.payment_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();