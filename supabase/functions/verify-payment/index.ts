
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { payment_id, order_id, signature } = await req.json()
    
    console.log('Verifying payment:', { payment_id, order_id, signature })

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!keySecret) {
      console.error('Razorpay secret not configured')
      throw new Error('Razorpay secret not configured')
    }

    // Create expected signature using HMAC-SHA256
    const message = `${order_id}|${payment_id}`
    const encoder = new TextEncoder()
    const messageData = encoder.encode(message)
    const keyData = encoder.encode(keySecret)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const isValidSignature = expectedSignature === signature

    console.log('Signature verification:', {
      message,
      expected: expectedSignature,
      received: signature,
      isValid: isValidSignature
    })

    // Update payment record in database if signature is valid
    if (isValidSignature) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error: updateError } = await supabase
        .from('payments')
        .update({
          razorpay_payment_id: payment_id,
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', order_id)

      if (updateError) {
        console.error('Failed to update payment record:', updateError)
      } else {
        console.log('Payment record updated successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: isValidSignature,
        message: isValidSignature ? 'Payment verified successfully' : 'Invalid signature'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment verification failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
