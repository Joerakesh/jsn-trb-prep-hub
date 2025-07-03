
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentContextType {
  createPayment: (materialId: string, amount: number) => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = React.useState(false);

  const createPayment = async (materialId: string, amount: number) => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paisa
          currency: 'INR',
          receipt: `material_${materialId}_${Date.now()}`
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create payment order');
      }

      // Store payment record in database
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

      if (paymentError) throw paymentError;

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_your_key_here', // Replace with your Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'TRB Materials',
        description: 'Purchase educational material',
        order_id: orderData.order.id,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Update payment status
            await supabase
              .from('payments')
              .update({
                razorpay_payment_id: response.razorpay_payment_id,
                status: 'paid'
              })
              .eq('razorpay_order_id', response.razorpay_order_id);

            toast.success('Payment successful! You can now download the material.');
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    } finally {
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
