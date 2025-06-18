
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const totalAmount = cartItems.reduce((total, item) => 
    total + (item.materials.price * item.quantity), 0
  );

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };

  const handlePayment = async () => {
    if (!user || cartItems.length === 0) return;
    
    if (!shippingAddress.trim()) {
      toast.error("Please enter shipping address");
      return;
    }

    setLoading(true);

    try {
      // Create order in database first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          phone: phone,
          notes: notes,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        material_id: item.material_id,
        quantity: item.quantity,
        price: item.materials.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // For now, we'll simulate a successful payment
      // In production, you would integrate with a real payment gateway
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          notes: `${notes}\nPayment Method: Demo Payment (Replace with actual payment gateway)`
        })
        .eq('id', order.id);

      if (!updateError) {
        await clearCart();
        toast.success("Order placed successfully! This is a demo - no actual payment was processed.");
      }

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your cart.</p>
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
      
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl text-blue-100">
            Review your selected study materials
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="container mx-auto px-4 py-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8">Add some study materials to get started</p>
            <Button asChild>
              <Link to="/materials">Browse Materials</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.materials.title}</h3>
                        <p className="text-gray-600">{item.materials.category.replace('_', ' ')}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">₹{item.materials.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium mb-1">Shipping Address *</label>
                      <Textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Special Notes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                    </p>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    disabled={loading || !shippingAddress.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : `Place Order ₹${totalAmount}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
