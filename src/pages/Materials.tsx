
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Filter, Search, X, Star, Clock, FileText, ShoppingCart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const { data: materials = [], isLoading, error } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      console.log('Fetching materials...');
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching materials:', error);
        throw error;
      }
      
      console.log('Materials fetched:', data);
      return data as Material[];
    }
  });

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async (material: Material) => {
    if (!user) {
      toast.error("Please login to purchase materials");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_9WaALlk42rzp6s', // Replace with your Razorpay key
          amount: material.price * 100, // Amount in paise
          currency: 'INR',
          name: 'JSN Academy',
          description: material.title,
          image: '/placeholder.svg',
          handler: async (response: any) => {
            try {
              // Create order in database
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

              // Create order item
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
              setSelectedMaterial(null);
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
            color: '#2563eb'
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg text-red-600">Error loading materials. Please try again later.</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading materials...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Study Materials</h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
            High-quality study materials designed by experts to help you excel in TRB examinations
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="UG_TRB">UG TRB</SelectItem>
              <SelectItem value="PG_TRB">PG TRB</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Materials List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Materials</h2>
              <div className="grid gap-4">
                {filteredMaterials.map((material) => (
                  <Card 
                    key={material.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMaterial?.id === material.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getCategoryColor(material.category)}>
                          {formatCategory(material.category)}
                        </Badge>
                        <span className="text-xl font-bold text-blue-600">
                          ₹{material.price}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{material.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{material.pages} pages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{material.format}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Material Details */}
            <div className="lg:sticky lg:top-8">
              {selectedMaterial ? (
                <Card className="shadow-lg">
                  <CardHeader className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => setSelectedMaterial(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(selectedMaterial.category)}>
                        {formatCategory(selectedMaterial.category)}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{selectedMaterial.title}</CardTitle>
                    <CardDescription className="text-base">{selectedMaterial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Material Preview */}
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Material Preview</p>
                      <p className="text-sm text-gray-500">
                        High-quality study material with comprehensive coverage of syllabus
                      </p>
                    </div>

                    {/* Material Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-sm font-medium">{selectedMaterial.pages} Pages</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <p className="text-sm font-medium">{selectedMaterial.format} Format</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">What's Included:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Comprehensive study material</li>
                          <li>• Topic-wise coverage</li>
                          <li>• Practice questions</li>
                          <li>• Previous year analysis</li>
                          <li>• Expert explanations</li>
                        </ul>
                      </div>
                    </div>

                    {/* Purchase Section */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-blue-600">₹{selectedMaterial.price}</span>
                        <span className="text-sm text-gray-500">One-time purchase</span>
                      </div>
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                        onClick={() => handlePurchase(selectedMaterial)}
                        disabled={isProcessing || !user}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isProcessing ? "Processing..." : user ? "Buy Now with Razorpay" : "Login to Purchase"}
                      </Button>

                      {!user && (
                        <p className="text-center text-sm text-gray-500 mt-2">
                          Please login to purchase materials
                        </p>
                      )}

                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800 text-center">
                          💳 Secure payment with Razorpay • Instant access after payment
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Material</h3>
                    <p className="text-gray-500">
                      Choose a study material from the list to view details and purchase
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Materials;
