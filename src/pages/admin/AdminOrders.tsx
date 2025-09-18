import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Package,
  Users,
  DollarSign,
  CalendarDays,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RefreshCw,
  User,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = string;

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shipping_address: string | null;
  phone: string | null;
  notes: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    materials: {
      title: string;
      category: string;
      format: string | null;
      pages: number | null;
    };
  }>;
}

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  console.log("Fetched users:", Users.length);

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log("Fetching orders with details...");
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          profiles!orders_user_id_fkey (
            full_name,
            email
          ),
          order_items (
            id,
            quantity,
            price,
            materials (
              title,
              category,
              format,
              pages
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      console.log("Orders fetched:", data);
      return data as any;
    },
    enabled: isAdmin,
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      const { error } = await supabase
        .from("orders")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_items.some((item) =>
        item.materials.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  console.log("Filtered users:", filteredOrders.length);
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0),
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus as OrderStatus });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  // Remove this line
  console.log("Fetched users:", Users.length);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
            <p className="text-green-100">
              Comprehensive order tracking and customer management
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isLoading}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    ₹{stats.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order ID, customer name, email, or material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredOrders.length} of {orders.length} orders
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Orders ({filteredOrders.length})</span>
            </CardTitle>
            <CardDescription>
              Detailed view of all customer orders with comprehensive
              information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "No orders have been placed yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Order ID</TableHead>
                      <TableHead className="w-48">Customer Details</TableHead>
                      <TableHead className="w-64">Materials Ordered</TableHead>
                      <TableHead className="w-24">Amount</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-32">Order Date</TableHead>
                      <TableHead className="text-right w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-mono text-sm">
                            <p className="font-medium">
                              #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.created_at), "HH:mm")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-900">
                                {order.profiles?.full_name || "Anonymous User"}
                              </span>
                            </div>
                            {order.profiles?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {order.profiles.email}
                                </span>
                              </div>
                            )}
                            {order.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {order.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {order.order_items &&
                            order.order_items.length > 0 ? (
                              order.order_items.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm text-blue-900">
                                        {item.materials.title}
                                      </p>
                                      <div className="flex gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                                        <span className="bg-blue-100 px-2 py-1 rounded-full">
                                          {item.materials.category.replace(
                                            "_",
                                            " "
                                          )}
                                        </span>
                                        {item.materials.format && (
                                          <span className="bg-green-100 px-2 py-1 rounded-full">
                                            {item.materials.format}
                                          </span>
                                        )}
                                        {item.materials.pages && (
                                          <span className="bg-purple-100 px-2 py-1 rounded-full">
                                            {item.materials.pages} pages
                                          </span>
                                        )}
                                        <span className="bg-orange-100 px-2 py-1 rounded-full">
                                          Qty: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right ml-2">
                                      <p className="font-semibold text-green-600 text-sm">
                                        ₹
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString()}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        ₹{item.price}/item
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                <p className="text-red-700 text-sm">
                                  No items found for this order
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-bold text-lg text-green-600">
                              ₹{Number(order.total_amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.order_items?.length || 0} item
                              {(order.order_items?.length || 0) !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} flex items-center gap-1`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 font-medium">
                              <CalendarDays className="h-3 w-3" />
                              {format(new Date(order.created_at), "MMM dd")}
                            </div>
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.created_at), "yyyy")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                              className="hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Order Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Order Details - #{selectedOrder?.id.slice(0, 8)}
              </DialogTitle>
              <DialogDescription>
                Complete order information and customer details
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Information Card */}
                <Card className="border-l-4 border-blue-500">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Full Name
                          </label>
                          <p className="font-semibold text-lg">
                            {selectedOrder.profiles?.full_name ||
                              "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email Address
                          </label>
                          <p className="font-medium">
                            {selectedOrder.profiles?.email || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone Number
                          </label>
                          <p className="font-medium">
                            {selectedOrder.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            Order Date & Time
                          </label>
                          <p className="font-medium">
                            {format(
                              new Date(selectedOrder.created_at),
                              "MMM dd, yyyy HH:mm:ss"
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Order Status
                          </label>
                          <Badge
                            className={`${getStatusColor(
                              selectedOrder.status
                            )} mt-1`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(selectedOrder.status)}
                              <span className="capitalize">
                                {selectedOrder.status}
                              </span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.shipping_address && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <label className="text-sm font-medium text-blue-900 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </label>
                        <p className="font-medium text-blue-800 mt-1">
                          {selectedOrder.shipping_address}
                        </p>
                      </div>
                    )}

                    {selectedOrder.notes && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <label className="text-sm font-medium text-yellow-900">
                          Special Notes
                        </label>
                        <p className="font-medium text-yellow-800 mt-1">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items Card */}
                <Card className="border-l-4 border-green-500">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Materials Ordered (
                      {selectedOrder.order_items?.length || 0} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {selectedOrder.order_items &&
                      selectedOrder.order_items.length > 0 ? (
                        selectedOrder.order_items.map((item, index) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg text-blue-900">
                                  {item.materials.title}
                                </h4>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Category:{" "}
                                    {item.materials.category.replace("_", " ")}
                                  </span>
                                  {item.materials.format && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      Format: {item.materials.format}
                                    </span>
                                  )}
                                  {item.materials.pages && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Pages: {item.materials.pages}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Quantity: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-sm text-gray-600">
                                  Unit Price: ₹
                                  {Number(item.price).toLocaleString()}
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                  Total: ₹
                                  {(
                                    Number(item.price) * item.quantity
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            No materials found for this order
                          </p>
                        </div>
                      )}

                      <div className="border-t-2 border-gray-200 pt-4 mt-6">
                        <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                          <div>
                            <p className="text-lg font-semibold text-green-900">
                              Total Order Amount
                            </p>
                            <p className="text-sm text-green-700">
                              {selectedOrder.order_items?.length || 0} item
                              {(selectedOrder.order_items?.length || 0) !== 1
                                ? "s"
                                : ""}{" "}
                              ordered
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              ₹
                              {Number(
                                selectedOrder.total_amount
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
};
export default AdminOrders;
