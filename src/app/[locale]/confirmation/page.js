import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslation } from '../../../lib/translations'
import ConfirmationContent from './ConfirmationContent'

export default async function ConfirmationPage({ params, searchParams }) {
  const { locale } = await params
  const awaitedSearchParams = await searchParams
  const bookingId = awaitedSearchParams?.id
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  if (!bookingId) {
    return (
      <div className={`min-h-screen bg-gradient-primary ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="container-tight py-12 lg:py-20">
          <div className="card text-center animate-fade-in">
            <div className="icon-container-lg bg-red-100 mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="heading-lg text-gray-900 mb-4">{t('invalidBooking')}</h1>
            <p className="text-gray-600 mb-8 text-lg">
              {t('noBookingId')}
            </p>
            <Link href={`/${locale}`} className="btn-primary inline-flex items-center">
              <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className={`min-h-screen bg-gradient-primary ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="container-fluid">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <Link href={`/${locale}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="icon-container bg-gradient-to-r from-blue-600 to-blue-700">
                <Image
                  src="/images/logo1.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <span className="heading-sm text-gray-900 font-bold">{t('brandName')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-tight py-12 lg:py-20">
        <Suspense fallback={
          <div className="card text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 max-w-sm mx-auto"></div>
          </div>
        }>
          <ConfirmationContent bookingId={bookingId} locale={locale} searchParams={awaitedSearchParams} />
        </Suspense>
      </main>
    </div>
  )
}
