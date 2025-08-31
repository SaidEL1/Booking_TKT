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
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function BookingPage({ params: { locale } }) {
  const router = useRouter()
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  // Carousel images
  const carouselImages = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png'
  ]

  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    
    // Trip Details
    tripType: 'one-way', // 'one-way' or 'round-trip'
    destination: '',
    departureDate: '',
    returnDate: '',
    
    // Passengers
    adults: 1,
    seniors: 0,
    children: 0,
    infants: 0,
    
    // Pets
    hasPets: false,
    petType: '', // 'small' or 'large'
    
    // Vehicle
    vehicleType: 'none', // 'none', 'car', 'caravan', 'motorcycle-large', 'motorcycle-small', 'bicycle', 'scooter'
    
    // Payment
    paid: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Personal Info
    if (!formData.name.trim()) {
      newErrors.name = t('required')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }

    // Trip Details
    if (!formData.destination.trim()) {
      newErrors.destination = t('required')
    }

    if (!formData.departureDate) {
      newErrors.departureDate = t('required')
    }

    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      newErrors.returnDate = t('required')
    }

    // Passengers - at least one passenger required
    const totalPassengers = formData.adults + formData.seniors + formData.children + formData.infants
    if (totalPassengers < 1) {
      newErrors.passengers = 'At least one passenger is required'
    }

    // Pets validation
    if (formData.hasPets && !formData.petType) {
      newErrors.petType = 'Please select pet type'
    }

    // Payment
    if (!formData.paid) {
      newErrors.paid = t('mustPay')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        router.push(`/${locale}/ticket/${result.bookingId}`)
      } else {
        alert(result.error || t('bookingError'))
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert(t('bookingError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Helper functions for passenger counts
  const updatePassengerCount = (type, increment) => {
    setFormData(prev => {
      const currentCount = prev[type]
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1)
      return {
        ...prev,
        [type]: newCount
      }
    })
    
    // Clear passenger error when count changes
    if (errors.passengers) {
      setErrors(prev => ({
        ...prev,
        passengers: ''
      }))
    }
  }

  // Features for sidebar
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure Booking',
      description: 'Your booking is protected with advanced security measures'
    },
    {
      icon: ClockIcon,
      title: 'Quick Process',
      description: 'Complete your booking in just a few minutes'
    },
    {
      icon: CheckCircleIcon,
      title: 'Instant Confirmation',
      description: 'Get immediate confirmation with QR code via email'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">{t('bookTicket')}</h1>
        <p className="text-center text-gray-600">Booking page content will be implemented here.</p>
      </div>
    </div>
  );
}