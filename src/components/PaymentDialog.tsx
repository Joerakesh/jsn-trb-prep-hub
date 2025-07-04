
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin, Mail, CreditCard } from "lucide-react";
import { ShippingDetails } from "@/contexts/PaymentContext";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: {
    id: string;
    title: string;
    price: number;
  };
  onPayment: (shippingDetails: ShippingDetails) => void;
  isProcessing: boolean;
}

const PaymentDialog = ({ open, onOpenChange, material, onPayment, isProcessing }: PaymentDialogProps) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState<Partial<ShippingDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<ShippingDetails> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPayment(formData);
    }
  };

  const handleInputChange = (field: keyof ShippingDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Please provide your details to purchase "{material.title}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={`pl-10 transition-all duration-200 ${errors.fullName ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 animate-fade-in">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={`pl-10 transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 animate-fade-in">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className={`pl-10 transition-all duration-200 ${errors.phone ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 animate-fade-in">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your full address"
                className={`pl-10 min-h-[70px] transition-all duration-200 ${errors.address ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
            </div>
            {errors.address && <p className="text-xs text-red-500 animate-fade-in">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className={`transition-all duration-200 ${errors.city ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
              {errors.city && <p className="text-xs text-red-500 animate-fade-in">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
                className={`transition-all duration-200 ${errors.state ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
              />
              {errors.state && <p className="text-xs text-red-500 animate-fade-in">{errors.state}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-sm font-medium">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              className={`transition-all duration-200 ${errors.pincode ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
            />
            {errors.pincode && <p className="text-xs text-red-500 animate-fade-in">{errors.pincode}</p>}
          </div>

          <div className="pt-4 border-t bg-gray-50 -mx-6 px-6 pb-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{material.price}</span>
            </div>
            
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </div>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full text-sm hover:bg-gray-50 transition-all duration-200"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
