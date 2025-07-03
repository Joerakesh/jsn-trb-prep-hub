
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, FileText, BookOpen, Star, AlertCircle, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  pages: number;
  format: string;
  image_url: string;
  preview_url: string;
  preview_pages: number;
}

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createPayment, loading: paymentLoading } = usePayment();
  const { user } = useAuth();

  const { data: material, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Material ID is required');
      }

      console.log('Fetching material with ID:', id);
      
      const { data, error: supabaseError } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (supabaseError) {
        console.error('Error fetching material:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      if (!data) {
        throw new Error('Material not found');
      }
      
      console.log('Material fetched:', data);
      return data as Material;
    },
    enabled: !!id,
    retry: 1
  });

  // Check if user has already purchased this material
  const { data: hasPurchased } = useQuery({
    queryKey: ['user-purchase', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      
      const { data } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', id)
        .eq('status', 'paid')
        .maybeSingle();
      
      return !!data;
    },
    enabled: !!user && !!id
  });

  const handlePurchase = async () => {
    if (!material) return;
    
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    await createPayment(material.id, material.price);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'UG_TRB': return 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200';
      case 'PG_TRB': return 'bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200';
      case 'General': return 'bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ');
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Invalid Material"
          description="The requested material ID is invalid or missing."
        />
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Material ID</h1>
            <p className="text-gray-600 mb-8">The material ID is missing or invalid.</p>
            <Button asChild className="hover:scale-105 transition-transform duration-200">
              <Link to="/materials">Browse Materials</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-300 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                  <div className="h-20 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Material Not Found"
          description="The requested material could not be found or is no longer available."
        />
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
          <div className="max-w-md mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Material Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error instanceof Error ? error.message : 'The requested material could not be found or may no longer be available.'}
            </p>
            <div className="space-y-4">
              <Button asChild className="hover:scale-105 transition-transform duration-200">
                <Link to="/materials">Browse All Materials</Link>
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="hover:scale-105 transition-transform duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={material.title}
        description={material.description || `${material.title} - Educational material for ${formatCategory(material.category)} preparation. ${material.pages ? `${material.pages} pages` : ''} in ${material.format} format.`}
        keywords={`${material.title}, ${formatCategory(material.category)}, TRB, educational materials, ${material.format}, study materials`}
        ogImage={material.image_url}
        type="product"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 hover:scale-105 transition-all duration-200 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Material Image */}
            <div className="space-y-4 animate-slide-in-left">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative group">
                  {material.image_url ? (
                    <img 
                      src={material.image_url} 
                      alt={material.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={material.image_url ? 'hidden' : 'text-center p-8'}>
                    <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-500 text-lg font-medium">{material.title}</p>
                  </div>
                </div>
              </Card>

              {material.preview_url && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full hover:scale-105 transition-all duration-200 hover:bg-blue-50"
                >
                  <a href={material.preview_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    View Sample ({material.preview_pages || 3} pages)
                  </a>
                </Button>
              )}
            </div>

            {/* Material Details */}
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getCategoryColor(material.category)}>
                    {formatCategory(material.category)}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-current hover:scale-110 transition-transform duration-150" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-300">
                  {material.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">{material.description}</p>
              </div>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Material Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{material.pages || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">{material.format}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-3xl font-bold text-blue-600 animate-pulse">₹{material.price}</p>
                      </div>
                      {hasPurchased ? (
                        <Button 
                          size="lg" 
                          className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <Button 
                          onClick={handlePurchase}
                          size="lg" 
                          className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 active:scale-95"
                          disabled={paymentLoading}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {paymentLoading ? (
                            <span className="animate-pulse">Processing...</span>
                          ) : (
                            'Buy Now'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-900 mb-2">What's Included:</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    {[
                      `High-quality ${material.format} format`,
                      `${material.pages || 'Multiple'} pages of content`,
                      'Expert curated material',
                      'Instant download after purchase',
                      'Lifetime access'
                    ].map((item, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MaterialDetail;
