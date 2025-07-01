
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, FileText, ShoppingCart, ArrowLeft, LogIn, Eye, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderForm, { OrderFormData } from "@/components/OrderForm";
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
  preview_url: string;
  preview_pages: number;
}

const MaterialDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

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

  const extractGoogleDriveId = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    const fileId = extractGoogleDriveId(url);
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  };

  const handleFormSubmit = async (formData: OrderFormData) => {
    if (!material) return;

    setIsProcessing(true);
    setShowOrderForm(false);

    try {
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        });
      }

      const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: material.price * 100,
        currency: 'INR',
        name: COMPANY_INFO.NAME,
        description: material.title,
        image: COMPANY_INFO.LOGO,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        theme: {
          color: COMPANY_INFO.THEME_COLOR
        },
        handler: async (response: any) => {
          try {
            console.log('Payment successful:', response);
            
            const orderData = {
              user_id: user?.id,
              total_amount: material.price,
              status: 'confirmed' as const,
              phone: formData.phone,
              shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
              notes: `Payment ID: ${response.razorpay_payment_id}, Customer: ${formData.fullName}, Email: ${formData.email}`
            };

            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert(orderData)
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

            toast.success("Payment successful! Your order has been confirmed.");
            navigate('/orders');
          } catch (error) {
            console.error('Order creation error:', error);
            toast.error("Payment successful but order creation failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            console.log('Payment modal dismissed');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
      setIsProcessing(false);
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error("Failed to initialize payment. Please check your Razorpay configuration.");
      setIsProcessing(false);
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      toast.error("Please login to purchase materials");
      navigate('/login');
      return;
    }
    setShowOrderForm(true);
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

  const embedUrl = material.preview_url ? getGoogleDriveEmbedUrl(material.preview_url) : null;

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
                {material.preview_pages ? `Preview ${material.preview_pages} pages` : 'Sample pages'} from this {material.pages}-page material
              </CardDescription>
            </CardHeader>
            <CardContent>
              {embedUrl ? (
                <div className="space-y-4">
                  <div className="aspect-[3/4] w-full border rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="autoplay"
                      title="Material Preview"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Preview: {material.preview_pages || 3} pages</span>
                    {material.preview_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={material.preview_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in Drive
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800 font-medium text-sm">
                      📚 Complete {material.pages} pages available after purchase
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      Full material includes detailed explanations, examples, and practice questions
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center min-h-96 flex flex-col justify-center border border-blue-200">
                  <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Complete {material.pages}-Page Study Material
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {Array.from({ length: Math.min(6, material.pages) }).map((_, index) => (
                      <div key={index} className="bg-white rounded border-2 aspect-[3/4] flex items-center justify-center text-sm text-gray-600 shadow-sm">
                        Page {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium text-sm">
                      📚 Full {material.pages} pages of comprehensive content
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      Includes detailed explanations, examples, and practice questions
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Purchase to unlock the complete material with all {material.pages} pages
                  </p>
                </div>
              )}
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
                    <li>• Expert explanations by Dr. Nathan</li>
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
                  <p className="text-gray-600">One-time purchase • {material.pages} pages • Lifetime access</p>
                </div>

                {user ? (
                  <>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 mb-4"
                      onClick={handlePurchaseClick}
                      disabled={isProcessing}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isProcessing ? "Processing..." : "Buy Now"}
                    </Button>
                    
                    <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center justify-between">
                            <DialogTitle>Complete Your Purchase</DialogTitle>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowOrderForm(false)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <DialogDescription>
                            Please provide your details to proceed with the payment
                          </DialogDescription>
                        </DialogHeader>
                        <OrderForm
                          material={material}
                          onSubmit={handleFormSubmit}
                          isProcessing={isProcessing}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
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
