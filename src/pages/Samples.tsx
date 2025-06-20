
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BookOpen, ShoppingCart, Eye, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface SampleMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  format: string;
  download_url: string;
}

interface Material {
  id: string;
  title: string;
  price: number;
  category: string;
}

const Samples = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { data: sampleMaterials = [], isLoading } = useQuery({
    queryKey: ['sample_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SampleMaterial[];
    }
  });

  const { data: fullMaterials = [] } = useQuery({
    queryKey: ['full_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('id, title, price, category')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Material[];
    }
  });

  const handleViewSample = (downloadUrl: string, title: string) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
      toast.success(`Opening sample: ${title}`);
    } else {
      toast.info("Sample preview will be available soon");
    }
  };

  const handleOrderFullVersion = async (sampleTitle: string, category: string) => {
    // Find the corresponding full material
    const fullMaterial = fullMaterials.find(material => 
      material.category === category && 
      material.title.toLowerCase().includes(sampleTitle.toLowerCase().split(' ')[0])
    );

    if (!fullMaterial) {
      toast.error("Full version not available yet");
      return;
    }

    if (!user) {
      toast.error("Please login to order the full version");
      navigate('/login');
      return;
    }

    try {
      await addToCart(fullMaterial.id, fullMaterial.title);
      toast.success(`${fullMaterial.title} added to cart for hard copy delivery!`);
    } catch (error) {
      toast.error("Failed to add to cart");
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
          <div className="text-lg">Loading sample materials...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Free Sample Study Materials</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            Preview our comprehensive study materials with free samples. Love what you see? Order the complete version and get it delivered to your doorstep!
          </p>
          <div className="flex justify-center items-center gap-4 text-blue-100">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>Free Sample Viewing</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Hard Copy Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold text-center mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">1. View Free Sample</h4>
                <p className="text-gray-600">Browse and view sample chapters of our study materials completely free</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">2. Order Full Version</h4>
                <p className="text-gray-600">Like the sample? Order the complete study material with one click</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">3. Receive Hard Copy</h4>
                <p className="text-gray-600">Get the complete printed material delivered to your address via courier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sample Materials Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Available Sample Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMaterials.map((material) => {
            const fullMaterial = fullMaterials.find(full => 
              full.category === material.category && 
              full.title.toLowerCase().includes(material.title.toLowerCase().split(' ')[0])
            );

            return (
              <Card key={material.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Free Sample
                    </Badge>
                    <Badge variant="outline">{formatCategory(material.category)}</Badge>
                  </div>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription className="text-sm">{material.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {material.pages} pages
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {material.format}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewSample(material.download_url, material.title)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Free Sample
                      </Button>
                      
                      {fullMaterial && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Full Version Available:</strong> {fullMaterial.title}
                          </p>
                          <p className="text-lg font-bold text-blue-900 mb-2">₹{fullMaterial.price}</p>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleOrderFullVersion(material.title, material.category)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Order Hard Copy
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 text-center">
                      <Truck className="h-3 w-3 inline mr-1" />
                      Hard copy delivered via courier within 3-5 business days
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Hard Copy Materials?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Print</h3>
              <p className="text-gray-600">Premium quality paper and professional printing for better reading experience</p>
            </div>
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick courier delivery to your doorstep within 3-5 business days</p>
            </div>
            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Content</h3>
              <p className="text-gray-600">Full comprehensive study material with all topics covered in detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order Your Study Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection and get high-quality study materials delivered to your home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/materials">View All Materials</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/cart">Check Cart</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Samples;
