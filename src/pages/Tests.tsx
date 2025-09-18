
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  FileText,
  Users,
  ExternalLink,
  Play,
  Search,
  Filter,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  questions: string;
  difficulty: string;
  participants_count: number;
  google_form_url: string;
}

interface UserProfile {
  verification_status: string;
}

const Tests = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  const handleStartTest = (testUrl: string, testTitle: string) => {
    if (!user) {
      alert("Please login to access tests. Your login will be verified by admin.");
      return;
    }

    if (userProfile?.verification_status !== 'approved') {
      alert("Your account needs to be verified by admin before accessing tests.");
      return;
    }

    if (testUrl) {
      window.open(testUrl, "_blank");
      console.log(`Starting test: ${testTitle}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCategory = (category: string) => {
    return category.replace("_", " ");
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
    }
  };

  // Filter tests based on search and filters
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || test.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      test.difficulty.toLowerCase() === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const isUserVerified = userProfile?.verification_status === 'approved';
  const isUserPending = userProfile?.verification_status === 'pending';
  const isUserRejected = userProfile?.verification_status === 'rejected';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading tests...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Online Mock Tests</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Practice with our comprehensive mock tests designed to simulate real
            TRB exam conditions
          </p>
          <div className="flex justify-center gap-4">
            <Badge
              variant="secondary"
              className="text-blue-600 bg-white px-4 py-2"
            >
              {tests.length} Tests Available
            </Badge>
            {user && userProfile && (
              <div className="flex items-center">
                {getVerificationStatusBadge(userProfile.verification_status)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verification Status Alert */}
      {user && !isUserVerified && (
        <section className="container mx-auto px-4 py-6">
          <Card className={`border-l-4 ${
            isUserPending ? 'border-l-yellow-500 bg-yellow-50' : 
            isUserRejected ? 'border-l-red-500 bg-red-50' : 'border-l-gray-500 bg-gray-50'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {isUserPending && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                {isUserRejected && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                <div>
                  <h3 className={`font-semibold mb-2 ${
                    isUserPending ? 'text-yellow-800' : 
                    isUserRejected ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {isUserPending && "Account Verification Pending"}
                    {isUserRejected && "Account Verification Rejected"}
                  </h3>
                  <p className={`text-sm ${
                    isUserPending ? 'text-yellow-700' : 
                    isUserRejected ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {isUserPending && "Your account is under review by our admin team. You'll be able to access tests once your account is approved."}
                    {isUserRejected && "Your account verification was rejected. Please contact support for more information."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="UG_TRB">UG TRB</SelectItem>
                    <SelectItem value="PG_TRB">PG TRB</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredTests.length} of {tests.length} tests
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Timed Practice</h3>
              <p className="text-sm text-gray-600">
                Real exam timing simulation
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Get immediate feedback</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Performance Tracking</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Verified Access</h3>
              <p className="text-sm text-gray-600">
                Admin verified accounts only
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mock Tests Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available Mock Tests
        </h2>

        {filteredTests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tests found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                selectedCategory !== "all" ||
                selectedDifficulty !== "all"
                  ? "Try adjusting your search criteria"
                  : "No tests are currently available"}
              </p>
              {(searchTerm ||
                selectedCategory !== "all" ||
                selectedDifficulty !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <Card
                key={test.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      {formatCategory(test.category)}
                    </Badge>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {test.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{test.duration || "Not specified"}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-green-500" />
                        <span>{test.questions || "Various"}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full transition-colors disabled:bg-gray-400"
                      onClick={() =>
                        handleStartTest(test.google_form_url, test.title)
                      }
                      disabled={!test.google_form_url || !user || !isUserVerified}
                      variant={isUserVerified ? "default" : "secondary"}
                    >
                      {!user ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Login Required
                        </>
                      ) : !isUserVerified ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Verification Pending
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Start Test
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Instructions Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Test Instructions
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Before Starting
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Ensure stable internet connection
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Use a desktop or laptop for better experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Keep a pen and paper for rough work
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Choose a quiet environment
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Do not refresh the page during test
                  </li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  During the Test
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Read questions carefully
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Manage your time effectively
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Review answers before submission
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Use elimination method for MCQs
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Don't spend too much time on one question
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Study Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Enhance your preparation with our comprehensive study materials
            alongside these mock tests
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link to="/materials">Browse Study Materials</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tests;
