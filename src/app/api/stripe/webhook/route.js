import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Stripe from 'stripe'

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')

function readBookings() {
    try {
        if (!fs.existsSync(BOOKINGS_FILE)) return []
        const data = fs.readFileSync(BOOKINGS_FILE, 'utf8')
        return JSON.parse(data)
    } catch (e) {
        console.error('Error reading bookings:', e)
        return []
    }
}

function writeBookings(bookings) {
    try {
        const dir = path.dirname(BOOKINGS_FILE)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
        return true
    } catch (e) {
        console.error('Error writing bookings:', e)
        return false
    }
}

export async function POST(req) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secretKey || !endpointSecret) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(secretKey)

    let event
    try {
        const rawBody = await req.text()
        const sig = req.headers.get('stripe-signature')
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object
                const bookingId = session.metadata?.bookingId
                const amountTotal = session.amount_total
                const paymentIntentId = session.payment_intent

                if (bookingId) {
                    const bookings = readBookings()
                    const idx = bookings.findIndex(b => b.id === bookingId)
                    if (idx !== -1) {
                        bookings[idx] = {
                            ...bookings[idx],
                            paid: true,
                            paymentMethod: 'stripe',
                            paymentStatus: 'completed',
                            paymentAmount: typeof amountTotal === 'number' ? amountTotal / 100 : bookings[idx].paymentAmount,
                            paymentId: paymentIntentId,
                            paymentDate: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }
                        writeBookings(bookings)
                    }
                }
                break
            }
            default:
                break
        }

        return NextResponse.json({ received: true })
    } catch (e) {
        console.error('Webhook handling error:', e)
        return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 })
    }
}
