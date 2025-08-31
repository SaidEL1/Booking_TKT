'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getTranslation } from '../../../lib/translations'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import ImageCarousel from '../../../components/ImageCarousel'
import {
  TicketIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckIcon,
  TruckIcon,
  PhotoIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function BookingPage({ params }) {
  const router = useRouter()
  const { locale } = params
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  // Carousel images
  const carouselImages = [
    '/images/AGENCIA NASSER (1).png',
    '/images/AGENCIA NASSER (2).png',
    '/images/AGENCIA NASSER.png',
    '/images/logo1.png',
    '/images/ship.svg'
  ]

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tripType: 'one-way',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    seniors: 0,
    children: 0,
    infants: 0,
    hasPets: false,
    petType: '',
    vehicleType: 'none',
    paid: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('required')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('required')
    }

    if (!formData.departureDate) {
      newErrors.departureDate = t('required')
    }

    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      newErrors.returnDate = t('required')
    }

    const totalPassengers = formData.adults + formData.seniors + formData.children + formData.infants
    if (totalPassengers < 1) {
      newErrors.passengers = t('required')
    }

    if (formData.hasPets && !formData.petType) {
      newErrors.petType = t('required')
    }

    if (!formData.paid) {
      newErrors.paid = t('mustPay')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step navigation functions
  const handleNextStep = (e) => {
    e.preventDefault()
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
  }

  // Validate step 1 (booking details)
  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('required')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }

    if (!formData.destination.trim()) {
      newErrors.destination = t('required')
    }

    if (!formData.departureDate) {
      newErrors.departureDate = t('required')
    }

    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      newErrors.returnDate = t('required')
    }

    const totalPassengers = formData.adults + formData.seniors + formData.children + formData.infants
    if (totalPassengers < 1) {
      newErrors.passengers = t('required')
    }

    if (formData.hasPets && !formData.petType) {
      newErrors.petType = t('required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate step 2 (review and payment)
  const validateStep2 = () => {
    const newErrors = {}

    if (!paymentMethod) {
      newErrors.paymentMethod = t('required')
    }

    if (!formData.paid) {
      newErrors.paid = t('mustPay')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep2()) {
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData = {
        ...formData,
        paymentMethod,
        paymentStatus: 'pending' // Set initial payment status as pending
      }

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to payment confirmation page instead of ticket page
        router.push(`/${locale}/payment-confirm?id=${result.bookingId}`)
      } else {
        // Go back Home Button
        const goHomeButton = (
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-orange-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('goBackHome')}
          </Link>
        );
        alert(result.error || t('bookingError'))
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert(t('bookingError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total passengers and pricing
  const getTotalPassengers = () => {
    return formData.adults + formData.seniors + formData.children + formData.infants
  }

  const getUnitPrice = () => {
    // Base price logic - you can customize this
    const basePrice = 50 // Base price per adult
    const seniorDiscount = 0.8 // 20% discount for seniors
    const childDiscount = 0.5 // 50% discount for children
    // Infants are usually free

    let totalPrice = 0
    totalPrice += formData.adults * basePrice
    totalPrice += formData.seniors * basePrice * seniorDiscount
    totalPrice += formData.children * basePrice * childDiscount
    // Infants are free

    return totalPrice
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const updatePassengerCount = (type, increment) => {
    setFormData(prev => {
      const currentCount = prev[type]
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1)
      return {
        ...prev,
        [type]: newCount
      }
    })

    if (errors.passengers) {
      setErrors(prev => ({
        ...prev,
        passengers: ''
      }))
    }
  }

  const features = [
    {
      icon: ShieldCheckIcon,
      title: t('secureBooking'),
      description: t('secureBookingDesc')
    },
    {
      icon: ClockIcon,
      title: t('quickProcess'),
      description: t('quickProcessDesc')
    },
    {
      icon: CheckIcon,
      title: t('instantConfirmation'),
      description: t('instantConfirmationDesc')
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230077B6' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <header className="backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link
              href={`/${locale}`}
              className="group relative px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{t('goBackHome')}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse bg-yellow-400"></div>
            </Link>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/30">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform hover:shadow-3xl transition-all duration-500">
              <div className="relative px-10 py-10 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      {/* Step 1 */}
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${currentStep === 1 ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                          }`}>
                          1
                        </div>
                        <span className="text-white font-medium">{t('step1')}</span>
                      </div>

                      {/* Arrow */}
                      <div className="w-8 h-0.5 bg-yellow-400"></div>

                      {/* Step 2 */}
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${currentStep === 2 ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                          }`}>
                          2
                        </div>
                        <span className="text-white font-medium">{t('step2')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 rounded-2xl backdrop-blur-sm bg-yellow-400">
                      <TicketIcon className="w-8 h-8 text-gray-800" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                      {currentStep === 1 ? t('bookTicket') : t('reviewTitle')}
                    </h1>
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-yellow-400">
                    {currentStep === 1 ? t('fillForm') : t('reviewSubtitle')}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full blur-3xl bg-orange-500/20"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full blur-2xl bg-yellow-400/30"></div>
              </div>

              <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} className="p-10 space-y-10">
                {currentStep === 1 ? (
                  // Step 1: Booking Form
                  <>
                    {/* Trip Type */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-300">
                          <TicketIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('tripType')}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <label className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${formData.tripType === 'one-way' ? 'scale-105' : 'hover:shadow-lg'
                          }`}>
                          <input
                            type="radio"
                            name="tripType"
                            value="one-way"
                            checked={formData.tripType === 'one-way'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`relative p-6 border-2 rounded-2xl transition-all duration-300 ${formData.tripType === 'one-way'
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-4 ring-indigo-100'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                            }`}>
                            <div className="text-center">
                              <div className={`inline-flex p-3 rounded-xl mb-3 ${formData.tripType === 'one-way'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                }`}>
                                <MapPinIcon className="w-6 h-6" />
                              </div>
                              <span className="font-medium text-gray-800">{t('oneWay')}</span>
                            </div>
                            {formData.tripType === 'one-way' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
                                <CheckIcon className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </label>

                        <label className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${formData.tripType === 'round-trip' ? 'scale-105' : 'hover:shadow-lg'
                          }`}>
                          <input
                            type="radio"
                            name="tripType"
                            value="round-trip"
                            checked={formData.tripType === 'round-trip'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`relative p-6 border-2 rounded-2xl transition-all duration-300 ${formData.tripType === 'round-trip'
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-4 ring-indigo-100'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                            }`}>
                            <div className="text-center">
                              <div className={`inline-flex p-3 rounded-xl mb-3 ${formData.tripType === 'round-trip'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                }`}>
                                <CalendarDaysIcon className="w-6 h-6" />
                              </div>
                              <span className="font-medium text-gray-800">{t('roundTrip')}</span>
                            </div>
                            {formData.tripType === 'round-trip' && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600">
                                <CheckIcon className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-400">
                          <UserIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('personalInfo')}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                          <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                            <UserIcon className="w-4 h-4 text-indigo-500" />
                            <span>{t('fullName')} *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                }`}
                              placeholder={t('enterFullName')}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        <div className="group">
                          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                            <EnvelopeIcon className="w-4 h-4 text-indigo-500" />
                            <span>{t('email')} *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                }`}
                              placeholder={t('enterEmail')}
                              dir="ltr"
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          {errors.email && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                              <span>{errors.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-400">
                          <MapPinIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('travelDetails')}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="group">
                          <label htmlFor="destination" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                            <MapPinIcon className="w-4 h-4 text-indigo-500" />
                            <span>{t('destination')} *</span>
                          </label>
                          <div className="relative">
                            <select
                              id="destination"
                              name="destination"
                              value={formData.destination}
                              onChange={handleChange}
                              className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 ${errors.destination ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                }`}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            >
                              <option value="">{t('selectDestination')}</option>
                              <option value="Armas transmediterranea">{t('destinationArmas')}</option>
                              <option value="Balearic Islands">{t('destinationBalearic')}</option>
                            </select>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          {errors.destination && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                              <span>{errors.destination}</span>
                            </p>
                          )}
                        </div>

                        <div className="group">
                          <label htmlFor="departureDate" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                            <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                            <span>{t('departureDate')} *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="departureDate"
                              name="departureDate"
                              value={formData.departureDate}
                              onChange={handleChange}
                              min={new Date().toISOString().split('T')[0]}
                              className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 ${errors.departureDate ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                }`}
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          {errors.departureDate && (
                            <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                              <span>{errors.departureDate}</span>
                            </p>
                          )}
                        </div>

                        {formData.tripType === 'round-trip' && (
                          <div className="group animate-fadeIn">
                            <label htmlFor="returnDate" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                              <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                              <span>{t('returnDate')} *</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                id="returnDate"
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={handleChange}
                                min={formData.departureDate || new Date().toISOString().split('T')[0]}
                                className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 ${errors.returnDate ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                  }`}
                              />
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {errors.returnDate && (
                              <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                                <span>{errors.returnDate}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-400">
                          <UsersIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('passengers')}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { key: 'adults', label: t('adults'), desc: t('adultsDesc') },
                          { key: 'seniors', label: t('seniors'), desc: t('seniorsDesc') },
                          { key: 'children', label: t('children'), desc: t('childrenDesc') },
                          { key: 'infants', label: t('infants'), desc: t('infantsDesc') }
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="group flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg" >
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{label}</p>
                              <p className="text-sm text-gray-500 font-medium">{desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => updatePassengerCount(key, false)}
                                disabled={formData[key] === 0}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg text-amber-700 hover:enabled:bg-amber-100 hover:enabled:border-amber-300"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-xl text-amber-400">{formData[key]}</span>
                              <button
                                type="button"
                                onClick={() => updatePassengerCount(key, true)}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300 font-bold text-lg text-sky-700 hover:bg-sky-100 hover:border-sky-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.passengers && (
                        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                          <span>{errors.passengers}</span>
                        </p>
                      )}
                    </div>

                    {/* Pets */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-300">
                          <UserIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('pets')}
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className="p-6 border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:border-indigo-300 transition-all duration-300">
                          <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                              type="checkbox"
                              name="hasPets"
                              checked={formData.hasPets}
                              onChange={handleChange}
                              className={`w-6 h-6 border-2 border-gray-300 rounded-lg focus:ring-2 mt-1 transition-all duration-300 ${errors.hasPets ? 'border-red-400' : ''
                                }`}
                              style={{
                                accentColor: '#0077B6',
                                focusRingColor: errors.hasPets ? undefined : 'rgba(0, 119, 182, 0.2)'
                              }}
                              onFocus={(e) => {
                                if (!errors.hasPets) {
                                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 119, 182, 0.2)';
                                }
                              }}
                              onBlur={(e) => {
                                if (!errors.hasPets) {
                                  e.target.style.boxShadow = 'none';
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-lg group-hover:text-indigo-600 transition-colors duration-300">{t('travelingWithPets')}</span>
                          </label>
                        </div>

                        {formData.hasPets && (
                          <div className="group animate-fadeIn">
                            <label htmlFor="petType" className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                              <UserIcon className="w-4 h-4 text-indigo-500" />
                              <span>{t('petType')} *</span>
                            </label>
                            <div className="relative">
                              <select
                                id="petType"
                                name="petType"
                                value={formData.petType}
                                onChange={handleChange}
                                className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 ${errors.petType ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-indigo-300'
                                  }`}
                                dir={isRTL ? 'rtl' : 'ltr'}
                              >
                                <option value="">{t('selectPetType')}</option>
                                <option value="dog">{t('dog')}</option>
                                <option value="cat">{t('cat')}</option>
                                <option value="bird">{t('bird')}</option>
                                <option value="other">{t('other')}</option>
                              </select>
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {errors.petType && (
                              <p className="mt-2 text-sm text-red-600 font-medium flex items-center space-x-1">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                                <span>{errors.petType}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Type */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-300">
                          <TruckIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('vehicleType')}
                        </h3>
                      </div>
                      <div className="group">
                        <div className="relative">
                          <select
                            id="vehicleType"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 border-gray-200 hover:border-indigo-300"
                            dir={isRTL ? 'rtl' : 'ltr'}
                          >
                            <option value="none">{t('noVehicle')}</option>
                            <option value="car">{t('car')}</option>
                            <option value="motorcycle">{t('motorcycle')}</option>
                            <option value="bicycle">{t('bicycle')}</option>
                          </select>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Confirmation */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl">
                          <CreditCardIcon className="w-6 h-6 text-gray-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {t('paymentConfirmation')}
                        </h3>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 p-8 rounded-2xl border-2 border-gray-200">
                        <label className="flex items-start gap-4 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="paid"
                            checked={formData.paid}
                            onChange={handleChange}
                            className={`w-6 h-6 border-2 border-gray-300 rounded-lg focus:ring-2 mt-1 transition-all duration-300 ${errors.paid ? 'border-red-400' : ''
                              }`}
                            style={{
                              accentColor: '#0077B6',
                              focusRingColor: errors.paid ? undefined : 'rgba(0, 119, 182, 0.2)'
                            }}
                            onFocus={(e) => {
                              if (!errors.paid) {
                                e.target.style.boxShadow = '0 0 0 2px rgba(0, 119, 182, 0.2)';
                              }
                            }}
                            onBlur={(e) => {
                              if (!errors.paid) {
                                e.target.style.boxShadow = 'none';
                              }
                            }}
                          />
                          <div>
                            <span className="text-gray-900 font-bold text-lg group-hover:text-indigo-600 transition-colors duration-300">{t('confirmPayment')}</span>
                            <p className="text-sm text-gray-600 mt-2 font-medium">{t('paymentNote')}</p>
                          </div>
                        </label>
                        {errors.paid && (
                          <p className="mt-3 text-sm text-red-600 font-medium flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                            <span>{errors.paid}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Step 1 Submit Button */}
                    <div className="pt-8">
                      <button
                        type="submit"
                        className="group relative w-full text-white py-5 px-8 rounded-2xl font-bold text-xl focus:ring-4 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-orange-500 to-yellow-400"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-center space-x-3">
                            <TicketIcon className="w-6 h-6" />
                            <span>{t('nextStep')}</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  // Step 2: Review & Confirm
                  <>
                    {/* Booking Summary */}
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 p-8 rounded-2xl border-2 border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-yellow-400">
                            <TicketIcon className="w-6 h-6 text-gray-800" />
                          </div>
                          <span>{t('bookingSummary')}</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-700 text-lg border-b border-gray-200 pb-2">{t('personalInfo')}</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium text-gray-600">{t('fullName')}:</span> <span className="text-gray-900">{formData.name}</span></p>
                              <p><span className="font-medium text-gray-600">{t('email')}:</span> <span className="text-gray-900">{formData.email}</span></p>
                            </div>
                          </div>

                          {/* Travel Details */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-700 text-lg border-b border-gray-200 pb-2">{t('travelDetails')}</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium text-gray-600">{t('tripType')}:</span> <span className="text-gray-900">{t(formData.tripType)}</span></p>
                              <p><span className="font-medium text-gray-600">{t('selectedDestination')}:</span> <span className="text-gray-900">{formData.destination}</span></p>
                              <p><span className="font-medium text-gray-600">{t('departureDate')}:</span> <span className="text-gray-900">{formData.departureDate}</span></p>
                              {formData.tripType === 'round-trip' && (
                                <p><span className="font-medium text-gray-600">{t('returnDate')}:</span> <span className="text-gray-900">{formData.returnDate}</span></p>
                              )}
                            </div>
                          </div>

                          {/* Passenger Details */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-700 text-lg border-b border-gray-200 pb-2">{t('passengerDetails')}</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium text-gray-600">{t('totalPassengers')}:</span> <span className="text-gray-900">{getTotalPassengers()}</span></p>
                              {formData.adults > 0 && <p><span className="font-medium text-gray-600">{t('adults')}:</span> <span className="text-gray-900">{formData.adults}</span></p>}
                              {formData.seniors > 0 && <p><span className="font-medium text-gray-600">{t('seniors')}:</span> <span className="text-gray-900">{formData.seniors}</span></p>}
                              {formData.children > 0 && <p><span className="font-medium text-gray-600">{t('children')}:</span> <span className="text-gray-900">{formData.children}</span></p>}
                              {formData.infants > 0 && <p><span className="font-medium text-gray-600">{t('infants')}:</span> <span className="text-gray-900">{formData.infants}</span></p>}
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-gray-700 text-lg border-b border-gray-200 pb-2">{t('additionalDetails')}</h4>
                            <div className="space-y-2">
                              {formData.hasPets && (
                                <p><span className="font-medium text-gray-600">{t('petType')}:</span> <span className="text-gray-900">{t(formData.petType)}</span></p>
                              )}
                              <p><span className="font-medium text-gray-600">{t('vehicleType')}:</span> <span className="text-gray-900">{t(formData.vehicleType)}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Details */}
                        <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200">
                          <h4 className="font-bold text-gray-700 text-lg mb-4">{t('pricingDetails')}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">{t('unitPrice')}:</span>
                              <span className="text-gray-900">€{getUnitPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-oceanBlue border-t border-gray-200 pt-2">
                              <span>{t('totalPrice')}:</span>
                              <span>€{getUnitPrice().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="p-2 rounded-xl bg-yellow-400">
                            <CreditCardIcon className="w-6 h-6 text-gray-800" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {t('paymentMethod')}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {['cash', 'card', 'transfer'].map((method) => (
                            <label key={method} className="cursor-pointer">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="sr-only"
                              />
                              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${paymentMethod === method
                                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                                }`}>
                                <div className={`text-lg font-bold ${paymentMethod === method ? 'text-indigo-600' : 'text-gray-700'
                                  }`}>
                                  {t(method)}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.paymentMethod && (
                          <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                            <span>{errors.paymentMethod}</span>
                          </p>
                        )}
                      </div>

                      {/* Payment Confirmation */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 p-8 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300">
                          <label className="flex items-start gap-4 cursor-pointer group">
                            <input
                              type="checkbox"
                              name="paid"
                              checked={formData.paid}
                              onChange={handleChange}
                              className={`w-6 h-6 border-2 border-gray-300 rounded-lg focus:ring-2 mt-1 transition-all duration-300 ${errors.paid ? 'border-red-400' : ''
                                }`}
                              style={{
                                accentColor: '#0077B6',
                                focusRingColor: errors.paid ? undefined : 'rgba(0, 119, 182, 0.2)'
                              }}
                              onFocus={(e) => {
                                if (!errors.paid) {
                                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 119, 182, 0.2)';
                                }
                              }}
                              onBlur={(e) => {
                                if (!errors.paid) {
                                  e.target.style.boxShadow = 'none';
                                }
                              }}
                            />
                            <div>
                              <span className="text-gray-900 font-bold text-lg group-hover:text-indigo-600 transition-colors duration-300">{t('confirmPayment')}</span>
                              <p className="text-sm text-gray-600 mt-2 font-medium">{t('paymentNote')}</p>
                            </div>
                          </label>
                          {errors.paid && (
                            <p className="mt-3 text-sm text-red-600 font-medium flex items-center space-x-1">
                              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">!</span>
                              <span>{errors.paid}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-8 flex gap-4">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {t('backToEdit')}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 group relative text-white py-5 px-8 rounded-2xl font-bold text-xl focus:ring-4 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
                      >
                        {isSubmitting ? t('submitting') : t('confirmBooking')}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform hover:shadow-3xl transition-all duration-500">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-yellow-400">
                    <PhotoIcon className="w-6 h-6 text-gray-800" />
                  </div>
                  <span>{t('gallery')}</span>
                </h3>
                <ImageCarousel images={carouselImages} className="h-80" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-yellow-400">
                  <StarIcon className="w-6 h-6 text-gray-800" />
                </div>
                <span>{t('whyChooseUs')}</span>
              </h3>
              <ul className="space-y-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-lg bg-sky-100">
                        <feature.icon className="w-6 h-6 text-sky-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{feature.title}</p>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}