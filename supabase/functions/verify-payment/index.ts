
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
      throw new Error('Razorpay secret not configured')
    }

    // Create expected signature using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(`${order_id}|${payment_id}`)
    const key = encoder.encode(keySecret)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const isValidSignature = expectedSignature === signature

    console.log('Signature verification result:', {
      expected: expectedSignature,
      received: signature,
      isValid: isValidSignature
    })

    return new Response(
      JSON.stringify({ success: isValidSignature }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
