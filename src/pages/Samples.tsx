
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BookOpen, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
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

  const handleView = (title: string) => {
    // Anyone can view samples - no login required
    console.log(`Viewing: ${title}`);
    toast.success(`Opening sample: ${title}`);
    // Here you would typically open the PDF in a new tab or modal
    // For demo purposes, we'll just show a success message
  };

  const handleDownload = (downloadUrl: string, title: string) => {
    if (!user) {
      toast.error("Please login to download sample materials");
      return;
    }
    
    // Simulate download for logged-in users
    console.log(`Downloading: ${title}`);
    toast.success(`Downloading: ${title}`);
    // Here you would typically trigger the actual download
    // window.open(downloadUrl, '_blank');
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
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sample Study Materials</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Preview our comprehensive study materials with these free sample chapters and question banks
          </p>
        </div>
      </section>

      {/* Access Info */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-8">
            <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">Free Sample Access</h3>
            <p className="text-green-700 mb-4">
              Anyone can view sample materials. Login is only required to download them.
            </p>
            {!user && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/login">Login to Download Samples</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Sample Materials Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Free Sample
                  </Badge>
                  <Badge variant="outline">{formatCategory(material.category)}</Badge>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
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

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleView(material.title)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Sample
                    </Button>
                    
                    <Button 
                      className={`flex-1 ${user ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      onClick={() => handleDownload(material.download_url, material.title)}
                      disabled={!user}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {user ? 'Download' : 'Login Required'}
                    </Button>
                  </div>

                  {!user && (
                    <p className="text-xs text-gray-500 text-center">
                      <Lock className="h-3 w-3 inline mr-1" />
                      Login required for downloads
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What You'll Get in Samples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Preview</h3>
              <p className="text-gray-600">Get a glimpse of our comprehensive content structure and quality</p>
            </div>
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Question Patterns</h3>
              <p className="text-gray-600">Understand the question patterns and difficulty levels we cover</p>
            </div>
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Viewing</h3>
              <p className="text-gray-600">View samples without registration, download with free account</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Complete Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            If you liked our samples, explore our complete study material packages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/materials">Browse All Materials</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Samples;
