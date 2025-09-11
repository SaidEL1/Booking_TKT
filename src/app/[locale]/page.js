import Link from 'next/link'
import { getTranslation } from '../../lib/translations'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import AOSWrapper from '../../components/AOSWrapper'
import BookingLauncherLeft from '../../components/BookingLauncherLeft'

export default async function HomePage({ params }) {
  const { locale } = (await params)
  const t = (key) => getTranslation(locale, key)
  const isRTL = locale === 'ar'

  return (
    <AOSWrapper>
      <main className={`overflow-x-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 font-sans dark:bg-gray-900 dark:text-white ${isRTL ? 'rtl' : 'ltr'}`} style={{ backgroundColor: '#F8F9FA', color: '#212529' }}>
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4" style={{ backgroundColor: '#0077B6' }}>
          {/* Book Your Ticket Button */}
          <Link
            href={`/${locale}/book`}
            className="group relative px-6 py-3 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(to right, #FFD60A, #F59E0B)' }}
          >
            <span className="relative z-10">{t('bookYourTicket')}</span>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: '#FCD34D' }}></div>
          </Link>

          {/* Logo + Brand Name - Centered */}
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
              <img
                src="/logo.png"
                alt={t('logoAlt')}
                width={80}
                height={80}
                className="w-16 h-16 object-contain drop-shadow-lg"
                loading="eager"
                decoding="sync"
              />
              <span className="hidden md:block text-white font-bold text-xl" style={{ color: '#FFD60A' }}>
                {t('brandName')}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-white">
            <Link
              href={`/${locale}`}
              className="hover:text-yellow-300 transition"
              style={{ color: '#FFD60A' }}
            >
              {t('home')}
            </Link>
            <a
              href="#services"
              className="hover:text-yellow-300 transition"
            >
              {t('services')}
            </a>
            <a
              href="#contact"
              className="hover:text-yellow-300 transition"
            >
              {t('contact')}
            </a>
            <div className="bg-white/20 rounded-lg p-1">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section
          className="relative h-[75vh] bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('/images/Servicios de traducción (árabe - español - francés) 🧾 خدمات الترجمة (العربية - الإسبانية - الفرنسية).png')"
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(to right, rgba(0, 119, 182, 0.7), rgba(255, 123, 0, 0.7))' }}></div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14" style={{ color: '#0077B6' }}>
            {t('ourServices')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { title: t('ticketBooking'), icon: '🛳️', desc: t('ticketBookingDesc'), color: '#0077B6' },
              { title: t('moneyTransfer'), icon: '💸', desc: t('moneyTransferDesc'), color: '#FF7B00' },
              { title: t('printingCopying'), icon: '🖨️', desc: t('printingCopyingDesc'), color: '#FFD60A' },
              { title: t('translation'), icon: '📝', desc: t('translationDesc'), color: '#0077B6' },
              { title: t('adminAssistance'), icon: '📋', desc: t('adminAssistanceDesc'), color: '#FF7B00' },
              { title: t('appointmentBooking'), icon: '📅', desc: t('appointmentBookingDesc'), color: '#FFD60A' }
            ].map((s, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4" style={{ borderLeftColor: s.color }} data-aos="zoom-in" data-aos-delay={i * 100}>
                <div className="text-5xl mb-4 text-center">{s.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: s.color }}>{s.title}</h3>
                <p className="text-center leading-relaxed" style={{ color: '#212529' }}>{s.desc}</p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `linear-gradient(to br, ${s.color}, ${s.color}88)` }}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-20 px-6" style={{ backgroundColor: '#F8F9FA' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14" style={{ color: '#0077B6' }}>
            {t('customerReviews')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: t('testimonial1Name'), review: t('testimonial1Text'), rating: 5 },
              { name: t('testimonial2Name'), review: t('testimonial2Text'), rating: 5 },
              { name: t('testimonial3Name'), review: t('testimonial3Text'), rating: 5 }
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 rtl:ml-4 rtl:mr-0" style={{ background: 'linear-gradient(to br, #FF7B00, #E56B00)' }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: '#212529' }}>{review.name}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, j) => (
                        <span key={j} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic" style={{ color: '#212529' }}>"{review.review}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14" style={{ color: '#0077B6' }}>
            {t('gallery')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg" data-aos="zoom-in" data-aos-delay={i * 50}>
                <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `linear-gradient(45deg, #0077B6${Math.floor(Math.random() * 9)}0, #FF7B00${Math.floor(Math.random() * 9)}0)` }}>
                  {['🛳️', '💸', '🖨️', '📝', '📋', '📅', '🌍', '✈️'][i - 1]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6" style={{ backgroundColor: '#F8F9FA' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14" style={{ color: '#0077B6' }}>
            {t('contactUs')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Map */}
            <div data-aos="fade-right">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80 mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.4849694327143!2d-2.4637902!3d36.8367754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7a9a7e7d7b%3A0x8b8b8b8b8b8b8b8b!2sC.%20Real%2094%2C%2004002%20Almer%C3%ADa%2C%20Spain!5e0!3m2!1sen!2ses!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('ourLocation')}
                ></iframe>
              </div>
            </div>

            {/* Contact Info */}
            <div data-aos="fade-left">
              <div className="space-y-4">
                {/* Primary Phone */}
                <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: '#0077B6' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0 text-white" style={{ background: 'linear-gradient(to br, #0077B6, #005A8B)' }}>
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#212529' }}>+34 614459952</p>
                    <p className="text-sm text-gray-600">{t('primaryPhone')}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: '#FF7B00' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0 text-white" style={{ background: 'linear-gradient(to br, #FF7B00, #E56B00)' }}>
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#212529' }}>+34 655742260</p>
                    <p className="text-sm text-gray-600">{t('secondaryPhone')}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: '#FFD60A' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0" style={{ background: 'linear-gradient(to br, #FFD60A, #FFC107)', color: '#212529' }}>
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#212529' }}>nasseragencia@gmail.com</p>
                    <p className="text-sm text-gray-600">{t('email')}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: '#0077B6' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0 text-white" style={{ background: 'linear-gradient(to br, #0077B6, #005A8B)' }}>
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#212529' }}>C. Real 94, 04002 Almería</p>
                    <p className="text-sm text-gray-600">{t('address')}</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-6 border-t border-gray-200 mt-6">
                <h4 className="text-lg font-semibold mb-4" style={{ color: '#212529' }}>
                  {t('followUs')}
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://wa.me/34614459952"
                    className="flex items-center justify-center w-12 h-12 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all duration-200"
                    style={{ background: 'linear-gradient(to br, #FF7B00, #E56B00)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-xl">💬</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center w-12 h-12 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all duration-200"
                    style={{ background: 'linear-gradient(to br, #0077B6, #005A8B)' }}
                  >
                    <span className="text-xl">📘</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-white text-center py-6" style={{ background: 'linear-gradient(to right, #212529, #0077B6)' }}>
          <p className="text-sm">
            &copy; 2025 {t('companyName')}. {t('allRightsReserved')}.
          </p>
        </footer>
        <BookingLauncherLeft locale={locale} />
      </main>
    </AOSWrapper>
  )
}