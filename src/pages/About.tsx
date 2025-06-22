
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, BookOpen } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Expert Faculty",
      description: "Learn from experienced educators with proven track records in TRB exam preparation"
    },
    {
      icon: <Target className="h-12 w-12 text-blue-600" />,
      title: "Focused Approach",
      description: "Targeted study materials and practice tests designed specifically for TRB success"
    },
    {
      icon: <Award className="h-12 w-12 text-blue-600" />,
      title: "Proven Results",
      description: "Thousands of successful candidates who cleared TRB exams with our guidance"
    },
    {
      icon: <BookOpen className="h-12 w-12 text-blue-600" />,
      title: "Quality Materials",
      description: "Comprehensive study materials updated according to latest TRB exam patterns"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">About JSN Academy</h1>
              <p className="text-xl text-blue-100 mb-8">
                Empowering future teachers with comprehensive TRB exam preparation and quality education materials.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-500 px-6 py-3 rounded-lg">
                  <span className="text-2xl font-bold">500+</span>
                  <p className="text-sm">Success Stories</p>
                </div>
                <div className="bg-blue-500 px-6 py-3 rounded-lg">
                  <span className="text-2xl font-bold">10+</span>
                  <p className="text-sm">Years Experience</p>
                </div>
                <div className="bg-blue-500 px-6 py-3 rounded-lg">
                  <span className="text-2xl font-bold">100+</span>
                  <p className="text-sm">Study Materials</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students studying" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To provide aspiring teachers with the best resources, guidance, and support needed to excel in TRB examinations and build successful teaching careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Founder" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                JSN Academy was founded with a simple yet powerful vision: to bridge the gap between aspiring teachers and their dream of clearing the TRB examination. Our journey began over a decade ago when we recognized the need for specialized, quality study materials and guidance for TRB aspirants.
              </p>
              <p className="text-gray-600 mb-6">
                What started as a small initiative has now grown into Tamil Nadu's most trusted TRB coaching center, helping hundreds of candidates achieve their teaching dreams every year. Our success lies in our personalized approach, updated study materials, and continuous support to our students.
              </p>
              <p className="text-gray-600">
                Today, we continue to evolve and adapt our teaching methodologies to meet the changing patterns of TRB examinations, ensuring our students are always one step ahead in their preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose JSN Academy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Updated curriculum" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Updated Curriculum</h3>
              <p className="text-gray-600">Latest syllabus coverage with recent exam pattern analysis</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Interactive learning" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">Engaging study sessions with practical examples and case studies</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Success support" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Success Support</h3>
              <p className="text-gray-600">Continuous mentoring and doubt clarification sessions</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
