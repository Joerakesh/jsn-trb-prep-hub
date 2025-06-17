
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ShoppingCart, FileText, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Materials = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const materials = [
    {
      id: 1,
      title: "UG TRB Tamil Complete Package",
      description: "Comprehensive study material for Tamil subject in UG TRB examination",
      price: "₹1,299",
      category: "ug",
      subjects: ["Grammar", "Literature", "Pedagogy", "Question Bank"],
      pages: "500+ pages",
      format: "Physical Book + PDF"
    },
    {
      id: 2,
      title: "UG TRB English Master Guide",
      description: "Complete English preparation material with practice questions",
      price: "₹1,199",
      category: "ug", 
      subjects: ["Grammar", "Literature", "Teaching Methods", "Mock Tests"],
      pages: "450+ pages",
      format: "Physical Book"
    },
    {
      id: 3,
      title: "UG TRB Mathematics Complete Set",
      description: "Mathematical concepts and problem-solving techniques for UG TRB",
      price: "₹1,399",
      category: "ug",
      subjects: ["Algebra", "Geometry", "Statistics", "Pedagogy"],
      pages: "600+ pages", 
      format: "Physical Book + PDF"
    },
    {
      id: 4,
      title: "PG TRB Educational Psychology",
      description: "Advanced educational psychology concepts for PG TRB candidates",
      price: "₹1,599",
      category: "pg",
      subjects: ["Learning Theories", "Child Development", "Assessment", "Research"],
      pages: "400+ pages",
      format: "Physical Book"
    },
    {
      id: 5,
      title: "PG TRB Research Methodology",
      description: "Complete guide to research methods and statistics for PG TRB",
      price: "₹1,499",
      category: "pg",
      subjects: ["Research Design", "Statistics", "Data Analysis", "Report Writing"],
      pages: "350+ pages",
      format: "Physical Book + PDF"
    },
    {
      id: 6,
      title: "Complete TRB Question Bank",
      description: "5000+ previous year questions with detailed solutions",
      price: "₹999",
      category: "both",
      subjects: ["All Subjects", "Previous Years", "Mock Tests", "Solutions"],
      pages: "800+ pages",
      format: "Physical Book + PDF"
    }
  ];

  const categories = [
    { id: "all", name: "All Materials" },
    { id: "ug", name: "UG TRB" },
    { id: "pg", name: "PG TRB" },
    { id: "both", name: "General" }
  ];

  const filteredMaterials = selectedCategory === "all" 
    ? materials 
    : materials.filter(material => material.category === selectedCategory);

  const handleAddToCart = (materialId: number) => {
    // This would typically integrate with a payment system
    console.log(`Added material ${materialId} to cart`);
    alert("Material added to cart! Payment integration will be implemented.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Study Materials</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Comprehensive study materials designed by experts to help you succeed in TRB examinations
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Materials Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {material.category === "ug" ? "UG TRB" : material.category === "pg" ? "PG TRB" : "General"}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{material.price}</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Includes:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {material.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {material.pages}
                    </span>
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {material.format}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleAddToCart(material.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Materials?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Curated</h3>
              <p className="text-gray-600">Content developed by experienced TRB educators and subject matter experts</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Updated Content</h3>
              <p className="text-gray-600">Materials updated according to latest TRB syllabus and exam patterns</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
              <p className="text-gray-600">Available in both physical books and digital PDF formats for convenience</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Materials;
