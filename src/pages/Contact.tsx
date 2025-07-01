
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact JSN English Academy</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get in touch with Dr. S. Jerald Sagaya Nathan for academic guidance, course information, or any inquiries
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Reach out to Dr. Nathan for academic support and course inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">jsnathan1981@gmail.com</p>
                    <p className="text-sm text-gray-500">Primary contact for all inquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+91 98432 87913</p>
                    <p className="text-gray-600">+91 96292 87913</p>
                    <p className="text-sm text-gray-500">Available during office hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">
                      245/8, Astalakshmi Avenue<br />
                      First Main Road, Vasan Valley<br />
                      Rettaivaikal Post<br />
                      Tiruchirappalli – 620102<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
                <CardDescription>
                  For immediate assistance or specific inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('tel:+919843287913')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('mailto:jsnathan1981@gmail.com')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Specialized Support:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• UGC-NET & SET Coaching</li>
                    <li>• TRB Training & Preparation</li>
                    <li>• Academic Research Guidance</li>
                    <li>• English Literature Tutoring</li>
                    <li>• Soft Skills Development</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
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
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject *</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>
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
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Academic Profile Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Dr. S. Jerald Sagaya Nathan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Ph.D.</div>
                  <p className="text-sm text-gray-600">English Literature</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">12+</div>
                  <p className="text-sm text-gray-600">Years Teaching Experience</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">15+</div>
                  <p className="text-sm text-gray-600">Research Publications</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
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
