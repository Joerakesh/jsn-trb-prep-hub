
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-lg">
            <CardContent className="pt-16 pb-16">
              <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-lg text-gray-600 mb-8">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <p className="text-blue-800 text-sm">
                  <strong>Requested URL:</strong> {location.pathname}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button asChild className="h-12">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-12">
                  <Link to="/materials">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Materials
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <Button asChild variant="ghost">
                  <Link to="/" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Popular Pages:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild variant="link" size="sm">
                    <Link to="/materials">Study Materials</Link>
                  </Button>
                  <Button asChild variant="link" size="sm">
                    <Link to="/tests">Online Tests</Link>
                  </Button>
                  <Button asChild variant="link" size="sm">
                    <Link to="/youtube">YouTube Videos</Link>
                  </Button>
                  <Button asChild variant="link" size="sm">
                    <Link to="/about">About Us</Link>
                  </Button>
                  <Button asChild variant="link" size="sm">
                    <Link to="/contact">Contact</Link>
                  </Button>
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

export default NotFound;
