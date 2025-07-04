
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, BookOpen, Users, Award, CheckCircle, Star, Globe, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact form submitted:', formData);
    toast.success("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      category: "general"
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inquiryCategories = [
    { value: "general", label: "General Inquiry", icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
    { value: "courses", label: "Course Information", icon: BookOpen, color: "bg-green-100 text-green-800" },
    { value: "coaching", label: "Personal Coaching", icon: Users, color: "bg-purple-100 text-purple-800" },
    { value: "materials", label: "Study Materials", icon: BookOpen, color: "bg-orange-100 text-orange-800" },
    { value: "research", label: "Research Guidance", icon: Award, color: "bg-red-100 text-red-800" },
  ];

  const services = [
    { icon: BookOpen, title: "UGC-NET Coaching", description: "Comprehensive training for UGC-NET English Literature", popular: true },
    { icon: Award, title: "SET Preparation", description: "State Eligibility Test preparation with expert guidance", popular: true },
    { icon: Users, title: "TRB Training", description: "Teacher Recruitment Board exam preparation", popular: false },
    { icon: Heart, title: "Research Supervision", description: "PhD and M.Phil research guidance and support", popular: false },
    { icon: Globe, title: "Online Tutoring", description: "One-on-one English Literature tutoring sessions", popular: true },
    { icon: Star, title: "Soft Skills Development", description: "Communication and presentation skills training", popular: false },
  ];

  const testimonials = [
    { name: "Priya R.", role: "UGC-NET Qualified", message: "Dr. Nathan's guidance was instrumental in my NET qualification. His teaching methodology is exceptional!" },
    { name: "Arjun M.", role: "Research Scholar", message: "The research guidance provided helped me complete my PhD successfully. Highly recommended!" },
    { name: "Lakshmi S.", role: "TRB Qualified", message: "Clear explanations and comprehensive study materials made TRB preparation much easier." },
  ];

  const faqs = [
    { question: "What are the available coaching programs?", answer: "We offer comprehensive coaching for UGC-NET, SET, TRB, and personalized research guidance." },
    { question: "Do you provide online classes?", answer: "Yes, we offer both online and offline coaching sessions based on your preference and convenience." },
    { question: "What is the duration of coaching programs?", answer: "Program duration varies from 3-6 months depending on the course and your preparation level." },
    { question: "Are study materials included?", answer: "Yes, comprehensive study materials and practice tests are included in all our coaching programs." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contact JSN English Academy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get in touch with Dr. S. Jerald Sagaya Nathan for academic guidance, course information, or any inquiries
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                <Clock className="h-4 w-4 mr-2" />
                Quick Response Within 24 Hours
              </Badge>
              <Badge className="px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                <CheckCircle className="h-4 w-4 mr-2" />
                Personalized Academic Support
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="contact" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="services">Our Services</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8 animate-slide-in-left">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                      Get in Touch
                    </CardTitle>
                    <CardDescription>
                      Reach out to Dr. Nathan for academic support and course inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                      <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <p className="text-gray-600 text-lg">jsnathan1981@gmail.com</p>
                        <p className="text-sm text-gray-500">Primary contact for all inquiries</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors">
                      <Phone className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">Phone</h3>
                        <p className="text-gray-600 text-lg">+91 98432 87913</p>
                        <p className="text-gray-600 text-lg">+91 96292 87913</p>
                        <p className="text-sm text-gray-500">Available during office hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                      <MapPin className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">Address</h3>
                        <p className="text-gray-600 leading-relaxed">
                          245/8, Astalakshmi Avenue<br />
                          First Main Road, Vasan Valley<br />
                          Rettaivaikal Post<br />
                          Tiruchirappalli – 620102<br />
                          Tamil Nadu, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-orange-50 transition-colors">
                      <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">Office Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Contact</CardTitle>
                    <CardDescription className="text-blue-100">
                      For immediate assistance or specific inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start hover:scale-105 transition-transform"
                        onClick={() => window.open('tel:+919843287913')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start hover:scale-105 transition-transform"
                        onClick={() => window.open('mailto:jsnathan1981@gmail.com')}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98432 87913"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Inquiry Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          {inquiryCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this regarding?"
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your inquiry in detail..."
                        rows={6}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-105"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600">Comprehensive academic support and specialized training programs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="relative shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {service.popular && (
                    <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-center">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
              <p className="text-xl text-gray-600">Success stories from our academic community</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.message}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Find answers to common questions about our services</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Academic Profile Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">About Dr. S. Jerald Sagaya Nathan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold mb-2">Ph.D.</div>
                  <p className="text-blue-100">English Literature</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold mb-2">12+</div>
                  <p className="text-blue-100">Years Teaching Experience</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <p className="text-blue-100">Research Publications</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed">
              Assistant Professor of English at St. Joseph's College (Autonomous), Tiruchirappalli. 
              Specialized in Comparative Literature, Translation Studies, and Indian Writing in English. 
              Expert trainer for UGC-NET, SET, and TRB examinations with over a decade of experience 
              in academic coaching and research supervision.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
