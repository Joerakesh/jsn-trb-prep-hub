
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, BookOpen, Award, Clock } from "lucide-react";

const Works = () => {
  const deliveryProcess = [
    {
      step: 1,
      title: "Order Placement",
      description: "Place your order through our secure online platform",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />
    },
    {
      step: 2,
      title: "Order Confirmation",
      description: "Receive instant confirmation with order details via email",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />
    },
    {
      step: 3,
      title: "Material Preparation",
      description: "Our team prepares and quality-checks your study materials",
      icon: <Users className="h-8 w-8 text-orange-600" />
    },
    {
      step: 4,
      title: "Fast Delivery",
      description: "Materials delivered to your doorstep within 3-5 business days",
      icon: <Clock className="h-8 w-8 text-purple-600" />
    }
  ];

  const successStories = [
    {
      name: "Priya S.",
      position: "UG TRB - English",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "JSN Academy's materials were comprehensive and exactly what I needed for TRB preparation."
    },
    {
      name: "Rajesh K.",
      position: "PG TRB - Mathematics",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "The quality of study materials and online tests helped me clear the exam in my first attempt."
    },
    {
      name: "Kavitha M.",
      position: "UG TRB - Tamil",
      year: "2022",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonial: "Excellent materials with detailed explanations. Highly recommend JSN Academy."
    }
  ];

  const achievements = [
    { number: "500+", label: "Students Placed", icon: <Users className="h-6 w-6" /> },
    { number: "85%", label: "Success Rate", icon: <Award className="h-6 w-6" /> },
    { number: "100+", label: "Study Materials", icon: <BookOpen className="h-6 w-6" /> },
    { number: "10+", label: "Years Experience", icon: <Clock className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Works & Achievements</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover our proven track record of helping aspiring teachers achieve their dreams through quality education and comprehensive support.
          </p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-blue-600">
                    {achievement.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{achievement.number}</h3>
                  <p className="text-gray-600">{achievement.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Delivery Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deliveryProcess.map((process, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {process.icon}
                  </div>
                  <Badge variant="secondary" className="w-fit mx-auto mb-2">
                    Step {process.step}
                  </Badge>
                  <CardTitle className="text-xl">{process.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{story.name}</h3>
                      <p className="text-blue-600 font-medium">{story.position}</p>
                      <Badge variant="outline">{story.year}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{story.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quality Assurance</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Expert Content Review</h3>
                    <p className="text-gray-600">All materials reviewed by subject matter experts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Regular Updates</h3>
                    <p className="text-gray-600">Content updated according to latest exam patterns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Quality Control</h3>
                    <p className="text-gray-600">Rigorous quality checks before delivery</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">Student Feedback</h3>
                    <p className="text-gray-600">Continuous improvement based on student feedback</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Quality materials" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Works;
