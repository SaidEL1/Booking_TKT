import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')

function readBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      return []
    }
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

function writeBookings(bookings) {
  try {
    const dataDir = path.dirname(BOOKINGS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
    return true
  } catch (error) {
    console.error('Error writing bookings:', error)
    return false
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const paymentData = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const bookings = readBookings()
    const bookingIndex = bookings.findIndex(booking => booking.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update booking with payment information
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      paymentMethod: paymentData.paymentMethod,
      paymentId: paymentData.paymentId,
      paymentStatus: paymentData.paymentStatus,
      paymentAmount: paymentData.amount,
      paymentDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const success = writeBookings(bookings)

    if (!success) {
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Payment status updated successfully',
      booking: bookings[bookingIndex]
    })

  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
