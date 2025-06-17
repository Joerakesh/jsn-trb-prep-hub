
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Mail, Lock, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", loginData);
    alert("Login functionality will be implemented with authentication system");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Signup attempt:", signupData);
    alert("Signup functionality will be implemented with authentication system");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Student Portal</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Login to access your study materials, download samples, and track your progress
          </p>
        </div>
      </section>

      {/* Login/Signup Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to JSN Academy</h2>
            <p className="text-gray-600 mt-2">Access your learning portal</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          required
                          value={loginData.email}
                          onChange={handleLoginChange}
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          required
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          name="name"
                          type="text"
                          required
                          value={signupData.name}
                          onChange={handleSignupChange}
                          placeholder="Enter your full name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          required
                          value={signupData.email}
                          onChange={handleSignupChange}
                          placeholder="Enter your email"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-phone"
                          name="phone"
                          type="tel"
                          required
                          value={signupData.phone}
                          onChange={handleSignupChange}
                          placeholder="Enter your phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          value={signupData.password}
                          onChange={handleSignupChange}
                          placeholder="Create a password"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type="password"
                          required
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          placeholder="Confirm your password"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Member Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Sample Downloads</h3>
              <p className="text-gray-600">Access free sample chapters and practice questions</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
              <p className="text-gray-600">Track your material orders and delivery status</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Updates & Notifications</h3>
              <p className="text-gray-600">Get notified about new materials and exam updates</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
