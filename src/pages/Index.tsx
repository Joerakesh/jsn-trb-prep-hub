
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Target,
  Clock,
  Download,
  PlayCircle,
  User,
  Trophy,
  Lightbulb,
  Heart,
  ArrowRight,
  GraduationCap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Study Materials",
      description: "Complete TRB preparation materials covering all topics with detailed explanations and practice questions.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Learn from JSN Sir with 20+ years of experience and proven track record of student success.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Award,
      title: "95% Success Rate",
      description: "Join thousands of successful TRB qualifiers who achieved their dreams with our guidance.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Target,
      title: "Personalized Approach",
      description: "Individual attention and customized study plans to meet each student's unique learning needs.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const achievements = [
    { number: "8000+", label: "Students Trained", icon: Users },
    { number: "20+", label: "Years Experience", icon: Clock },
    { number: "95%", label: "Success Rate", icon: Trophy },
    { number: "100+", label: "Study Materials", icon: BookOpen }
  ];

  const testimonials = [
    {
      name: "Priya Krishnan",
      role: "TRB Qualified Teacher",
      content: "JSN Sir's teaching method is exceptional. His materials and guidance helped me clear TRB in my first attempt.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Government School Teacher",
      content: "The personalized attention and comprehensive study materials made all the difference in my preparation.",
      rating: 5
    },
    {
      name: "Meera Sundaram",
      role: "English Teacher",
      content: "20+ years of experience shows in every lesson. JSN Sir is truly a master educator and mentor.",
      rating: 5
    }
  ];

  const whyChooseUs = [
    {
      icon: Lightbulb,
      title: "Innovative Teaching Methods",
      description: "Modern teaching techniques combined with traditional wisdom for effective learning"
    },
    {
      icon: Heart,
      title: "Student-Centered Approach",
      description: "Every student receives personal attention and customized guidance"
    },
    {
      icon: Globe,
      title: "Comprehensive Coverage",
      description: "Complete TRB syllabus coverage with detailed study materials and practice tests"
    },
    {
      icon: GraduationCap,
      title: "Expert Mentorship",
      description: "Learn from JSN Sir's 20+ years of experience in English education and TRB coaching"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="JSN English Academy - Premier TRB Coaching in Tamil Nadu"
        description="Join JSN English Academy for comprehensive TRB preparation with expert guidance from JSN Sir. 20+ years experience, 95% success rate, and personalized coaching for English teachers."
        keywords="TRB coaching, English teacher training, Tamil Nadu TRB, JSN English Academy, teacher recruitment board, English education"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-white text-blue-600 px-4 py-2 text-sm font-medium">
                ⭐ Trusted by 8000+ Students
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Master Your <span className="text-yellow-400">TRB Dreams</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-in-left max-w-3xl mx-auto leading-relaxed">
              Join JSN English Academy and transform your teaching career with expert guidance, 
              comprehensive materials, and 20+ years of proven success in TRB preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-right">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
                <Link to="/materials" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Explore Materials
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                <Link to="/about" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Meet JSN Sir
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white rounded-full opacity-10 animate-bounce"></div>
      </section>

      {/* Achievement Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-t-4 border-blue-500">
                  <CardContent className="pt-6">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                    <div className="text-gray-600">{achievement.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose JSN English Academy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience excellence in TRB preparation with our comprehensive approach, 
              expert guidance, and proven track record of success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="pt-6">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About JSN Sir Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-8">
                  <User className="h-16 w-16 text-white" />
                </div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet JSN Sir</h2>
                    <p className="text-xl text-blue-600 font-semibold mb-4">Jerald Sagaya - Founder & Chief Educator</p>
                  </div>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      With over 20 years of dedicated experience in English education and TRB coaching, 
                      JSN Sir has transformed the lives of thousands of students across Tamil Nadu.
                    </p>
                    <p className="text-lg leading-relaxed">
                      His innovative teaching methods, combined with deep subject expertise and 
                      unwavering commitment to student success, have established JSN English Academy 
                      as the premier destination for TRB preparation.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1">M.A. English Literature</Badge>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">B.Ed. Qualified</Badge>
                    <Badge className="bg-purple-100 text-purple-800 px-3 py-1">NET Qualified</Badge>
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1">20+ Years Experience</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {whyChooseUs.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our successful students who achieved their TRB dreams with JSN English Academy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your TRB Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join thousands of successful students who chose JSN English Academy for their TRB preparation. 
            Your teaching career transformation begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
              <Link to="/materials" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Browse Study Materials
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              <Link to="/contact" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Get Started Today
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
