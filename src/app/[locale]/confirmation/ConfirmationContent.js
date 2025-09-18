'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslation } from '../../../lib/translations'
import { useRouter } from 'next/navigation'

export default function ConfirmationContent({ bookingId, locale, searchParams }) {
  const router = useRouter()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  // Get payment status from URL parameters
  const paymentStatus = searchParams?.payment
  const paymentMethod = searchParams?.method
  const paymentId = searchParams?.paymentId
  const sessionId = searchParams?.session_id

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${bookingId}`)
        if (response.ok) {
          const data = await response.json()
          setBooking(data)
        } else {
          setError(t('bookingNotFound'))
        }
      } catch (err) {
        setError(t('failedToLoadBookingDetails'))
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  // If returning from Stripe with session_id, verify server-side and refresh booking
  useEffect(() => {
    const verifyStripe = async () => {
      try {
        if (sessionId && bookingId) {
          await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}&bookingId=${encodeURIComponent(bookingId)}`)
          // After verification, refresh booking details to reflect paid status
          const res = await fetch(`/api/booking/${bookingId}`)
          if (res.ok) {
            const data = await res.json()
            setBooking(data)
          }
        }
      } catch (e) {
        console.error('Stripe verification failed', e)
      }
    }
    verifyStripe()
  }, [sessionId, bookingId])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadPDF = () => {
    // For now, we'll use the browser's print functionality
    // In a real implementation, you might generate a proper PDF
    window.print()
  }

  if (loading) {
    return (
      <div className="card text-center animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded mb-8 max-w-sm mx-auto"></div>
        <div className="h-10 bg-gray-200 rounded max-w-xs mx-auto"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="card text-center animate-fade-in">
        <div className="icon-container-lg bg-red-100 mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="heading-lg mb-4 text-gray-900">{t('bookingNotFound')}</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          {error || t('bookingNotFoundDesc')}
        </p>
        <Link href={`/${locale}`} className="btn-primary">
          <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('backToHome')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      <div className="card text-center mb-8 animate-fade-in">
        <div className="icon-container-lg bg-green-100 mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="heading-xl mb-4 text-gray-900">
          {t('bookingSuccessful')}
        </h1>
        <p className="text-lg text-muted mb-6 max-w-2xl mx-auto">
          {t('bookingSuccessMessage')}
        </p>
        <div className="bg-blue-50/50 rounded-xl p-4 inline-block">
          <p className="text-sm font-medium text-blue-900 mb-1">
            {t('bookingReference')}
          </p>
          <p className="text-xl font-bold text-blue-700 font-mono">
            {booking.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2">
          <div className="card animate-slide-up">
            <h2 className="heading-lg mb-6 text-gray-900">{t('reservationDetails')}</h2>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="heading-md mb-4 text-gray-800">{t('personalInfo')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-blue-100">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('fullName')}</p>
                      <p className="font-medium text-gray-900">{booking.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-green-100">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('email')}</p>
                      <p className="font-medium text-gray-900">{booking.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="heading-md mb-4 text-gray-800">{t('tripDetails')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-purple-100">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('destination')}</p>
                      <p className="font-medium text-gray-900">{booking.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-orange-100">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('travelDate')}</p>
                      <p className="font-medium text-gray-900">{formatDate(booking.departureDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-red-100">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('numberOfTickets')}</p>
                      <p className="font-medium text-gray-900">{booking.tickets}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="icon-container bg-green-100">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted">{t('paymentStatus')}</p>
                      <p className={`font-medium ${booking.paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {booking.paid ? t('paid') : t('pending')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="lg:col-span-1">
          <div className="card text-center sticky top-8 animate-scale-in">
            <h2 className="heading-md mb-6 text-gray-900">{t('yourTicket')}</h2>

            <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 inline-block mb-6 shadow-inner">
              <Image
                src={booking.qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto rounded-lg"
              />
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted leading-relaxed">
                {t('qrCodeInstructions')}
              </p>

              <div className="bg-blue-50/50 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="icon-container bg-blue-100">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-900">{t('importantNote')}</span>
                </div>
                <p className="text-xs text-blue-800">
                  {t('savePageOffline')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
        <button
          onClick={downloadPDF}
          className="btn-primary w-full sm:w-auto"
        >
          <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('downloadTicketPDF')}
        </button>

        <Link
          href={`/${locale}/ticket/${booking.id}`}
          className="btn-secondary w-full sm:w-auto"
        >
          <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          {t('viewFullTicket')}
        </Link>

        <Link
          href={`/${locale}`}
          className="btn-ghost w-full sm:w-auto"
        >
          <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('returnToHome')}
        </Link>
      </div>
    </div>
  )
}
