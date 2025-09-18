import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

async function getPayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    if (!clientId || !clientSecret) {
        throw new Error('PayPal server credentials not configured')
    }
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to get PayPal token: ${res.status} ${text}`)
    }
    const data = await res.json()
    return data.access_token
}

async function getPayPalOrder(orderId, accessToken) {
    const res = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to fetch PayPal order: ${res.status} ${text}`)
    }
    return res.json()
}

export async function POST(req) {
    try {
        if (isRateLimited(req)) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
        }

        const { orderId, bookingId } = await req.json()
        if (!orderId || !bookingId) {
            return NextResponse.json({ error: 'Missing required fields: orderId, bookingId' }, { status: 400 })
        }

        // Load booking and compute expected amount in EUR
        const bookings = readBookings()
        const idx = bookings.findIndex((b) => b.id === bookingId)
        if (idx === -1) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        const booking = bookings[idx]
        const tickets = Number(booking.tickets || 0)
        const expectedAmount = (tickets * 50 + 5).toFixed(2)

        // Verify PayPal order
        const accessToken = await getPayPalAccessToken()
        const order = await getPayPalOrder(orderId, accessToken)

        if (order.status !== 'COMPLETED') {
            return NextResponse.json({ error: 'Order not completed', status: order.status }, { status: 400 })
        }

        const pu = order.purchase_units?.[0]
        const amountVal = pu?.amount?.value
        const currency = pu?.amount?.currency_code

        if (currency !== 'EUR') {
            return NextResponse.json({ error: 'Invalid currency', currency }, { status: 400 })
        }

        if (amountVal !== expectedAmount) {
            return NextResponse.json({ error: 'Amount mismatch', expected: expectedAmount, got: amountVal }, { status: 400 })
        }

        // Update booking as paid
        bookings[idx] = {
            ...booking,
            paid: true,
            paymentMethod: 'paypal',
            paymentStatus: 'completed',
            paymentAmount: Number(expectedAmount),
            paymentId: order.id,
            paymentDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        writeBookings(bookings)

        return NextResponse.json({ success: true, booking: bookings[idx] })
    } catch (err) {
        console.error('PayPal verify error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
