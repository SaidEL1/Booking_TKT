import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')

// Simple in-memory IP rate limiter
const ipHits = new Map()
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const MAX_REQUESTS = 30 // per window per IP

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

export async function GET(request) {
    try {
        if (isRateLimited(request)) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
        }

        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('session_id')
        const bookingId = searchParams.get('bookingId')

        if (!sessionId || !bookingId) {
            return NextResponse.json({ error: 'Missing required query: session_id and bookingId' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        const paid = session.payment_status === 'paid' || session.status === 'complete'
        const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : null
        const paymentIntentId = session.payment_intent || null

        // Update booking if paid
        let updated = null
        if (paid) {
            const bookings = readBookings()
            const idx = bookings.findIndex(b => b.id === bookingId)
            if (idx !== -1) {
                bookings[idx] = {
                    ...bookings[idx],
                    paid: true,
                    paymentMethod: 'stripe',
                    paymentStatus: 'completed',
                    paymentAmount: amountTotal != null ? amountTotal / 100 : undefined,
                    paymentId: paymentIntentId,
                    paymentDate: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                if (writeBookings(bookings)) {
                    updated = bookings[idx]
                }
            }
        }

        return NextResponse.json({
            success: true,
            paid,
            amount: amountTotal != null ? amountTotal / 100 : null,
            paymentIntentId,
            booking: updated
        })
    } catch (error) {
        console.error('Stripe session verify error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
