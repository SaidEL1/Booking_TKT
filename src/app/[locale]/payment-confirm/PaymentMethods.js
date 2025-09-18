'use client'

import { useState, useEffect } from 'react'
import { getTranslation } from '../../../lib/translations'

export default function PaymentMethods({ booking, locale, onPaymentSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  // Load Stripe
  useEffect(() => {
    if (!window.Stripe && !document.querySelector('script[src*="stripe"]')) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => setStripeLoaded(true)
      document.head.appendChild(script)
    } else if (window.Stripe) {
      setStripeLoaded(true)
    }
  }, [])

  // Load PayPal
  useEffect(() => {
    if (!window.paypal && !document.querySelector('script[src*="paypal"]')) {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'demo'}&currency=USD`
      script.onload = () => {
        setPaypalLoaded(true)
        initializePayPal()
      }
      document.head.appendChild(script)
    } else if (window.paypal) {
      setPaypalLoaded(true)
      initializePayPal()
    }
  }, [])

  const initializePayPal = () => {
    if (window.paypal && document.getElementById('paypal-button-container')) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (booking.tickets * 50 + 5).toFixed(2) // Calculate total amount
              },
              description: `${t('ticketBookingFor')} ${booking.destination} - ${booking.tickets} ${t('tickets')}`
            }]
          })
        },
        onApprove: async (data, actions) => {
          setLoading(true)
          try {
            const order = await actions.order.capture()

            // Update booking with payment info
            await updateBookingPayment(booking.id, {
              paymentMethod: 'paypal',
              paymentId: order.id,
              paymentStatus: 'completed',
              amount: order.purchase_units[0].amount.value
            })

            onPaymentSuccess({
              id: order.id,
              method: 'paypal',
              status: 'completed'
            })
          } catch (error) {
            console.error('PayPal payment error:', error)
            setError(t('paymentError'))
          } finally {
            setLoading(false)
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          setError(t('paymentError'))
        }
      }).render('#paypal-button-container')
    }
  }

  const handleStripePayment = async () => {
    if (!stripeLoaded || !window.Stripe) {
      setError(t('stripeNotLoaded'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      // Create Stripe checkout session (server computes amount & uses EUR)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          currency: 'eur',
          locale: locale,
          successUrl: `${origin}/${locale}/confirmation?id=${booking.id}&payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/${locale}/payment-confirm?id=${booking.id}&payment=cancelled`
        }),
      })

      const session = await response.json()

      if (!response.ok || session.error) {
        setError(session.error || 'Stripe session error')
        return
      }

      // Redirect to Stripe Checkout
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo')
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      console.error('Stripe payment error:', error)
      setError(t('paymentError'))
    } finally {
      setLoading(false)
    }
  }

  const updateBookingPayment = async (bookingId, paymentData) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Failed to update payment status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating payment:', error)
      throw error
    }
  }

  return (
    <div className="card animate-slide-up">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-0 flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="leading-none">{t('selectPaymentMethod')}</span>
          </h2>
        </div>
        <div className="card-body p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stripe Payment */}
            <div className="payment-method-card">
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer h-full flex flex-col">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('creditCard')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('stripeDescription')}</p>

                  <button
                    onClick={handleStripePayment}
                    disabled={loading || !stripeLoaded}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('processing')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>{t('payWithStripe')}</span>
                      </div>
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center mt-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('securePayment')}</span>
                  </div>
                  <p>{t('stripeSecurityNote')}</p>
                </div>
              </div>
            </div>

            {/* PayPal Payment */}
            <div className="payment-method-card">
              <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 transition-colors h-full flex flex-col">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm1.262-8.24a.858.858 0 0 1 .844-.695h2.33c1.724 0 3.058-.543 3.584-2.24.526-1.697-.544-2.24-2.267-2.24H9.005L8.338 13.097z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('payWithPayPal')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('paypalDescription')}</p>
                </div>

                {/* PayPal Button Container */}
                <div id="paypal-button-container" className="min-h-[45px]">
                  {!paypalLoaded && (
                    <div className="flex items-center justify-center py-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">{t('loadingPayPal')}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center mt-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('securePayment')}</span>
                  </div>
                  <p>{t('paypalSecurityNote')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50/50 rounded-xl p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t('totalAmount')}:</span>
                <span className="text-green-600">{t('currencySymbol')}{(booking.tickets * 50 + 5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}