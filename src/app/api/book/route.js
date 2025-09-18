import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json')
const QR_CODES_DIR = path.join(process.cwd(), 'public', 'qrcodes')

// Ensure directories exist
function ensureDirectories() {
  const dataDir = path.dirname(BOOKINGS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(QR_CODES_DIR)) {
    fs.mkdirSync(QR_CODES_DIR, { recursive: true })
  }
}

// Read existing bookings
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

// Write bookings to file
function writeBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
  } catch (error) {
    console.error('Error writing bookings:', error)
    throw error
  }
}

// Generate QR code
async function generateQRCode(bookingId, bookingData) {
  try {
    const qrData = JSON.stringify({
      id: bookingId,
      name: bookingData.name,
      destination: bookingData.destination,
      departureDate: bookingData.departureDate,
      returnDate: bookingData.returnDate,
      tripType: bookingData.tripType,
      adults: bookingData.adults,
      seniors: bookingData.seniors,
      children: bookingData.children,
      infants: bookingData.infants,
      tickets: bookingData.tickets,
      hasPets: bookingData.hasPets,
      petType: bookingData.petType,
      vehicleType: bookingData.vehicleType,
      email: bookingData.email,
      paid: bookingData.paid,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentStatus,
      locale: bookingData.locale,
      createdAt: bookingData.createdAt
    })

    const qrCodePath = path.join(QR_CODES_DIR, `${bookingId}.png`)
    await QRCode.toFile(qrCodePath, qrData)
    return `/qrcodes/${bookingId}.png`
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

// Send confirmation email
async function sendConfirmationEmail(booking) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured')
      return
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const qrCodePath = path.join(process.cwd(), 'public', booking.qrCode)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `Booking Confirmation - ${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmation</h2>
          <p>Dear ${booking.name},</p>
          <p>Your booking has been confirmed! Here are your details:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Departure Date:</strong> ${booking.departureDate}</p>
            <p><strong>Return Date:</strong> ${booking.returnDate}</p>
            <p><strong>Trip Type:</strong> ${booking.tripType}</p>
            <p><strong>Adults:</strong> ${booking.adults}</p>
            <p><strong>Seniors:</strong> ${booking.seniors}</p>
            <p><strong>Children:</strong> ${booking.children}</p>
            <p><strong>Infants:</strong> ${booking.infants}</p>
            <p><strong>Tickets:</strong> ${booking.tickets}</p>
            <p><strong>Has Pets:</strong> ${booking.hasPets}</p>
            <p><strong>Pet Type:</strong> ${booking.petType}</p>
            <p><strong>Vehicle Type:</strong> ${booking.vehicleType}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Paid:</strong> ${booking.paid}</p>
            <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
            <p><strong>Locale:</strong> ${booking.locale}</p>
          </div>
          
          <p>Please find your QR code ticket attached to this email.</p>
          <p>Thank you for choosing our service!</p>
        </div>
      `,
      attachments: [
        {
          filename: `ticket-${booking.id}.png`,
          path: qrCodePath
        }
      ]
    }

    await transporter.sendMail(mailOptions)
    console.log('Confirmation email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
    // Don't throw error - booking should still succeed even if email fails
  }
}

export async function POST(request) {
  try {
    ensureDirectories()

    const body = await request.json()
    // Removed verbose body logging to avoid leaking PII in production

    const {
      name,
      destination,
      departureDate,
      returnDate,
      tripType,
      adults,
      seniors,
      children,
      infants,
      hasPets,
      petType,
      vehicleType,
      email,
      paid,
      paymentMethod,
      paymentStatus,
      locale
    } = body

    // Validate required fields
    if (!name || !destination || !departureDate || !email || (!adults || adults < 1)) {
      console.log('Validation failed:', { name, destination, departureDate, email, adults })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total tickets
    const totalTickets = (adults || 0) + (seniors || 0) + (children || 0) + (infants || 0)

    // Generate unique booking ID
    const bookingId = uuidv4()

    // Create booking object
    const booking = {
      id: bookingId,
      name: name.trim(),
      destination: destination.trim(),
      departureDate,
      returnDate: returnDate || null,
      tripType: tripType || 'one-way',
      adults: parseInt(adults) || 1,
      seniors: parseInt(seniors) || 0,
      children: parseInt(children) || 0,
      infants: parseInt(infants) || 0,
      tickets: totalTickets,
      hasPets: Boolean(hasPets),
      petType: petType || null,
      vehicleType: vehicleType || 'none',
      email: email.trim(),
      paid: Boolean(paid),
      paymentMethod: paymentMethod || null,
      paymentStatus: paymentStatus || 'pending',
      locale: locale || 'ar',
      createdAt: new Date().toISOString(),
      qrCode: ''
    }

    // Generate QR code
    const qrCodePath = await generateQRCode(bookingId, booking)
    booking.qrCode = qrCodePath

    // Read existing bookings and add new one
    const bookings = readBookings()
    bookings.push(booking)
    writeBookings(bookings)

    // Send confirmation email (async, don't wait)
    sendConfirmationEmail(booking).catch(console.error)

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
