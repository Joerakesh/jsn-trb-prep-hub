
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

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

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!keySecret) {
      throw new Error('Razorpay secret not configured')
    }

    // Create expected signature
    const expectedSignature = await createHmac("sha256", new TextEncoder().encode(keySecret))
      .update(new TextEncoder().encode(`${order_id}|${payment_id}`))
      .digest("hex")

    const isValidSignature = expectedSignature === signature

    return new Response(
      JSON.stringify({ success: isValidSignature }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
