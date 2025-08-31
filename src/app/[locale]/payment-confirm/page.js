'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslation } from '../../../lib/translations'
import PaymentMethods from './PaymentMethods'

export default function PaymentConfirmPage({ params, searchParams }) {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [locale, setLocale] = useState('ar')
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    const initializePage = async () => {
      setLocale(params.locale || 'ar')

      const id = searchParams?.id
      if (id) {
        setBookingId(id)
        await fetchBooking(id)
      }
    }

    initializePage()
  }, [params, searchParams])

  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  const fetchBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      } else {
        console.error('Booking not found')
      }
    } catch (err) {
      console.error('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleConfirmPayment = () => {
    setShowPayment(true)
  }

  const handlePaymentSuccess = (paymentData) => {
    // Redirect to confirmation page with payment success
    window.location.href = `/${locale}/confirmation?id=${booking.id}&payment=success&method=${paymentData.method}&paymentId=${paymentData.id}`
  }

  const calculateTotal = () => {
    const basePrice = 50
    const serviceFee = 5
    const total = (booking?.tickets || 0) * basePrice + serviceFee
    return total.toFixed(2)
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-pulse">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg mb-6 max-w-md mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 max-w-sm mx-auto"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('invalidBooking')}</h1>
              <p className="text-gray-600 mb-8 text-lg">
                {t('noBookingId')}
              </p>
              <Link href={`/${locale}`} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30 bg-[url('/images/patterns/pattern-1.svg')] bg-no-repeat bg-cover"
      ></div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-indigo-100/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href={`/${locale}`} className="flex items-center space-x-4 hover:opacity-90 transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <Image
                  src="/images/logo1.png"
                  alt={t('logoAlt')}
                  width={56}
                  height={56}
                  className="rounded-2xl shadow-lg ring-4 ring-white/50"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('brandName')}
                </span>
                <span className="text-sm text-gray-500 font-medium">{t('subtitle')}</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex flex-col md:flex-row items-center md:space-x-4 lg:space-x-8 space-y-8 md:space-y-0">
              {/* Step 1 - Completed */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">{t('bookingDetails')}</span>
              </div>

              {/* Connector */}
              <div className="w-1 h-16 md:w-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-green-500 to-indigo-500 rounded-full"></div>

              {/* Step 2 - Current */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-indigo-100">
                  2
                </div>
                <span className="ml-3 text-sm font-medium text-indigo-600">{t('payment')}</span>
              </div>

              {/* Connector */}
              <div className="w-1 h-16 md:w-16 md:h-1 bg-gray-200 rounded-full"></div>

              {/* Step 3 - Pending */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">{t('confirmation')}</span>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{t('paymentSummary')}</h1>
                <p className="text-indigo-100 text-lg font-medium">
                  {t('reviewBookingBeforePayment')}
                </p>
              </div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Booking Summary */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 10-4 0v2M9 5a2 2 0 000 4h6a2 2 0 000-4H9z" />
                        </svg>
                      </div>
                      <span className="leading-none">{t('bookingDetails')}</span>
                    </h2>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 space-y-6">
                      {/* Booking Reference */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{t('bookingReference')}</p>
                            <p className="font-bold text-gray-900 font-mono">{booking.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Info */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{t('passengerName')}</p>
                            <p className="font-bold text-gray-900">{booking.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{t('destination')}</p>
                            <p className="font-bold text-gray-900">{booking.destination}</p>
                          </div>
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{t('travelDate')}</p>
                            <p className="font-bold text-gray-900">{formatDate(booking.departureDate)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tickets */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">{t('numberOfTickets')}</p>
                            <p className="font-bold text-gray-900">{booking.tickets} {t('tickets')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      {t('paymentBreakdown')}
                    </h2>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">{t('ticketPrice')} ({booking.tickets} × {t('currencySymbol')}50)</span>
                        <span className="font-bold text-gray-900">{t('currencySymbol')}{(booking.tickets * 50).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">{t('serviceFee')}</span>
                        <span className="font-bold text-gray-900">{t('currencySymbol')}5.00</span>
                      </div>
                      <div className="flex justify-between items-center py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 border-2 border-indigo-200">
                        <span className="text-xl font-bold text-gray-900">{t('totalAmount')}</span>
                        <span className="text-2xl font-bold text-indigo-600">{t('currencySymbol')}{calculateTotal()}</span>
                      </div>
                    </div>

                    {!showPayment ? (
                      <div className="mt-8">
                        <button
                          onClick={handleConfirmPayment}
                          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold py-6 px-8 rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg"
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{t('proceedToPayment')}</span>
                            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </button>

                        <div className="mt-6 text-center">
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{t('securePaymentGuarantee')}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              {showPayment && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <PaymentMethods
                    booking={booking}
                    locale={locale}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
