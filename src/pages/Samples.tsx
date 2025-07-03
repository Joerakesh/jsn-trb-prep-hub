
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BookOpen, ShoppingCart, Eye, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

  const handlePurchaseFullVersion = (sampleTitle: string, category: string) => {
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
      toast.error("Please login to purchase the full version");
      navigate('/login');
      return;
    }

    // Navigate to material detail page for direct purchase
    navigate(`/materials/${fullMaterial.id}`);
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
            Preview our comprehensive study materials with free samples. Love what you see? Purchase the complete version instantly with our integrated payment system!
          </p>
          <div className="flex justify-center items-center gap-4 text-blue-100">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>Free Sample Viewing</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Instant Purchase</span>
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
                <h4 className="font-semibold mb-2">2. Purchase Instantly</h4>
                <p className="text-gray-600">Like the sample? Purchase the complete study material with instant payment</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">3. Download Immediately</h4>
                <p className="text-gray-600">Get instant access to download the complete material after payment</p>
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
                            onClick={() => handlePurchaseFullVersion(material.title, material.category)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Purchase Now
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 text-center">
                      <Download className="h-3 w-3 inline mr-1" />
                      Instant download after payment
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Materials?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Content</h3>
              <p className="text-gray-600">Comprehensive and well-structured study materials prepared by experts</p>
            </div>
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-600">Download immediately after payment - no waiting, no delays</p>
            </div>
            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Coverage</h3>
              <p className="text-gray-600">Full comprehensive study material with all topics covered in detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Purchase Your Study Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection and get instant access to high-quality study materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/materials">View All Materials</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/dashboard">My Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Samples;
