import ReservationBox from '../../components/ReservationBox'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const currentLocale = locale || 'ar'
  
  const titles = {
    ar: 'وكالة ناصر الميريا - حجز تذاكر الطيران والسفر',
    en: 'Agencia Nasser Almeria - Flight & Travel Booking',
    fr: 'Agencia Nasser Almeria - Réservation de Vols et Voyages',
    es: 'Agencia Nasser Almeria - Reserva de Vuelos y Viajes'
  }
  
  const descriptions = {
    ar: 'وكالة ناصر الميريا - خدمات حجز تذاكر الطيران والسفر المتميزة. احجز رحلتك بسهولة وأمان مع خبرة أكثر من 10 سنوات في خدمات السفر.',
    en: 'Agencia Nasser Almeria - Premium flight and travel booking services. Book your journey easily and securely with over 10 years of travel service experience.',
    fr: 'Agencia Nasser Almeria - Services de réservation de vols et voyages premium. Réservez votre voyage facilement et en toute sécurité avec plus de 10 ans d’expérience.',
    es: 'Agencia Nasser Almeria - Servicios premium de reserva de vuelos y viajes. Reserve su viaje fácil y seguro con más de 10 años de experiencia en servicios de viaje.'
  }

  return {
    title: titles[currentLocale],
    description: descriptions[currentLocale],
    keywords: 'travel booking, flight tickets, agencia nasser, almeria, حجز تذاكر, وكالة سفر',
    authors: [{ name: 'Agencia Nasser Almeria' }],
    creator: 'Agencia Nasser Almeria',
    publisher: 'Agencia Nasser Almeria',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://agencianasseralmeria.com'),
    alternates: {
      canonical: `https://agencianasseralmeria.com/${currentLocale}`,
      languages: {
        'ar': 'https://agencianasseralmeria.com/ar',
        'en': 'https://agencianasseralmeria.com/en',
        'fr': 'https://agencianasseralmeria.com/fr',
        'es': 'https://agencianasseralmeria.com/es',
      },
    },
    openGraph: {
      title: titles[currentLocale],
      description: descriptions[currentLocale],
      url: `https://agencianasseralmeria.com/${currentLocale}`,
      siteName: 'Agencia Nasser Almeria',
      images: [
        {
          url: 'https://agencianasseralmeria.com/logo.png',
          width: 800,
          height: 600,
          alt: 'Agencia Nasser Almeria Logo',
        },
      ],
      locale: currentLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLocale],
      description: descriptions[currentLocale],
      images: ['https://agencianasseralmeria.com/logo.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  const currentLocale = locale || 'ar'
  const isRTL = currentLocale === 'ar'
  
  return (
    <html lang={currentLocale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0077B6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={isRTL ? 'rtl' : 'ltr'}>
        {children}
        <ReservationBox locale={currentLocale} />
      </body>
    </html>
  )
}
