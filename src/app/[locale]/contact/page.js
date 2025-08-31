import Link from 'next/link'
import { getTranslation } from '../../../lib/translations'
import AOSWrapper from '../../../components/AOSWrapper'
import Image from 'next/image'

export default async function ContactPage({ params }) {
  const { locale } = params
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
            <Link href={`/${locale}/about`} className="hover:text-yellow-300 transition">
              {t('aboutUs')}
            </Link>
            <Link href={`/${locale}/contact`} className="font-semibold text-yellow-400">
              {t('contact')}
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-6xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('contactUs')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('contactHeroSubtitle')}
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="text-center text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-800" data-aos="zoom-in">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-bold mb-4">
                {t('callUs')}
              </h3>
              <p className="text-lg mb-2">{t('primaryPhoneNumberValue')}</p>
              <p className="text-lg">{t('secondaryPhoneNumberValue')}</p>
              <p className="text-sm opacity-90 mt-4">
                {t('available247')}
              </p>
            </div>

            {/* WhatsApp */}
            <div className="text-center text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600" data-aos="zoom-in" data-aos-delay="100">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-4">{t('whatsapp')}</h3>
              <p className="text-lg mb-4">{t('primaryPhoneNumberValue')}</p>
              <a
                href="https://wa.me/34123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-orange-500 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t('messageNow')}
              </a>
            </div>

            {/* Location */}
            <div className="text-center text-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-400 to-yellow-500" data-aos="zoom-in" data-aos-delay="200">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-4">
                {t('ourLocation')}
              </h3>
              <p className="text-lg mb-2">{t('addressLine1Value')}</p>
              <p className="text-lg mb-2">{t('addressLine2Value')}</p>
              <p className="text-lg">{t('countryNameValue')}</p>
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-8 text-blue-600">
                {t('sendMessageTitle')}
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      {t('firstName')}
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition focus:ring-2 focus:ring-blue-600"
                      placeholder={t('firstNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      {t('lastName')}
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition focus:ring-2 focus:ring-blue-600"
                      placeholder={t('lastNamePlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition focus:ring-2 focus:ring-blue-600"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition focus:ring-2 focus:ring-blue-600"
                    placeholder={t('phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    {t('serviceNeeded')}
                  </label>
                  <select className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition focus:ring-2 focus:ring-blue-600">
                    <option value="">{t('selectService')}</option>
                    <option value="ferry">{t('ticketBooking')}</option>
                    <option value="money-transfer">{t('moneyTransfer')}</option>
                    <option value="translation">{t('translation')}</option>
                    <option value="printing">{t('printingCopying')}</option>
                    <option value="admin">{t('adminAssistance')}</option>
                    <option value="appointments">{t('appointments')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    {t('message')}
                  </label>
                  <textarea
                    rows="5"
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-900 transition resize-none focus:ring-2 focus:ring-blue-600"
                    placeholder={t('messagePlaceholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30"
                >
                  {t('sendMessageButton')}
                </button>
              </form>
            </div>

            {/* Map */}
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-8 text-blue-600">
                {t('findUsOnMap')}
              </h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.4849694327143!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287f8a7e7d7b%3A0x8b8b8b8b8b8b8b8b!2sPuerta%20del%20Sol%2C%20Madrid%2C%20Spain!5e0!3m2!1sen!2ses!4v1234567890123"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('ourLocation')}
                ></iframe>
              </div>

              {/* Operating Hours */}
              <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  {t('operatingHours')}
                </h3>
                <div className="space-y-2 text-gray-900">
                  <div className="flex justify-between">
                    <span>{t('weekdays')}</span>
                    <span>{t('weekdaysHours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('saturday')}</span>
                    <span>{t('saturdayHours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('sunday')}</span>
                    <span className="text-orange-500">{t('closed')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact Actions */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-8 text-blue-600">
              {t('quickContactOptions')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                href="https://wa.me/34123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600"
              >
                <div className="text-3xl mb-2">💬</div>
                {t('whatsapp')}
              </a>
              <a
                href="tel:+34123456789"
                className="text-white p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-800"
              >
                <div className="text-3xl mb-2">📞</div>
                {t('directCall')}
              </a>
              <a
                href="mailto:info@example.com"
                className="text-gray-900 p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-yellow-400 to-yellow-500"
              >
                <div className="text-3xl mb-2">✉️</div>
                {t('email')}
              </a>
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
              <Link href={`/${locale}/about`} className="border-2 border-yellow-400 text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t('aboutUs')}
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
