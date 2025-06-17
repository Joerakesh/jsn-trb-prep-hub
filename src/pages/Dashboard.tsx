
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingCart, FileText, Award, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: recentOrders = [] } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            materials (title, price)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'Student'}!
          </h1>
          <p className="text-blue-100">
            Track your learning progress and manage your study materials
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Study Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/materials">Browse Materials</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Download className="h-5 w-5 mr-2 text-green-600" />
                Free Samples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/samples">Download Samples</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Online Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/tests">Take Tests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your latest material orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Button asChild size="sm">
                    <Link to="/materials">Browse Materials</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {order.order_items?.length} items • ₹{order.total_amount}
                        </p>
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/orders">View All Orders</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{profile?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
