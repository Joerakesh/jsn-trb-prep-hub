
-- Create enum types for better data integrity
CREATE TYPE material_category AS ENUM ('UG_TRB', 'PG_TRB', 'General');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category material_category NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  pages INTEGER,
  format TEXT DEFAULT 'PDF',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sample materials table
CREATE TABLE public.sample_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category material_category NOT NULL,
  pages INTEGER,
  format TEXT DEFAULT 'PDF',
  download_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category material_category NOT NULL,
  duration TEXT,
  questions TEXT,
  difficulty TEXT,
  participants_count INTEGER DEFAULT 0,
  google_form_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for materials (public read access)
CREATE POLICY "Everyone can view active materials" ON public.materials
  FOR SELECT USING (is_active = true);

-- Create RLS policies for sample materials (authenticated users only)
CREATE POLICY "Authenticated users can view sample materials" ON public.sample_materials
  FOR SELECT TO authenticated USING (is_active = true);

-- Create RLS policies for tests (public read access)
CREATE POLICY "Everyone can view active tests" ON public.tests
  FOR SELECT USING (is_active = true);

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order items (users can only see items from their orders)
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create order items for their own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for materials
INSERT INTO public.materials (title, description, category, price, pages, image_url) VALUES
('UG TRB Tamil Complete Guide', 'Comprehensive study material for UG TRB Tamil examination covering all topics', 'UG_TRB', 499.00, 300, '/placeholder.svg'),
('UG TRB English Master Book', 'Complete English preparation book with grammar, literature and pedagogy', 'UG_TRB', 449.00, 280, '/placeholder.svg'),
('UG TRB Mathematics Problem Solver', 'Mathematical concepts and problem-solving techniques for UG TRB', 'UG_TRB', 549.00, 350, '/placeholder.svg'),
('PG TRB Educational Psychology', 'Advanced psychology concepts for PG TRB examination', 'PG_TRB', 599.00, 400, '/placeholder.svg'),
('PG TRB Research Methodology', 'Complete guide to research methods and statistics', 'PG_TRB', 649.00, 380, '/placeholder.svg'),
('General TRB Aptitude & Reasoning', 'General knowledge, aptitude and reasoning for all TRB exams', 'General', 399.00, 250, '/placeholder.svg');

-- Insert sample data for sample materials
INSERT INTO public.sample_materials (title, description, category, pages, download_url) VALUES
('UG TRB Tamil Sample Chapter', 'Sample chapter covering Tamil grammar fundamentals', 'UG_TRB', 25, '/samples/ug-tamil-sample.pdf'),
('UG TRB English Practice Questions', 'Sample question bank with detailed solutions', 'UG_TRB', 20, '/samples/ug-english-questions.pdf'),
('PG TRB Educational Psychology Preview', 'Introduction to learning theories and child development', 'PG_TRB', 30, '/samples/pg-psychology-preview.pdf'),
('Mathematics Problem Solving Techniques', 'Sample mathematical concepts and problem-solving methods', 'UG_TRB', 35, '/samples/math-techniques.pdf'),
('Research Methodology Sample', 'Introduction to research design and methodology', 'PG_TRB', 28, '/samples/research-methodology.pdf'),
('Previous Year Questions Sample', 'Collection of previous year TRB questions with solutions', 'General', 40, '/samples/previous-questions.pdf');

-- Insert sample data for tests
INSERT INTO public.tests (title, description, category, duration, questions, difficulty, participants_count, google_form_url) VALUES
('UG TRB Tamil Mock Test - 1', 'Comprehensive test covering Tamil grammar, literature, and pedagogy', 'UG_TRB', '2 hours', '150 questions', 'Moderate', 1250, 'https://forms.google.com/mock-test-1'),
('UG TRB English Practice Test', 'English language proficiency and teaching methodology assessment', 'UG_TRB', '2 hours', '150 questions', 'Moderate', 980, 'https://forms.google.com/mock-test-2'),
('UG TRB Mathematics Mock Test', 'Mathematical concepts and problem-solving skills evaluation', 'UG_TRB', '2.5 hours', '150 questions', 'Challenging', 756, 'https://forms.google.com/mock-test-3'),
('PG TRB Educational Psychology Test', 'Advanced psychology concepts and educational theories', 'PG_TRB', '2 hours', '100 questions', 'Advanced', 432, 'https://forms.google.com/mock-test-4'),
('PG TRB Research Methodology Test', 'Research methods, statistics, and data analysis assessment', 'PG_TRB', '1.5 hours', '75 questions', 'Advanced', 298, 'https://forms.google.com/mock-test-5'),
('General TRB Aptitude Test', 'Reasoning, general knowledge, and aptitude assessment', 'General', '1 hour', '100 questions', 'Easy', 2100, 'https://forms.google.com/mock-test-6');
