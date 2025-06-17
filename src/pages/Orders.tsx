
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Orders = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            materials (title, price, category)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading your orders...</div>
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
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">My Orders</h1>
          <p className="text-xl text-blue-100">
            Track your study material orders and delivery status
          </p>
        </div>
      </section>

      {/* Orders List */}
      <section className="container mx-auto px-4 py-16">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8">Start shopping for study materials to see your orders here</p>
            <Button asChild>
              <Link to="/materials">Browse Materials</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleDateString()} • 
                        Total: ₹{order.total_amount}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Items Ordered:</h4>
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.materials?.title}</p>
                          <p className="text-sm text-gray-600">
                            Category: {item.materials?.category?.replace('_', ' ')} • 
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                    
                    {order.shipping_address && (
                      <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <h5 className="font-medium text-blue-900">Shipping Address:</h5>
                        <p className="text-blue-800">{order.shipping_address}</p>
                        {order.phone && (
                          <p className="text-blue-800">Phone: {order.phone}</p>
                        )}
                      </div>
                    )}

                    {order.notes && (
                      <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <h5 className="font-medium text-yellow-900">Notes:</h5>
                        <p className="text-yellow-800">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Orders;
