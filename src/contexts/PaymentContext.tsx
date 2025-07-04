
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RAZORPAY_CONFIG } from '@/lib/constants';

interface PaymentContextType {
  createPayment: (materialId: string, amount: number, shippingDetails: ShippingDetails) => Promise<void>;
  loading: boolean;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createPayment = async (materialId: string, amount: number, shippingDetails: ShippingDetails) => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating payment for material:', materialId, 'amount:', amount);
      
      // Create Razorpay order using Supabase Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: Math.round(amount * 100), // Convert to paisa and ensure integer
          currency: 'INR',
          receipt: `material_${materialId}_${Date.now()}`
        }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(orderError.message || 'Failed to create payment order');
      }

      if (!orderData?.success || !orderData?.order) {
        console.error('Invalid order response:', orderData);
        throw new Error('Failed to create payment order');
      }

      console.log('Order created successfully:', orderData.order);

      // Store payment record in database with shipping details
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          material_id: materialId,
          razorpay_order_id: orderData.order.id,
          amount: amount,
          currency: 'INR',
          status: 'created'
        });

      if (paymentError) {
        console.error('Error storing payment:', paymentError);
        throw paymentError;
      }

      // Store shipping details in orders table
      const { error: orderInsertError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: amount,
          shipping_address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}`,
          phone: shippingDetails.phone,
          status: 'pending'
        });

      if (orderInsertError) {
        console.error('Error storing order:', orderInsertError);
      }

      // Check if Razorpay is loaded
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Initialize Razorpay
      const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'JSN English Academy',
        description: 'Purchase educational material',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log('Payment response:', response);
          
          try {
            // Verify payment using Supabase Edge Function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }
            });

            if (verifyError) {
              console.error('Error verifying payment:', verifyError);
              toast.error('Payment verification failed. Please contact support.');
              return;
            }

            console.log('Payment verification response:', verifyData);

            if (verifyData?.success) {
              toast.success('🎉 Payment successful! You can now download the material.');
              
              // Reload the page to update the purchase status
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled. You can try again anytime.');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const value = {
    createPayment,
    loading
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
