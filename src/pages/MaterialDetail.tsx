
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, FileText, ShoppingCart, ArrowLeft, LogIn, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { RAZORPAY_CONFIG, COMPANY_INFO } from "@/lib/constants";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  pages: number;
  format: string;
  image_url: string;
}

const MaterialDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewPages] = useState(3); // Number of preview pages to show

  const { data: material, isLoading } = useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      if (!id) throw new Error('Material ID is required');
      
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as Material;
    },
    enabled: !!id
  });

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase materials");
      navigate('/login');
      return;
    }

    if (!material) return;

    setIsProcessing(true);

    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: RAZORPAY_CONFIG.KEY_ID,
          amount: material.price * 100,
          currency: 'INR',
          name: COMPANY_INFO.NAME,
          description: material.title,
          image: COMPANY_INFO.LOGO,
          handler: async (response: any) => {
            try {
              const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                  user_id: user.id,
                  total_amount: material.price,
                  status: 'confirmed',
                  notes: `Razorpay Payment ID: ${response.razorpay_payment_id}`
                })
                .select()
                .single();

              if (orderError) throw orderError;

              const { error: itemError } = await supabase
                .from('order_items')
                .insert({
                  order_id: order.id,
                  material_id: material.id,
                  quantity: 1,
                  price: material.price
                });

              if (itemError) throw itemError;

              toast.success("Payment successful! Material purchased successfully.");
              navigate('/orders');
            } catch (error) {
              console.error('Order creation error:', error);
              toast.error("Payment successful but order creation failed. Please contact support.");
            }
          },
          prefill: {
            name: user.email,
            email: user.email,
          },
          theme: {
            color: COMPANY_INFO.THEME_COLOR
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
      };

      script.onerror = () => {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'UG_TRB': return 'bg-blue-100 text-blue-800';
      case 'PG_TRB': return 'bg-purple-100 text-purple-800';
      case 'General': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading material...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg text-red-600">Material not found</div>
          <Button asChild className="mt-4">
            <Link to="/materials">Back to Materials</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="text-white hover:bg-white/20 mb-4">
            <Link to="/materials">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Materials
            </Link>
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white border-white/30">
              {formatCategory(material.category)}
            </Badge>
            <div className="flex items-center gap-1 text-yellow-300">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm ml-1">(4.8)</span>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{material.title}</h1>
          <p className="text-lg text-blue-100">{material.description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Material Preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Material Preview
              </CardTitle>
              <CardDescription>
                Preview of first {previewPages} pages - Full material contains {material.pages} pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center min-h-96 flex flex-col justify-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  High-quality study material preview
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: previewPages }).map((_, index) => (
                    <div key={index} className="bg-white rounded border aspect-[3/4] flex items-center justify-center text-sm text-gray-500">
                      Page {index + 1}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  + {material.pages - previewPages} more pages in full version
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Material Details */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Material Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">{material.pages} Pages</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">{material.format}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive study material</li>
                    <li>• Topic-wise coverage</li>
                    <li>• Practice questions</li>
                    <li>• Previous year analysis</li>
                    <li>• Expert explanations</li>
                    <li>• Model test papers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Updated as per latest syllabus</li>
                    <li>• Designed by TRB experts</li>
                    <li>• High-quality content</li>
                    <li>• Easy to understand format</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Card */}
            <Card className="shadow-lg border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">₹{material.price}</div>
                  <p className="text-gray-600">One-time purchase • Lifetime access</p>
                </div>

                {user ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isProcessing ? "Processing..." : "Buy Now with Razorpay"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                      <Link to="/login">
                        <LogIn className="h-5 w-5 mr-2" />
                        Login to Purchase
                      </Link>
                    </Button>
                    <p className="text-center text-sm text-gray-500">
                      Please login to purchase this material
                    </p>
                  </div>
                )}

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 text-center">
                    💳 Secure payment • Instant access • 100% satisfaction guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MaterialDetail;
