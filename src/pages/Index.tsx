
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, CheckCircle, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Study Materials",
      description: "Expert-curated materials for both UG and PG TRB examinations"
    },
    {
      icon: FileText,
      title: "Practice Tests",
      description: "Mock tests designed to simulate real TRB exam conditions"
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Trusted by hundreds of successful TRB aspirants"
    },
    {
      icon: Clock,
      title: "Regular Updates",
      description: "Content updated according to latest TRB syllabus and patterns"
    }
  ];

  const courses = [
    {
      title: "UG TRB Preparation",
      description: "Complete preparation package for Undergraduate TRB exams",
      subjects: ["Tamil", "English", "Mathematics", "Science", "Social Science"],
      price: "₹2,999",
      badge: "Popular"
    },
    {
      title: "PG TRB Preparation", 
      description: "Specialized materials for Postgraduate TRB examinations",
      subjects: ["Subject Methodology", "Educational Psychology", "Research Methods"],
      price: "₹3,999",
      badge: "Comprehensive"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            Tamil Nadu's Premier TRB Coaching Center
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            JSN Academy
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Your Gateway to TRB Success
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Empowering aspiring teachers with comprehensive study materials and expert guidance for UG & PG TRB examinations. Join hundreds of successful candidates who trusted JSN Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/materials">Browse Study Materials</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="/tests">Take Free Mock Test</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Successful Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Study Materials</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JSN Academy?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive preparation resources tailored specifically for TRB examinations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Course Offerings</h2>
            <p className="text-gray-600">Specialized preparation packages for UG and PG TRB examinations</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {course.badge}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{course.price}</div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {course.subjects.map((subject, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to="/materials">View Materials</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your TRB Journey?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of successful teachers who achieved their dreams with JSN Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/samples">Download Free Samples</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
