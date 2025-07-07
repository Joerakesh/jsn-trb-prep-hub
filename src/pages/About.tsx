import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Award,
  BookOpen,
  Target,
  Eye,
  Heart,
  Star,
  Calendar,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Trophy,
  Lightbulb,
  Globe,
  FileText,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  const achievements = [
    {
      icon: Users,
      count: "8000+",
      label: "Students Taught",
      color: "text-blue-600",
    },
    {
      icon: Award,
      count: "13+",
      label: "Years Experience",
      color: "text-green-600",
    },
    {
      icon: BookOpen,
      count: "100+",
      label: "Study Materials",
      color: "text-purple-600",
    },
    {
      icon: Star,
      count: "4.9/5",
      label: "Student Rating",
      color: "text-yellow-600",
    },
  ];

  const qualifications = [
    "M.A. English Literature",
    "B.Ed. (Bachelor of Education)",
    "NET Qualified (National Eligibility Test)",
    "TRB Specialist with 13+ Years Experience",
    "Expert in English Grammar & Composition",
    "Curriculum Development Specialist",
  ];

  const expertise = [
    { area: "English Literature", years: "13+ Years", icon: BookOpen },
    { area: "TRB Coaching", years: "13+ Years", icon: GraduationCap },
    { area: "Grammar & Composition", years: "13+ Years", icon: Star },
    { area: "Competitive Exams", years: "13+ Years", icon: Trophy },
  ];

  const milestones = [
    {
      year: "2011",
      title: "Teaching Career Began",
      description:
        "Started teaching English at St. Joseph's College (Autonomous), Trichy",
    },
    {
      year: "2014",
      title: "TRB Specialization",
      description:
        "Began specializing in TRB coaching and preparation materials",
    },
    {
      year: "2023",
      title: "Digital Innovation",
      description: "Introduced online learning materials and digital resources",
    },
    {
      year: "2024",
      title: "JSN English Academy",
      description:
        "Established JSN English Academy for comprehensive TRB preparation",
    },
    // {
    //   year: "2020",
    //   title: "Online Excellence",
    //   description: "Seamlessly transitioned to online teaching during pandemic",
    // },
    // {
    //   year: "2022",
    //   title: "5000+ Success Stories",
    //   description: "Reached milestone of 5000+ successful TRB qualifiers",
    // },
    // {
    //   year: "2024",
    //   title: "Educational Leadership",
    //   description:
    //     "Recognized as leading educator in Tamil Nadu TRB preparation",
    // },
  ];

  const teachingPhilosophy = [
    {
      principle: "Student-Centered Learning",
      description:
        "Every student has unique potential that deserves personalized attention and care.",
      icon: Heart,
    },
    {
      principle: "Excellence Through Practice",
      description:
        "Consistent practice and dedication are the keys to mastering English and succeeding in TRB.",
      icon: Target,
    },
    {
      principle: "Innovative Teaching Methods",
      description:
        "Combining traditional wisdom with modern teaching techniques for effective learning.",
      icon: Lightbulb,
    },
    {
      principle: "Holistic Development",
      description:
        "Building not just academic excellence but also confidence and communication skills.",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="About Jerald Sagaya Nathan - JSN English Academy"
        description="Learn about Jerald Sagaya (JSN), the founder of JSN English Academy with 13+ years of experience in English education and TRB coaching. Discover his qualifications, teaching philosophy, and commitment to student success."
        keywords="Jerald Sagaya, JSN , English teacher, TRB coach, Tamil Nadu, English education, educational excellence"
      />
      <Navigation />

      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-in-left">
              Jerald Sagaya Nathan
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              JSN - Founder & Chief Educator
            </p>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-in-right">
              With over 20 years of dedicated experience in English education
              and TRB coaching, JSN has transformed the lives of thousands of
              students across Tamil Nadu through innovative teaching methods and
              unwavering commitment to educational excellence.
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-t-4 border-blue-500"
                >
                  <CardContent className="pt-6">
                    <IconComponent
                      className={`h-12 w-12 mx-auto mb-4 ${achievement.color}`}
                    />
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {achievement.count}
                    </div>
                    <div className="text-sm text-gray-600">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Professional Background */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  Educational Background
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700 font-medium">
                        {qualification}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-purple-600" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {expertise.map((exp, index) => {
                    const IconComponent = exp.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">{exp.area}</span>
                        </div>
                        <Badge variant="secondary">{exp.years}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teaching Philosophy */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Teaching Philosophy
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachingPhilosophy.map((philosophy, index) => {
                const IconComponent = philosophy.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-t-4 border-green-500"
                  >
                    <CardContent className="pt-6">
                      <IconComponent className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {philosophy.principle}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {philosophy.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Professional Journey Timeline */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Professional Journey
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-300"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-6 relative">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10 border-4 border-white shadow-lg">
                      {milestone.year}
                    </div>
                    <Card className="flex-grow hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-green-600" />
                  My Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  To make quality English education accessible to every aspiring
                  teacher in Tamil Nadu. My mission is to empower students with
                  comprehensive TRB preparation that goes beyond exam success to
                  build confident, competent educators who will shape future
                  generations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500">
              <CardHeader className="bg-indigo-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="h-6 w-6 text-indigo-600" />
                  My Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  To be recognized as the most trusted mentor for TRB aspirants,
                  creating a legacy of successful educators who carry forward
                  the values of excellence, integrity, and dedication in the
                  field of English education across Tamil Nadu and beyond.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* JSN Resources Section */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 border-2 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-4">
                JSN's Academic Profile & Resources
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Access JSN's detailed academic profile and teaching credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <a 
                  href="https://drive.google.com/file/d/1example-pdf-id/view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Download JSN's Academic Profile (PDF)
                </a>
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Complete academic qualifications, certifications, and teaching experience
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-4">
                Connect with JSN (Dr. S. Jerald Sagaya Nathan)
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Ready to begin your journey to TRB success? Get in touch today!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Location
                  </h3>
                  <p className="text-gray-600">Tamil Nadu, India</p>
                  <p className="text-sm text-gray-500">
                    Serving students across the state
                  </p>
                </div>
                <div className="space-y-3">
                  <Clock className="h-12 w-12 text-green-600 mx-auto" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Teaching Hours
                  </h3>
                  <p className="text-gray-600">13+ Years of Experience</p>
                  <p className="text-sm text-gray-500">
                    Dedicated to student success
                  </p>
                </div>
                <div className="space-y-3">
                  <Trophy className="h-12 w-12 text-yellow-600 mx-auto" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Success Rate
                  </h3>
                  <p className="text-gray-600">95% Pass Rate</p>
                  <p className="text-sm text-gray-500">
                    Proven track record of excellence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Thousands of Successful TRB Qualifiers
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the difference that personalized attention, expert
              guidance, and 13+ years of teaching excellence can make in your
              TRB preparation journey.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
