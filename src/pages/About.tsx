
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, GraduationCap, Award, Users, Target, Heart, Star, Calendar, MapPin, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  const achievements = [
    { icon: GraduationCap, title: "Ph.D. in English Literature", description: "Specialized in Comparative Literature and Translation Studies" },
    { icon: BookOpen, title: "15+ Research Publications", description: "Published in renowned academic journals" },
    { icon: Users, title: "12+ Years Teaching Experience", description: "Assistant Professor at St. Joseph's College" },
    { icon: Award, title: "Expert Trainer", description: "UGC-NET, SET, and TRB examination specialist" },
  ];

  const specializations = [
    "Comparative Literature",
    "Translation Studies", 
    "Indian Writing in English",
    "UGC-NET Coaching",
    "SET Preparation",
    "TRB Training",
    "Research Supervision",
    "Academic Writing"
  ];

  const timeline = [
    { year: "2024", event: "Launched JSN English Academy Digital Platform" },
    { year: "2018", event: "Joined St. Joseph's College as Assistant Professor" },
    { year: "2016", event: "Completed Ph.D. in English Literature" },
    { year: "2012", event: "Started Teaching Career" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEOHead 
        title="About Dr. S. Jerald Sagaya Nathan - JSN English Academy"
        description="Learn about Dr. S. Jerald Sagaya Nathan, Ph.D. in English Literature, Assistant Professor, and expert trainer for UGC-NET, SET, and TRB examinations with 12+ years of teaching experience."
        keywords="Dr. S. Jerald Sagaya Nathan, English Literature, UGC-NET, SET, TRB, Assistant Professor, St. Joseph's College, Tiruchirappalli"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dr. S. Jerald Sagaya Nathan
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Ph.D. in English Literature | Assistant Professor | Academic Excellence Mentor
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                  <MapPin className="h-3 w-3 mr-1" />
                  Tiruchirappalli, Tamil Nadu
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                  <Calendar className="h-3 w-3 mr-1" />
                  12+ Years Experience
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
            Academic Excellence & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-left border-0 bg-white/80 backdrop-blur-sm" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <achievement.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Journey */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
              Professional Journey
            </h2>
            <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-red-500" />
                  Mission & Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Our Mission
                  </h3>
                  <p className="text-blue-800">
                    To empower students and educators with comprehensive, high-quality educational resources 
                    and expert guidance that transforms learning experiences and academic outcomes in English Literature and competitive examinations.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Our Vision
                  </h3>
                  <p className="text-purple-800">
                    To be the leading platform for English Literature education and competitive exam preparation, 
                    fostering academic excellence and creating pathways to success for aspiring educators and researchers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specializations */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Areas of Specialization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {specializations.map((spec, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="justify-center py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-default"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Academic Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {item.year}
                        </div>
                        <p className="text-gray-700 font-medium">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl text-blue-100 mb-8">
              Ready to begin your academic journey? Connect with Dr. Nathan for personalized guidance and support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-blue-100">jsnathan1981@gmail.com</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-blue-100">+91 98432 87913</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
                <MapPin className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-blue-100">Tiruchirappalli, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
