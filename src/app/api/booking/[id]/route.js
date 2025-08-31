import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')

// Read bookings from file
function readBookings() {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

// Find booking by ID
function findBookingById(id) {
  const bookings = readBookings()
  return bookings.find(booking => booking.id === id)
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const booking = findBookingById(id)
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
