
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BookOpen, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Samples = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be managed by auth context

  const sampleMaterials = [
    {
      id: 1,
      title: "UG TRB Tamil Sample Chapter",
      description: "Sample chapter covering Tamil grammar fundamentals",
      category: "UG TRB",
      pages: "25 pages",
      format: "PDF",
      downloadUrl: "/samples/ug-tamil-sample.pdf"
    },
    {
      id: 2,
      title: "UG TRB English Practice Questions",
      description: "Sample question bank with detailed solutions",
      category: "UG TRB", 
      pages: "20 pages",
      format: "PDF",
      downloadUrl: "/samples/ug-english-questions.pdf"
    },
    {
      id: 3,
      title: "PG TRB Educational Psychology Preview",
      description: "Introduction to learning theories and child development",
      category: "PG TRB",
      pages: "30 pages",
      format: "PDF", 
      downloadUrl: "/samples/pg-psychology-preview.pdf"
    },
    {
      id: 4,
      title: "Mathematics Problem Solving Techniques",
      description: "Sample mathematical concepts and problem-solving methods",
      category: "UG TRB",
      pages: "35 pages",
      format: "PDF",
      downloadUrl: "/samples/math-techniques.pdf"
    },
    {
      id: 5,
      title: "Research Methodology Sample",
      description: "Introduction to research design and methodology",
      category: "PG TRB",
      pages: "28 pages", 
      format: "PDF",
      downloadUrl: "/samples/research-methodology.pdf"
    },
    {
      id: 6,
      title: "Previous Year Questions Sample",
      description: "Collection of previous year TRB questions with solutions",
      category: "General",
      pages: "40 pages",
      format: "PDF",
      downloadUrl: "/samples/previous-questions.pdf"
    }
  ];

  const handleDownload = (downloadUrl: string, title: string) => {
    if (!isLoggedIn) {
      alert("Please login to download sample materials");
      return;
    }
    // Simulate download
    console.log(`Downloading: ${title}`);
    alert(`Downloading: ${title}`);
  };

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

      {/* Login Notice */}
      {!isLoggedIn && (
        <section className="container mx-auto px-4 py-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center py-8">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Login Required</h3>
              <p className="text-blue-700 mb-4">
                Please login to your account to download free sample materials
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/login">Login to Download Samples</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

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
                  <Badge variant="outline">{material.category}</Badge>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {material.pages}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {material.format}
                    </span>
                  </div>

                  <Button 
                    className={`w-full ${isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={() => handleDownload(material.downloadUrl, material.title)}
                    disabled={!isLoggedIn}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoggedIn ? 'Download Sample' : 'Login Required'}
                  </Button>
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
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Access</h3>
              <p className="text-gray-600">Completely free samples available to all registered users</p>
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
