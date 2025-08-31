import Link from 'next/link'
import { getTranslation } from '../../../lib/translations'
import AOSWrapper from '../../../components/AOSWrapper'
import Image from 'next/image'

export default async function AboutPage({ params }) {
  const { locale } = await params
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  return (
    <AOSWrapper>
      <main className={`bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 font-sans dark:bg-gray-900 dark:text-white ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-blue-600 backdrop-blur-md shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Book Your Ticket Button */}
          <Link
            href={`/${locale}/book`}
            className="group relative px-6 py-3 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-yellow-400 to-amber-500"
          >
            <span className="relative z-10">{t('bookYourTicket')}</span>
            <div className="absolute inset-0 bg-yellow-300 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>

          {/* Logo + Brand Name - Centered */}
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/logo.png"
                alt={t('logoAlt')}
                width={80}
                height={80}
                className="w-16 h-16 object-contain drop-shadow-lg"
                priority
              />
              <span className="hidden md:block text-yellow-400 font-bold text-xl">
                {t('brandName')}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-white">
            <Link href={`/${locale}`} className="hover:text-yellow-300 transition">
              {t('home')}
            </Link>
            <Link href={`/${locale}/about`} className="font-semibold text-yellow-400">
              {t('aboutUs')}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-yellow-300 transition">
              {t('contact')}
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-6xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('aboutHeroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('aboutHeroSubtitle')}
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
                {t('ourStory')}
              </h2>
              <p className="text-lg mb-6 text-gray-900">
                {t('ourStoryParagraph1')}
              </p>
              <p className="text-lg text-gray-900">
                {t('ourStoryParagraph2')}
              </p>
            </div>
            <div data-aos="fade-left" className="text-white text-center p-8 rounded-2xl shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-4">
                {t('experience')}
              </h3>
              <p className="text-lg opacity-90">
                {t('experienceSubtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Our Services Overview */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-blue-600" data-aos="fade-up">
              {t('ourPremiumServices')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '🛳️', title: t('ticketBooking'), desc: t('ticketBookingDesc'), color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
                { icon: '💸', title: t('moneyTransfer'), desc: t('moneyTransferDesc'), color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
                { icon: '🖨️', title: t('printingCopying'), desc: t('printingCopyingDesc'), color: 'bg-gradient-to-br from-yellow-400 to-yellow-500' },
                { icon: '📝', title: t('translation'), desc: t('translationDesc'), color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
                { icon: '📋', title: t('adminAssistance'), desc: t('adminAssistanceDesc'), color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
                { icon: '📅', title: t('appointmentBooking'), desc: t('appointmentBookingDesc'), color: 'bg-gradient-to-br from-yellow-400 to-yellow-500' }
              ].map((service, index) => (
                <div key={index} className={`text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${service.color}`} data-aos="zoom-in" data-aos-delay={index * 100}>
                  <div className="text-5xl mb-4 text-center">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-center">{service.title}</h3>
                  <p className={`text-center opacity-90 ${service.color.includes('yellow') ? 'text-gray-900' : 'text-white'}`}>{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-blue-600" data-aos="fade-up">
              {t('whyChooseUs')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '⚡', title: t('fastService'), desc: t('fastServiceDesc') },
                { icon: '🛡️', title: t('highReliability'), desc: t('highReliabilityDesc') },
                { icon: '💰', title: t('competitivePrices'), desc: t('competitivePricesDesc') },
                { icon: '🎯', title: t('precision'), desc: t('precisionDesc') }
              ].map((feature, index) => (
                <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-orange-500">{feature.title}</h3>
                  <p className="text-gray-900">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-blue-600" data-aos="fade-up">
              {t('customerReviews')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: t('testimonial1Name'), text: t('testimonial1Text') },
                { name: t('testimonial2Name'), text: t('testimonial2Text') },
                { name: t('testimonial3Name'), text: t('testimonial3Text') }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg" data-aos="fade-up" data-aos-delay={index * 100}>
                  <p className="text-lg text-gray-800 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="text-yellow-400 mr-2">{'⭐'.repeat(5)}</div>
                    <p className="font-bold text-blue-600">- {testimonial.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 text-white bg-gradient-to-r from-blue-600 to-orange-500">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('readyToStart')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('contactUsToday')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/book`} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t('bookNow')}
              </Link>
              <Link href={`/${locale}/contact`} className="border-2 border-yellow-400 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-white text-center py-6 bg-gradient-to-r from-gray-900 to-blue-600">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {t('companyName')}. {t('allRightsReserved')}.
          </p>
        </footer>
      </main>
    </AOSWrapper>
  )
}
