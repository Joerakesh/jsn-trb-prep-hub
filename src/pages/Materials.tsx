
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Filter, Search, Star, FileText, Eye, MessageCircle, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  format: string;
  image_url: string;
}

interface SampleMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  format: string;
  download_url: string;
}

const Materials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: materials = [], isLoading: materialsLoading, error: materialsError } = useQuery({
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

  const { data: sampleMaterials = [], isLoading: samplesLoading } = useQuery({
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

  const handleContactAdmin = (materialTitle: string) => {
    if (!user) {
      toast.error("Please login to contact admin");
      navigate('/login');
      return;
    }

    const message = `Hi, I'm interested in purchasing: ${materialTitle}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSamples = sampleMaterials.filter(sample => {
    const matchesSearch = sample.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || sample.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  if (materialsError) {
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

  if (materialsLoading || samplesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

        {/* Tabs for Materials and Samples */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="materials">Full Materials</TabsTrigger>
            <TabsTrigger value="samples">Free Samples</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'}
              </p>
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No materials found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material) => (
                  <Card 
                    key={material.id} 
                    className="hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getCategoryColor(material.category)}>
                          {formatCategory(material.category)}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {material.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{material.pages} pages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{material.format}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                        >
                          <Link to={`/material/${material.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleContactAdmin(material.title)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Admin
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="samples">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredSamples.length} free {filteredSamples.length === 1 ? 'sample' : 'samples'}
              </p>
            </div>

            {/* How It Works Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
              <CardContent className="py-6">
                <h3 className="text-xl font-bold text-center mb-6">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">1. View Free Sample</h4>
                    <p className="text-sm text-gray-600">Browse and view sample chapters completely free</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">2. Contact Admin</h4>
                    <p className="text-sm text-gray-600">Message admin on WhatsApp for purchase</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">3. Get Delivery</h4>
                    <p className="text-sm text-gray-600">Pay via GPay & receive material via courier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {filteredSamples.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No samples found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSamples.map((sample) => (
                  <Card key={sample.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Free Sample
                        </Badge>
                        <Badge variant="outline">{formatCategory(sample.category)}</Badge>
                      </div>
                      <CardTitle className="text-lg">{sample.title}</CardTitle>
                      <CardDescription className="text-sm">{sample.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {sample.pages} pages
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {sample.format}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => handleViewSample(sample.download_url, sample.title)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Free Sample
                          </Button>
                          
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 mb-2">
                              <strong>Interested in full version?</strong>
                            </p>
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handleContactAdmin(sample.title)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Admin
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Materials;
