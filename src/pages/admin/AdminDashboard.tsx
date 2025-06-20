
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Users, Package, ShoppingCart, TrendingUp, FileText, BookOpen, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats...');
      
      const [materialsResult, samplesResult, ordersResult, usersResult, testsResult] = await Promise.all([
        supabase.from('materials').select('count', { count: 'exact' }),
        supabase.from('sample_materials').select('count', { count: 'exact' }),
        supabase.from('orders').select('count, total_amount', { count: 'exact' }),
        supabase.from('profiles').select('count', { count: 'exact' }),
        supabase.from('tests').select('count', { count: 'exact' })
      ]);

      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        materials: materialsResult.count || 0,
        samples: samplesResult.count || 0,
        orders: ordersResult.count || 0,
        users: usersResult.count || 0,
        tests: testsResult.count || 0,
        revenue: totalRevenue
      };
    },
    enabled: isAdmin && !loading
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ['admin_recent_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin && !loading
  });

  const { data: recentMaterials = [] } = useQuery({
    queryKey: ['admin_recent_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin && !loading
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access the admin panel.</p>
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">Manage your JSN Academy platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats?.revenue || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Materials</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.materials || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Study materials</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Samples</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.samples || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Sample materials</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.orders || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Total orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Users</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.users || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tests</CardTitle>
              <BookOpen className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.tests || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Online tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Study Materials</CardTitle>
              <CardDescription>Manage study materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/admin/materials">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Materials
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/admin/materials/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Material
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Sample Materials</CardTitle>
              <CardDescription>Manage free samples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/admin/samples">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Samples
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/admin/samples/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Sample
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
              <CardDescription>View and manage orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/admin/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Manage Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/admin/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Online Tests</CardTitle>
              <CardDescription>Manage tests and quizzes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/admin/tests">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Tests
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/admin/tests/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent orders</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.profiles?.full_name}</p>
                            <p className="text-sm text-gray-500">{order.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>₹{order.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/orders/${order.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Materials */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Materials</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/materials">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentMaterials.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No materials found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-sm text-gray-500">{material.pages} pages</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {material.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{material.price}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
