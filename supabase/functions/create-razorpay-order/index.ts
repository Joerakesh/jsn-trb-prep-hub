
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, currency, receipt } = await req.json()

    console.log('Creating Razorpay order:', { amount, currency, receipt })

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keyId || !keySecret) {
      console.error('Razorpay credentials not configured')
      throw new Error('Razorpay credentials not configured')
    }

    const auth = btoa(`${keyId}:${keySecret}`)

    const orderData = {
      amount: parseInt(amount),
      currency: currency || 'INR',
      receipt: receipt,
      payment_capture: 1
    }

    console.log('Sending order data to Razorpay:', orderData)

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const responseText = await response.text()
    console.log('Razorpay response:', responseText)

    if (!response.ok) {
      let errorMessage = 'Failed to create order'
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error?.description || errorMessage
      } catch (e) {
        errorMessage = responseText || errorMessage
      }
      throw new Error(errorMessage)
    }

    const order = JSON.parse(responseText)
    console.log('Order created successfully:', order)

    return new Response(
      JSON.stringify({ success: true, order }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create order'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
