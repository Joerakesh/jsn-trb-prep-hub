import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users, ExternalLink, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

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

const Tests = () => {
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Test[];
    }
  });

  const handleStartTest = (testUrl: string, testTitle: string) => {
    window.open(testUrl, '_blank');
    console.log(`Starting test: ${testTitle}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
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
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Online Mock Tests</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Practice with our comprehensive mock tests designed to simulate real TRB exam conditions
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Timed Practice</h3>
              <p className="text-sm text-gray-600">Real exam timing simulation</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Get immediate feedback</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Performance Tracking</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Play className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Free Access</h3>
              <p className="text-sm text-gray-600">No cost, unlimited attempts</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mock Tests Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Mock Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{formatCategory(test.category)}</Badge>
                  <Badge className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.duration}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {test.questions}
                    </div>
                    <div className="flex items-center col-span-2">
                      <Users className="h-4 w-4 mr-1" />
                      {test.participants_count.toLocaleString()}+ participants
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStartTest(test.google_form_url, test.title)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructions Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Test Instructions</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Before Starting</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ensure stable internet connection</li>
                  <li>• Use a desktop or laptop for better experience</li>
                  <li>• Keep a pen and paper for rough work</li>
                  <li>• Choose a quiet environment</li>
                  <li>• Do not refresh the page during test</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">During the Test</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Read questions carefully</li>
                  <li>• Manage your time effectively</li>
                  <li>• Review answers before submission</li>
                  <li>• Use elimination method for MCQs</li>
                  <li>• Don't spend too much time on one question</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Study Materials?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Enhance your preparation with our comprehensive study materials alongside these mock tests
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/materials">Browse Study Materials</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tests;
