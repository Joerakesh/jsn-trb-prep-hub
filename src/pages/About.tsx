
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, BookOpen, Target, Eye, Heart, Star, Calendar, CheckCircle, TrendingUp, Globe, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  const achievements = [
    { icon: Users, count: "5000+", label: "Students Trained", color: "text-blue-600" },
    { icon: Award, count: "95%", label: "Success Rate", color: "text-green-600" },
    { icon: BookOpen, count: "50+", label: "Study Materials", color: "text-purple-600" },
    { icon: Star, count: "4.9/5", label: "Student Rating", color: "text-yellow-600" }
  ];

  const milestones = [
    { year: "2018", title: "JSN Academy Founded", description: "Started with a vision to make quality education accessible to all" },
    { year: "2019", title: "First 100 Students", description: "Reached our first milestone of 100 successful students" },
    { year: "2020", title: "Digital Transformation", description: "Adapted to online learning during challenging times" },
    { year: "2021", title: "Material Excellence", description: "Launched comprehensive study material program" },
    { year: "2022", title: "Community Growth", description: "Built a strong community of 1000+ active learners" },
    { year: "2023", title: "Recognition & Awards", description: "Received excellence awards from educational institutions" },
    { year: "2024", title: "Innovation Leader", description: "Leading with innovative teaching methodologies and technology" }
  ];

  const teamMembers = [
    {
      name: "JSN Sir",
      role: "Founder & Chief Educator",
      description: "20+ years of experience in English education and TRB preparation",
      expertise: ["English Literature", "Grammar & Composition", "TRB Coaching", "Curriculum Development"]
    },
    {
      name: "Expert Faculty",
      role: "Teaching Team",
      description: "Dedicated team of qualified educators with proven track records",
      expertise: ["Subject Matter Experts", "Exam Strategy", "Student Mentoring", "Content Creation"]
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our teaching methods to student support."
    },
    {
      icon: Heart,
      title: "Care",
      description: "Every student matters to us. We provide personalized attention and care for each learner."
    },
    {
      icon: CheckCircle,
      title: "Integrity",
      description: "We maintain the highest standards of integrity in our educational practices and student relationships."
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "We believe in continuous growth - both for our students and our educational methodologies."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="About Us - JSN English Academy"
        description="Learn about JSN English Academy's mission to provide quality English education and TRB preparation. Discover our story, values, and commitment to student success."
        keywords="JSN English Academy, about us, English education, TRB coaching, educational excellence, student success"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-slide-in-left">
              About JSN English Academy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-in-right">
              Empowering students with quality English education and comprehensive TRB preparation for over 6 years.
              Our commitment to excellence has helped thousands of students achieve their academic and career goals.
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="pt-6">
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 ${achievement.color}`} />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.count}</div>
                    <div className="text-sm text-gray-600">{achievement.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To provide comprehensive, accessible, and high-quality English education that empowers students 
                  to excel in their academic pursuits and professional careers. We are committed to making 
                  TRB preparation effective, engaging, and result-oriented for every student.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="h-6 w-6 text-purple-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading educational institution that transforms English learning experiences 
                  and sets new standards in TRB preparation. We envision a future where every student 
                  has access to quality education and achieves their full potential.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="pt-6">
                      <IconComponent className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Our Journey Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6 hover:bg-white p-6 rounded-lg transition-colors duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{member.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gray-900 mb-4">Why Choose JSN English Academy?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
                  <p className="text-sm text-gray-600">Complete TRB syllabus coverage with detailed study materials</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
                  <p className="text-sm text-gray-600">95% success rate with thousands of satisfied students</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Attention</h3>
                  <p className="text-sm text-gray-600">Individual guidance and personalized learning approach</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
