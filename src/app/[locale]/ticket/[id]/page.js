'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslation } from '../../../../lib/translations'

export default function TicketPage({ params }) {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState('ar')
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params
      setLocale(resolvedParams.locale || 'ar')
      setBookingId(resolvedParams.id)

      // Fetch booking data from API
      if (resolvedParams.id) {
        try {
          const response = await fetch(`/api/booking/${resolvedParams.id}`)
          if (response.ok) {
            const data = await response.json()
            setBooking(data)
          }
        } catch (error) {
          console.error('Error fetching booking:', error)
        }
      }
      setLoading(false)
    }

    initializePage()
  }, [params])

  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('invalidBooking')}</h1>
            <p className="text-gray-600 mb-8 text-lg">{t('noBookingId')}</p>
            <Link href={`/${locale}`} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <Link href={`/${locale}`} className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Image
                  src="/images/logo1.png"
                  alt={t('logoAlt')}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">{t('brandName')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('bookingSuccessful')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('bookingSuccessMessage')}
          </p>
        </div>

        {/* Booking Reference - Prominent Display */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-10 text-center">
          <p className="text-blue-100 text-lg mb-2">{t('bookingReference')}</p>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-wider font-mono">
              {booking.id}
            </span>
            <button
              onClick={() => copyToClipboard(booking.id)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              title={t('copyReference')}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Grid - 2 Columns */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Booking Details Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('reservationDetails')}</h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('customerName')}</span>
                <span className="text-lg font-semibold text-gray-900">{booking.name}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('destination')}</span>
                <span className="text-lg font-semibold text-gray-900">{booking.destination}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('travelDate')}</span>
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(booking.departureDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('numberOfTickets')}</span>
                <span className="text-lg font-semibold text-gray-900">{booking.tickets}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-600">{t('email')}</span>
                <span className="text-lg font-semibold text-gray-900">{booking.email}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-medium text-gray-600">{t('bookingDate')}</span>
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale)}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('yourTicket')}</h2>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-xl shadow-inner mb-6 inline-block">
                <Image
                  src={`/qrcodes/${booking.id}.png`}
                  alt={t('qrCode')}
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-blue-800 font-medium leading-relaxed">
                  {t('qrCodeInstructions')}
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">{t('importantNote')}</h3>
                    <p className="text-amber-700 leading-relaxed">{t('savePageOffline')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
            <svg className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('downloadTicketPDF')}
          </button>

          <Link href={`/${locale}`} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
            <svg className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('returnToHome')}
          </Link>
        </div>
      </main>
    </div>
  )
}
