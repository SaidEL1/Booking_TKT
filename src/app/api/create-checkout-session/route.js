import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Simple in-memory IP rate limiter
const ipHits = new Map()
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const MAX_REQUESTS = 20 // per window per IP

function isRateLimited(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const arr = ipHits.get(ip) || []
  const recent = arr.filter((t) => t > windowStart)
  recent.push(now)
  ipHits.set(ip, recent)
  return recent.length > MAX_REQUESTS
}

export async function POST(request) {
  try {
    if (isRateLimited(request)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const { bookingId, currency = 'eur', locale = 'en' } = body || {}

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured on server' }, { status: 500 })
    }

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing required field: bookingId' }, { status: 400 })
    }

    // Build canonical HTTPS base URL from the request host to avoid non-HTTPS callbacks in live
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'agencianasseralmeria.com'
    const protocol = 'https' // force https for live
    const baseUrl = `${protocol}://${host}`
    const successUrl = `${baseUrl}/${locale}/confirmation?id=${bookingId}&payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/${locale}/payment-confirm?id=${bookingId}&payment=cancelled`

    // Calculate amount on the server from persisted booking
    const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')
    let amountInCents = null
    let tickets = 0
    let destination = ''
    let name = ''
    let email = ''
    if (fs.existsSync(BOOKINGS_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'))
        const booking = Array.isArray(data) ? data.find(b => b.id === bookingId) : null
        if (booking) {
          name = booking.name || ''
          email = booking.email || ''
          tickets = Number(booking.tickets || 0)
          destination = booking.destination || ''
          // TODO: revert after live test
          // const ticketsTotal = tickets * 50
          // const serviceFee = 5
          // amountInCents = Math.round((ticketsTotal + serviceFee) * 100)
          const testUnitPriceEUR = 1 // charge €1 per ticket for live test
          const serviceFee = 0      // disable service fee for now
          const ticketsTotal = tickets * testUnitPriceEUR
          amountInCents = Math.round((ticketsTotal + serviceFee) * 100)
        }
      } catch (e) {
        console.error('Failed to read bookings for amount calc:', e)
      }
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing booking contact fields: name, email' }, { status: 400 })
    }

    if (!amountInCents || amountInCents <= 0) {
      return NextResponse.json({ error: 'Unable to calculate amount for booking' }, { status: 400 })
    }

    // Build a short suffix for the bank statement (max 22 chars total with account prefix)
    const shortId = bookingId.slice(0, 6).toUpperCase()
    // NOTE: Stripe combines account-level prefix with this suffix. Keep it short and ASCII only.
    const statementSuffix = `BOOK ${shortId}` // e.g., "BOOK ABC123"

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
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl, // always https
      cancel_url: cancelUrl,   // always https
      metadata: {
        bookingId: bookingId,
        locale: locale,
        destination,
        name,
        email,
      },
      locale: locale === 'ar' ? 'auto' : locale,
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          bookingId: bookingId,
        },
        // Statement descriptor (keep ASCII and within Stripe limits)
        statement_descriptor_suffix: statementSuffix,
      },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (error) {
    console.error('❌ Stripe session creation error:', error)
    if (error.type === 'StripeAuthenticationError') {
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
