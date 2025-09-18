
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
import {
  BookOpen,
  FileText,
  ShoppingCart,
  User,
  Clock,
  CheckCircle,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VerificationStatus from "@/components/VerificationStatus";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: orders = [] } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            materials (title, image_url)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your dashboard
          </h1>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      shipped: { color: "bg-purple-100 text-purple-800", icon: CheckCircle },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: FileText },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {profile?.full_name || user.email}!
          </h1>
          <p className="text-blue-100">
            Manage your account, orders, and access your study materials
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verification Status */}
            <VerificationStatus />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access your favorite features quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-auto p-6 flex-col space-y-2">
                    <Link to="/materials">
                      <BookOpen className="h-8 w-8" />
                      <span>Browse Materials</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-2">
                    <Link to="/tests">
                      <Play className="h-8 w-8" />
                      <span>Take Tests</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-2">
                    <Link to="/orders">
                      <ShoppingCart className="h-8 w-8" />
                      <span>View Orders</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-2">
                    <Link to="/profile">
                      <User className="h-8 w-8" />
                      <span>Edit Profile</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Your latest material purchases
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Button asChild>
                      <Link to="/materials">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {(order as any)?.order_items && (order as any)?.order_items[0]?.materials?.image_url ? (
                              <img
                                src={(order as any).order_items[0].materials.image_url}
                                alt="Material"
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.order_items?.length || 0} item(s) • ₹
                              {order.total_amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(order.status)}
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/orders`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900">
                      {profile?.full_name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{profile?.email || user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-900">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Account Status
                    </label>
                    <div className="mt-1">
                      {profile?.verification_status === 'approved' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : profile?.verification_status === 'rejected' ? (
                        <Badge className="bg-red-100 text-red-800">
                          Rejected
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Since</span>
                    <span className="font-semibold">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
