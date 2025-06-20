
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Truck, MapPin } from "lucide-react";
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

  const deliveryCharge = totalAmount > 500 ? 0 : 50; // Free delivery above ₹500
  const finalAmount = totalAmount + deliveryCharge;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    
    if (!shippingAddress.trim()) {
      toast.error("Please enter your complete shipping address");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number for delivery coordination");
      return;
    }

    setLoading(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: finalAmount,
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

      // Update order status to confirmed (simulating payment success)
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          notes: `${notes}\n\nDelivery Instructions: Hard copy materials to be delivered via courier\nDelivery Charge: ₹${deliveryCharge}\nEstimated Delivery: 3-5 business days`
        })
        .eq('id', order.id);

      if (!updateError) {
        await clearCart();
        toast.success("Order placed successfully! Your study materials will be delivered via courier within 3-5 business days.");
      }

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error("Failed to place order. Please try again.");
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
          <p className="text-gray-600 mb-8">You need to be logged in to view your cart and place orders.</p>
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl text-blue-100">
            Review your selected study materials for hard copy delivery
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="container mx-auto px-4 py-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8">Browse our sample materials and order the full versions</p>
            <Button asChild>
              <Link to="/samples">Browse Sample Materials</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex items-center gap-2 text-blue-800">
                  <Truck className="h-5 w-5" />
                  <span className="font-semibold">Hard Copy Delivery</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  All materials will be printed and delivered to your address via courier within 3-5 business days
                </p>
              </div>

              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.materials.title}</h3>
                        <p className="text-gray-600">{item.materials.category.replace('_', ' ')}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-2xl font-bold text-blue-600">₹{item.materials.price}</p>
                          <span className="text-sm text-gray-500">per copy</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
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
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Charge:</span>
                      <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                    </div>
                    {totalAmount <= 500 && (
                      <p className="text-xs text-green-600">Add ₹{500 - totalAmount} more for free delivery!</p>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{finalAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium mb-1">Complete Shipping Address *</label>
                      <Textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter your complete address with house number, street, area, city, state, and pincode"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number for delivery coordination"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Special Instructions</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special delivery instructions or preferences"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-1">Delivery Information:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Estimated delivery: 3-5 business days</li>
                      <li>• High-quality printed materials</li>
                      <li>• Courier tracking will be provided</li>
                      <li>• Cash on Delivery available</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading || !shippingAddress.trim() || !phone.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : `Place Order ₹${finalAmount}`}
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
