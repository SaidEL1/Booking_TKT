import { NextResponse } from 'next/server'

// Debug: Check if Stripe key is loaded properly
console.log(' Stripe Debug Info:')
console.log('- Key exists:', !!process.env.STRIPE_SECRET_KEY)
console.log('- Key length:', process.env.STRIPE_SECRET_KEY?.length)
console.log('- Key starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 25))
console.log('- Key ends with:', process.env.STRIPE_SECRET_KEY?.substring(-10))

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { bookingId, amount, currency = 'usd', locale = 'en', successUrl, cancelUrl } = await request.json()

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Ticket Booking',
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: bookingId,
        locale: locale,
      },
      locale: locale === 'ar' ? 'auto' : locale, // Stripe doesn't support Arabic directly
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          bookingId: bookingId,
        },
      },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (error) {
    console.error('❌ Stripe session creation error:', error)
    
    // Check if it's a Stripe authentication error
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Stripe API key is invalid or expired')
      return NextResponse.json(
        { error: 'Invalid Stripe configuration. Please check your API keys.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
