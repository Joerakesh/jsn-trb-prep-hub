
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy, ArrowRight, Star, Download, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Excel in TRB Examinations with JSN Academy
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive study materials, expert guidance, and proven strategies to help you succeed in UG TRB, PG TRB, and general competitive examinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/materials">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Study Materials
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/tests">
                  <Trophy className="h-5 w-5 mr-2" />
                  Take Mock Tests
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JSN Academy?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive resources and expert guidance to help you achieve your teaching career goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Expert Study Materials</CardTitle>
                <CardDescription>
                  Comprehensive study guides created by subject matter experts with years of teaching experience.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Proven Track Record</CardTitle>
                <CardDescription>
                  Thousands of successful candidates have achieved their goals with our guidance and materials.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Mock Tests & Practice</CardTitle>
                <CardDescription>
                  Regular mock tests and practice sessions to help you assess your preparation and improve performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exam Categories</h2>
            <p className="text-gray-600">Specialized preparation materials for different TRB examinations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="bg-blue-100 text-blue-800 w-fit mb-2">UG TRB</Badge>
                <CardTitle>Undergraduate TRB</CardTitle>
                <CardDescription>
                  Complete preparation materials for UG TRB examinations across various subjects including Tamil, English, Mathematics, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/materials">
                    View UG TRB Materials
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="bg-purple-100 text-purple-800 w-fit mb-2">PG TRB</Badge>
                <CardTitle>Postgraduate TRB</CardTitle>
                <CardDescription>
                  Advanced study materials for PG TRB examinations with focus on educational psychology, research methodology, and subject expertise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/materials">
                    View PG TRB Materials
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="bg-green-100 text-green-800 w-fit mb-2">General</Badge>
                <CardTitle>General Preparation</CardTitle>
                <CardDescription>
                  General knowledge, aptitude, and reasoning materials essential for all TRB examinations and competitive tests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/materials">
                    View General Materials
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Materials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Before You Buy</h2>
            <p className="text-gray-600">Download free sample materials to experience the quality of our content</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-4 w-4 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-800">UG TRB</Badge>
                </div>
                <CardTitle className="text-lg">Physics Sample Chapter</CardTitle>
                <CardDescription>
                  Sample chapter covering fundamental physics concepts with solved examples and practice questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>25 pages</span>
                  <span>PDF format</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/samples">
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-4 w-4 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-800">PG TRB</Badge>
                </div>
                <CardTitle className="text-lg">Psychology Preview</CardTitle>
                <CardDescription>
                  Introduction to educational psychology concepts including learning theories and child development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>30 pages</span>
                  <span>PDF format</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/samples">
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Mock Test</Badge>
                </div>
                <CardTitle className="text-lg">Quick Assessment</CardTitle>
                <CardDescription>
                  Take a quick 30-minute assessment to evaluate your current preparation level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>50 questions</span>
                  <span>30 minutes</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/tests">
                    <Clock className="h-4 w-4 mr-2" />
                    Take Test
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful candidates who achieved their dreams with JSN Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/login">
                  Get Started Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/materials">
                  Browse Materials
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
