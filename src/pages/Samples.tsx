
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BookOpen, MessageCircle, Eye, Phone } from "lucide-react";
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

  const handleViewSample = (downloadUrl: string, title: string) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
      toast.success(`Opening sample: ${title}`);
    } else {
      toast.info("Sample preview will be available soon");
    }
  };

  const handleContactAdmin = (sampleTitle: string) => {
    if (!user) {
      toast.error("Please login to contact admin");
      navigate('/login');
      return;
    }

    const message = `Hi, I'm interested in purchasing the full version of: ${sampleTitle}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            Preview our comprehensive study materials with free samples. Love what you see? Contact admin via WhatsApp to purchase!
          </p>
          <div className="flex justify-center items-center gap-4 text-blue-100">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>Free Sample Viewing</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp Purchase</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold text-center mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">1. View Free Sample</h4>
                <p className="text-gray-600">Browse and view sample chapters completely free</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">2. Contact Admin</h4>
                <p className="text-gray-600">Message admin on WhatsApp for purchase</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold mb-2">3. Pay via GPay</h4>
                <p className="text-gray-600">Pay using GPay QR code and share screenshot</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">4. Get Delivery</h4>
                <p className="text-gray-600">Receive material via courier delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sample Materials Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Available Sample Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMaterials.map((material) => (
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
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Interested in full version?</strong>
                      </p>
                      <p className="text-sm text-blue-700 mb-2">Contact admin via WhatsApp</p>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleContactAdmin(material.title)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Admin
                      </Button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 text-center">
                    <Download className="h-3 w-3 inline mr-1" />
                    Physical delivery via courier after payment
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Support</h3>
              <p className="text-gray-600">Direct communication with admin for quick purchase and support</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Study Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection and contact admin for pricing and purchase
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
