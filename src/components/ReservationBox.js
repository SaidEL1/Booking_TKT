'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ReservationBox({ locale = 'ar' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAutoExpanded, setIsAutoExpanded] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now())
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    name: '',
    phone: ''
  })

  const isRTL = locale === 'ar'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Smart interaction detection with extended timeout
  const handleUserInteraction = () => {
    setIsUserInteracting(true)
    setLastInteractionTime(Date.now())

    // Reset interaction state after 5 minutes (300 seconds) of inactivity
    setTimeout(() => {
      if (Date.now() - lastInteractionTime >= 295000) { // 4 minutes 55 seconds
        setIsUserInteracting(false)
      }
    }, 300000) // 5 minutes
  }

  // Enhanced input change handler with interaction tracking
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    handleUserInteraction()
  }

  // Check if form has any data (user is engaged)
  const hasFormData = Object.values(formData).some(value => value.trim() !== '')

  // Smart engagement detection - user is engaged if any of these are true
  const isUserEngaged = isUserInteracting || hasFormData || isExpanded

  // Auto open/close cycle with smart detection
  useEffect(() => {
    if (!isVisible || isClosed) return

    let cycleTimer
    let closeTimer
    let reopenTimer

    const startAutoCycle = () => {
      // Only auto-expand if user is not currently engaged
      if (!isUserEngaged) {
        setIsAutoExpanded(true)

        // Determine timing based on whether form has data
        const hasData = Object.values(formData).some(value => value.trim() !== '')
        const openTime = hasData ? 60000 : 30000 // 1 minute if has data, 30 seconds if empty
        const closeTime = hasData ? 30000 : 10000 // 30 seconds closed if has data, 10 seconds if empty

        closeTimer = setTimeout(() => {
          // Only auto-close if user is still not engaged
          if (!isUserEngaged) {
            setIsAutoExpanded(false)

            reopenTimer = setTimeout(() => {
              startAutoCycle() // Restart the cycle
            }, closeTime)
          } else {
            // User is engaged, check again in 30 seconds (longer check interval)
            setTimeout(() => {
              if (!isUserEngaged) {
                setIsAutoExpanded(false)
                setTimeout(startAutoCycle, closeTime)
              } else {
                // Still engaged, keep checking every 30 seconds
                setTimeout(arguments.callee, 30000)
              }
            }, 30000)
          }
        }, openTime)
      } else {
        // User is engaged, try again in 1 minute
        setTimeout(startAutoCycle, 60000)
      }
    }

    // Start the first cycle after component becomes visible
    const initialTimer = setTimeout(startAutoCycle, 3000)

    return () => {
      clearTimeout(initialTimer)
      clearTimeout(cycleTimer)
      clearTimeout(closeTimer)
      clearTimeout(reopenTimer)
    }
  }, [isVisible, isClosed, isUserEngaged, formData])

  const services = [
    { id: 'ferry', name: isRTL ? 'حجز تذاكر الباخرة' : 'Ferry Tickets', icon: '🛳️' },
    { id: 'money-transfer', name: isRTL ? 'تحويل الأموال' : 'Money Transfer', icon: '💸' },
    { id: 'translation', name: isRTL ? 'الترجمة' : 'Translation', icon: '📝' },
    { id: 'printing', name: isRTL ? 'الطباعة والنسخ' : 'Printing & Copying', icon: '🖨️' },
    { id: 'admin', name: isRTL ? 'المساعدة الإدارية' : 'Administrative Help', icon: '📋' },
    { id: 'appointments', name: isRTL ? 'حجز المواعيد' : 'Appointments', icon: '📅' }
  ]

  const handleQuickReservation = () => {
    if (formData.service && formData.name && formData.phone) {
      const message = encodeURIComponent(
        `${isRTL ? 'مرحبا! أريد حجز موعد للخدمة التالية:' : 'Hello! I want to book an appointment for:'}\n` +
        `${isRTL ? 'الخدمة:' : 'Service:'} ${services.find(s => s.id === formData.service)?.name}\n` +
        `${isRTL ? 'التاريخ المفضل:' : 'Preferred Date:'} ${formData.date}\n` +
        `${isRTL ? 'الاسم:' : 'Name:'} ${formData.name}\n` +
        `${isRTL ? 'الهاتف:' : 'Phone:'} ${formData.phone}`
      )
      window.open(`https://wa.me/34614459952?text=${message}`, '_blank')
    }
  }

  // Close handler - just collapse, don't hide completely
  const handleClose = () => {
    setIsExpanded(false)
    setIsAutoExpanded(false)
    setIsUserInteracting(false)
    // Don't set isClosed to true - just collapse
  }

  // Determine if should be expanded (clicked, hovered, or auto-expanded)
  const shouldExpand = isExpanded || isHovered || isAutoExpanded

  return (
    <div
      className={`fixed bottom-28 right-1/2 translate-x-1/2 sm:right-auto sm:translate-x-0 ${isRTL ? 'sm:left-6' : 'sm:right-6'} z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Reservation Box */}
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-blue-200 transition-all duration-300 ${shouldExpand ? 'w-[90vw] max-w-sm sm:w-80 h-auto' : 'w-20 h-20'
          } overflow-hidden`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full ${shouldExpand ? 'h-16' : 'h-20'} flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 ${shouldExpand ? 'rounded-t-2xl' : 'rounded-2xl'
            }`}
          style={{ backgroundColor: '#0077B6' }}
        >
          {shouldExpand ? (
            <div className="flex items-center gap-3">
              <span className="text-xl">🎫</span>
              <span className="font-bold text-sm">{isRTL ? 'حجز سريع' : 'Quick Booking'}</span>
              <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <span className="text-2xl text-white drop-shadow-lg">🎫</span>
          )}
        </button>

        {/* Expanded Content */}
        {shouldExpand && (
          <div className="p-6 bg-gray-50 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 15rem)' }}>
            {/* Auto-cycle indicator */}
            {isAutoExpanded && (
              <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-center text-sm font-bold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(to right, #FFD60A, #FF7B00)' }}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {isRTL ? 'عرض حصري لك اليوم فقط! 🎁' : 'Exclusive Offer Just For You Today! 🎁'}
              </div>
            )}

            {/* Service Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {isRTL ? 'اختر الخدمة' : 'Select Service'}
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                onFocus={handleUserInteraction}
                onBlur={() => setTimeout(() => setIsUserInteracting(false), 30000)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ focusRingColor: '#0077B6' }}
              >
                <option value="">{isRTL ? 'اختر خدمة...' : 'Choose a service...'}</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.icon} {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {isRTL ? 'التاريخ المفضل' : 'Preferred Date'}
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                onFocus={handleUserInteraction}
                onBlur={() => setTimeout(() => setIsUserInteracting(false), 30000)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ focusRingColor: '#0077B6' }}
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {isRTL ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={handleUserInteraction}
                onBlur={() => setTimeout(() => setIsUserInteracting(false), 30000)}
                placeholder={isRTL ? 'اسمك الكامل' : 'Your full name'}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ focusRingColor: '#0077B6' }}
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {isRTL ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={handleUserInteraction}
                onBlur={() => setTimeout(() => setIsUserInteracting(false), 30000)}
                placeholder={isRTL ? '+34 xxx xxx xxx' : '+34 xxx xxx xxx'}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ focusRingColor: '#0077B6' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Quick Reservation via WhatsApp */}
              <button
                onClick={handleQuickReservation}
                disabled={!formData.service || !formData.name || !formData.phone}
                className="w-full text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: formData.service && formData.name && formData.phone
                    ? 'linear-gradient(to right, #FF7B00, #FF6B00)'
                    : '#9CA3AF',
                  boxShadow: formData.service && formData.name && formData.phone
                    ? '0 10px 25px rgba(255, 123, 0, 0.3)'
                    : 'none'
                }}
              >
                <span className="text-lg animate-bounce">💬</span>
                {isRTL ? 'حجز سريع عبر واتساب' : 'Quick WhatsApp Booking'}
              </button>

              {/* Full Booking Page */}
              <Link
                href={`/${locale}/book`}
                className="w-full text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(to right, #0077B6, #005A8B)',
                  boxShadow: '0 10px 25px rgba(0, 119, 182, 0.3)'
                }}
              >
                <span className="text-lg animate-pulse">🎫</span>
                {isRTL ? 'حجز مفصل' : 'Detailed Booking'}
              </Link>

              {/* Learn More Button */}
              <Link
                href={`/${locale}/about`}
                className="w-full text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(to right, #FFD60A, #FFC107)',
                  boxShadow: '0 10px 25px rgba(255, 214, 10, 0.3)',
                  color: '#212529'
                }}
              >
                <span className="text-lg animate-spin">ℹ️</span>
                {isRTL ? 'تعرف علينا أكثر' : 'Learn More About Us'}
              </Link>

              {/* Contact Button */}
              <Link
                href={`/${locale}/contact`}
                className="w-full text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(to right, #0077B6, #FF7B00)',
                  boxShadow: '0 10px 25px rgba(0, 119, 182, 0.2)'
                }}
              >
                <span className="text-lg animate-ping">📞</span>
                {isRTL ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating notification dot when collapsed */}
      {!shouldExpand && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ background: '#FF7B00' }}></div>
      )}

      {/* Close Button - only show when expanded */}
      {shouldExpand && (
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg"
          title={isRTL ? 'إغلاق' : 'Close'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
