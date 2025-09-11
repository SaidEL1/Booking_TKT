'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

export default function BookingLauncherLeft({ locale = 'ar' }) {
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)

    // form state
    const [service, setService] = useState('')
    const [destination, setDestination] = useState('')
    const [tickets, setTickets] = useState('1')
    const [date, setDate] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    // افتح النافذة مرة واحدة فقط كل 7 أيام (إلا إذا وُجد showBooking=1)
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            const forceOpen = params.get('showBooking') === '1'
            const key = 'bookingModalLastShown'
            const now = Date.now()
            const last = parseInt(localStorage.getItem(key) || '0', 10)
            const sevenDays = 7 * 24 * 60 * 60 * 1000
            if (forceOpen || now - last > sevenDays) {
                setOpen(true)
                localStorage.setItem(key, String(now))
            }
        } catch { }
    }, [])

    // إغلاق عند الضغط خارج البانِل
    useEffect(() => {
        if (!open) return
        const onClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    // إغلاق بـ ESC
    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === 'Escape' && setOpen(false)
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    const close = useCallback(() => setOpen(false), [])

    // نصوص مختصرة
    const t = {
        quick: { ar: 'حجز سريع', en: 'Quick booking', fr: 'Réservation rapide', es: 'Reserva rápida' }[locale],
        detail: { ar: 'حجز مفصل', en: 'Detailed booking', fr: 'Réservation détaillée', es: 'Reserva detallada' }[locale],
        learn: { ar: 'تعرف علينا أكثر', en: 'Learn more', fr: 'En savoir plus', es: 'Saber más' }[locale],
        contact: { ar: 'اتصل بنا', en: 'Contact us', fr: 'Contactez-nous', es: 'Contáctanos' }[locale],
    }

    // UI labels/placeholders/options (localized)
    const ui = {
        serviceLabel: { ar: 'اختر الخدمة', en: 'Select service', fr: 'Choisissez le service', es: 'Elige el servicio' }[locale],
        servicePlaceholder: { ar: 'اختر خدمة...', en: 'Select a service...', fr: 'Sélectionnez un service...', es: 'Selecciona un servicio...' }[locale],
        optionFerry: { ar: '🛳️ تذاكر الباخرة', en: '🛳️ Ferry tickets', fr: '🛳️ Billets de ferry', es: '🛳️ Billetes de ferry' }[locale],
        optionMoney: { ar: '💸 تحويل الأموال', en: '💸 Money transfer', fr: '💸 Transfert d\'argent', es: '💸 Transferencia de dinero' }[locale],
        optionTranslation: { ar: '📝 الترجمة', en: '📝 Translation', fr: '📝 Traduction', es: '📝 Traducción' }[locale],
        destinationLabel: { ar: 'الوجهة', en: 'Destination', fr: 'Destination', es: 'Destino' }[locale],
        destinationPlaceholder: {
            ar: 'مثال: ألمرية ← طنجة',
            en: 'e.g., Almería → Tangier',
            fr: 'ex.: Almería → Tanger',
            es: 'p. ej., Almería → Tánger'
        }[locale],
        ticketsLabel: { ar: 'عدد التذاكر', en: 'Number of tickets', fr: 'Nombre de billets', es: 'Número de boletos' }[locale],
        preferredDateLabel: { ar: 'التاريخ المفضل', en: 'Preferred date', fr: 'Date préférée', es: 'Fecha preferida' }[locale],
        datePlaceholder: { ar: 'mm/dd/yyyy', en: 'mm/dd/yyyy', fr: 'mm/jj/aaaa', es: 'mm/dd/aaaa' }[locale],
        nameLabel: { ar: 'الاسم', en: 'Name', fr: 'Nom', es: 'Nombre' }[locale],
        namePlaceholder: { ar: 'اسمك الكامل', en: 'Your full name', fr: 'Votre nom complet', es: 'Tu nombre completo' }[locale],
        phoneLabel: { ar: 'رقم الهاتف', en: 'Phone number', fr: 'Numéro de téléphone', es: 'Número de teléfono' }[locale],
        phonePlaceholder: { ar: '+34 xxx xxx xxx', en: '+34 xxx xxx xxx', fr: '+34 xxx xxx xxx', es: '+34 xxx xxx xxx' }[locale],
        promoBanner: {
            ar: '✈️ عروض السفر! حصرية اليوم فقط',
            en: '✈️ Travel Deals! Exclusive today only',
            fr: '✈️ Offres de voyage ! Exclusif aujourd\'hui seulement',
            es: '✈️ ¡Ofertas de viaje! Exclusivo solo hoy'
        }[locale],
        promoText: {
            ar: 'عروض السفر! حصرية اليوم فقط',
            en: 'Travel Deals! Exclusive today only',
            fr: 'Offres de voyage ! Exclusif aujourd\'hui seulement',
            es: '¡Ofertas de viaje! Exclusivo solo hoy'
        }[locale]
    }

    // countdown to midnight (HH:MM:SS)
    const pad = (n) => String(n).padStart(2, '0')
    const computeUntilMidnight = () => {
        const now = new Date()
        const midnight = new Date(now)
        midnight.setHours(24, 0, 0, 0)
        const ms = Math.max(0, midnight - now)
        const h = Math.floor(ms / 3600000)
        const m = Math.floor((ms % 3600000) / 60000)
        const s = Math.floor((ms % 60000) / 1000)
        return `${pad(h)}:${pad(m)}:${pad(s)}`
    }
    const computeMsUntilMidnight = () => {
        const now = new Date()
        const midnight = new Date(now)
        midnight.setHours(24, 0, 0, 0)
        return Math.max(0, midnight - now)
    }
    const computeUrgency = (ms) => {
        const twoHours = 2 * 60 * 60 * 1000
        const sixHours = 6 * 60 * 60 * 1000
        if (ms <= twoHours) return 'high'
        if (ms <= sixHours) return 'medium'
        return 'low'
    }
    const [untilMidnight, setUntilMidnight] = useState(computeUntilMidnight())
    const [urgency, setUrgency] = useState(computeUrgency(computeMsUntilMidnight()))
    useEffect(() => {
        const id = setInterval(() => {
            setUntilMidnight(computeUntilMidnight())
            setUrgency(computeUrgency(computeMsUntilMidnight()))
        }, 1000)
        return () => clearInterval(id)
    }, [])

    const bannerColor = urgency === 'high'
        ? 'bg-rose-100 text-rose-900 border-rose-300'
        : urgency === 'medium'
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300'

    const chipColor = urgency === 'high'
        ? 'text-rose-900 bg-rose-200/90 border border-rose-300'
        : urgency === 'medium'
            ? 'text-amber-900 bg-amber-200/90 border border-amber-300'
            : 'text-emerald-900 bg-emerald-200/90 border border-emerald-300'

    // helpers & validation
    const normPhone = (v) => v.replace(/[^\d+]/g, '') // keep digits and '+'
    const isPhoneValid = (p) => (p.replace(/\D/g, '').length >= 9)
    const canSend = Boolean(service && name.trim().length >= 2 && isPhoneValid(phone))
    const missingReason = (() => {
        if (!service) return { ar: 'اختر الخدمة', en: 'Select a service', fr: 'Choisissez un service', es: 'Elige un servicio' }[locale]
        if (!(name?.trim().length >= 2)) return { ar: 'أدخل الاسم (على الأقل حرفان)', en: 'Enter your name (min 2 chars)', fr: 'Entrez votre nom (min 2)', es: 'Introduce tu nombre (min 2)' }[locale]
        if (!isPhoneValid(phone)) return { ar: 'رقم هاتف غير صالح', en: 'Invalid phone number', fr: 'Numéro invalide', es: 'Número inválido' }[locale]
        return { ar: 'أكمل الحقول', en: 'Complete the fields', fr: 'Complétez les champs', es: 'Completa los campos' }[locale]
    })()

    // optional: prevent past dates
    const todayISO = new Date().toISOString().slice(0, 10)

    // localized weekday promo banner
    const weekday = new Date().getDay() // 0-6 Sun-Sat
    const promos = {
        ar: ['🌞 عروض الأحد', '💼 عروض الاثنين', '🛍️ عروض الثلاثاء', '🎟️ عروض الأربعاء', '✨ عروض الخميس', '✈️ عروض السفر!', '🏖️ عروض السبت'],
        en: ['🌞 Sunday Deals', '💼 Monday Deals', '🛍️ Tuesday Deals', '🎟️ Wednesday Deals', '✨ Thursday Deals', '✈️ Travel Offers!', '🏖️ Saturday Deals'],
        fr: ['🌞 Offres du dimanche', '💼 Offres du lundi', '🛍️ Offres du mardi', '🎟️ Offres du mercredi', '✨ Offres du jeudi', '✈️ Offres de voyage !', '🏖️ Offres du samedi'],
        es: ['🌞 Ofertas del domingo', '💼 Ofertas del lunes', '🛍️ Ofertas del martes', '🎟️ Ofertas del miércoles', '✨ Ofertas del jueves', '✈️ ¡Ofertas de viaje!', '🏖️ Ofertas del sábado']
    }
    const promoText = (promos[locale] || promos.ar)[weekday]

    // dynamic gradients based on locale and time of day
    const hour = new Date().getHours()
    const isNight = hour >= 19 || hour < 6
    const localeAccent = {
        ar: isNight ? 'from-blue-800 to-gray-800' : 'from-blue-600 to-blue-700',
        en: isNight ? 'from-indigo-700 to-slate-800' : 'from-indigo-600 to-indigo-700',
        fr: isNight ? 'from-sky-700 to-stone-800' : 'from-sky-600 to-sky-700',
        es: isNight ? 'from-orange-700 to-amber-700' : 'from-orange-600 to-orange-700'
    }[locale] || (isNight ? 'from-blue-800 to-gray-800' : 'from-blue-600 to-blue-700')
    const headerGradient = `bg-gradient-to-r ${localeAccent} text-white`
    const primaryBtnGradient = `bg-gradient-to-r ${localeAccent}`

    // build WhatsApp href with localized, well-formatted message
    const generateWhatsAppMessage = ({ service, destination, tickets, name, phone, date, locale }) => {
        const dict = {
            ar: {
                greeting: 'مرحبًا وكالة ناصر 👋',
                intent: 'أرغب في طلب حجز سريع بالمعلومات التالية:',
                sentFrom: '— تم الإرسال من الموقع',
                labels: {
                    service: 'الخدمة', destination: 'الوجهة', tickets: 'عدد التذاكر', name: 'الاسم', phone: 'رقم الهاتف', date: 'التاريخ المفضل'
                }
            },
            en: {
                greeting: 'Hello Agencia Nasser 👋',
                intent: "I'd like to request a quick booking with the following details:",
                sentFrom: '— Sent from the website',
                labels: {
                    service: 'Service', destination: 'Destination', tickets: 'Tickets', name: 'Name', phone: 'Phone', date: 'Preferred Date'
                }
            },
            fr: {
                greeting: 'Bonjour Agence Nasser 👋',
                intent: 'Je souhaite réserver rapidement avec les informations suivantes :',
                sentFrom: '— Envoyé depuis le site',
                labels: {
                    service: 'Service', destination: 'Destination', tickets: 'Billets', name: 'Nom', phone: 'Téléphone', date: 'Date souhaitée'
                }
            },
            es: {
                greeting: 'Hola Agencia Nasser 👋',
                intent: 'Quisiera reservar rápidamente con la siguiente información:',
                sentFrom: '— Enviado desde el sitio web',
                labels: {
                    service: 'Servicio', destination: 'Destino', tickets: 'Boletos', name: 'Nombre', phone: 'Teléfono', date: 'Fecha preferida'
                }
            }
        }

        const lang = dict[locale] || dict['ar']
        const formatNiceDate = (d) => {
            if (!d) return ''
            try { return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return d }
        }

        const lines = [
            lang.greeting,
            lang.intent,
            '',
            `• ${lang.labels.service}: ${service || '-'}`,
            `• ${lang.labels.destination}: ${destination || '-'}`,
            `• ${lang.labels.tickets}: ${tickets || 1}`,
            `• ${lang.labels.name}: ${name || '-'}`,
            `• ${lang.labels.phone}: ${phone || '-'}`,
            `• ${lang.labels.date}: ${date ? formatNiceDate(date) : '-'}`,
            '',
            lang.sentFrom
        ]
        return lines.join('\n')
    }

    const msgText = generateWhatsAppMessage({ service, destination, tickets, name, phone, date, locale })
    const waHref = `https://wa.me/34655742260?text=${encodeURIComponent(msgText)}`

    return (
        <>
            {/* زر صغير ثابت عند الحافة اليسرى يظهر عندما تكون النافذة مغلقة */}
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={`fixed z-50 text-white rounded-full shadow-lg px-4 py-2 text-sm font-semibold transition hover:brightness-110 ${locale === 'ar' ? 'right-4' : 'left-4'} bottom-24 md:bottom-28 ${headerGradient}`}
                    aria-label={t.quick}
                >
                    🎫 {t.quick}
                </button>
            )}

            {/* Backdrop overlay for mobile */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={close}
            />

            {/* Main Panel */}
            <div
                ref={panelRef}
                className={`
                    fixed z-50 transition-all duration-300 ease-in-out
                    ${open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-full'}
                    
                    md:opacity-100 md:translate-y-0 md:pointer-events-auto
                    ${open ? 'md:opacity-100' : 'md:opacity-0 md:pointer-events-none'}

                    /* Mobile styles: bottom sheet */
                    inset-x-0 bottom-0 md:inset-auto ${locale === 'ar' ? 'md:right-4' : 'md:left-4'} md:bottom-24
                `}
            >
                <div
                    className="
                        relative bg-white shadow-2xl border border-gray-200
                        flex flex-col
                        /* Mobile styles */
                        h-[80vh] rounded-t-2xl
                        /* Desktop styles */
                        md:h-auto md:max-h-[75vh] md:w-[280px] md:rounded-2xl
                    "
                >
                    {/* Header */}
                    <div className={`h-12 flex-shrink-0 flex items-center justify-between px-4 text-white ${headerGradient} rounded-t-2xl md:rounded-t-xl`}>
                        <span className="text-sm font-bold flex items-center gap-2">🎫 {t.quick}</span>
                        <button
                            type="button"
                            onClick={close}
                            aria-label="إغلاق"
                            className="h-7 w-7 grid place-items-center rounded-full bg-red-500/70 hover:bg-red-600 transition text-white"
                            title="إغلاق"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="p-4 bg-gray-50 space-y-3 overflow-y-auto">
                        {/* Promo banner */}
                        <div className={`rounded-xl text-[13px] px-3 py-2 font-semibold border animate-pulse flex items-center justify-between ${bannerColor}`}>
                            <span className="flex items-center gap-2">
                                <span className="inline-block animate-bounce">✈️</span>
                                <span>{ui.promoText}</span>
                            </span>
                            <span className={`text-[12px] rounded-md px-2.5 py-0.5 font-mono tabular-nums tracking-[0.02em] leading-none shadow-sm text-center w-[78px] ${chipColor}`}>
                                <svg
                                    className="mr-1 inline-block animate-spin w-4 h-4 md:w-5 md:h-5 text-rose-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M6 3h12M6 21h12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 3c0 4 4 4 4 8s-4 4-4 8M16 3c0 4-4 4-4 8s4 4 4 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {untilMidnight}
                            </span>
                        </div>
                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.serviceLabel}</label>
                            <select
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                            >
                                <option value="">{ui.servicePlaceholder}</option>
                                <option value="ferry">{ui.optionFerry}</option>
                                <option value="money">{ui.optionMoney}</option>
                                <option value="translation">{ui.optionTranslation}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.destinationLabel}</label>
                            <input
                                type="text"
                                placeholder={ui.destinationPlaceholder}
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.ticketsLabel}</label>
                            <input
                                type="number"
                                min={1}
                                step={1}
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={tickets}
                                onChange={(e) => setTickets(String(Math.max(1, parseInt(e.target.value || '1', 10))))}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.preferredDateLabel}</label>
                            <input
                                type="date"
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={todayISO}
                                placeholder={ui.datePlaceholder}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.nameLabel}</label>
                            <input
                                type="text"
                                placeholder={ui.namePlaceholder}
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold mb-1 text-gray-700">{ui.phoneLabel}</label>
                            <input
                                type="tel"
                                dir="ltr"
                                inputMode="tel"
                                placeholder={ui.phonePlaceholder}
                                className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={phone}
                                onChange={(e) => setPhone(normPhone(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2 pt-1">
                            <a
                                href={canSend ? waHref : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full h-9 rounded-xl text-[13px] font-bold grid place-items-center transition ${canSend ? 'text-white ' + primaryBtnGradient + ' hover:opacity-95 shadow' : 'text-white bg-gray-400/90 cursor-not-allowed'}`}
                                aria-disabled={!canSend}
                                title={canSend ? (
                                    { ar: 'إرسال عبر واتساب', en: 'Send via WhatsApp', fr: 'Envoyer via WhatsApp', es: 'Enviar por WhatsApp' }[locale]
                                ) : missingReason}
                                onClick={(e) => { if (!canSend) e.preventDefault() }}
                            >
                                💬 {{ ar: 'حجز سريع عبر واتساب', en: 'Quick booking via WhatsApp', fr: 'Réservation rapide via WhatsApp', es: 'Reserva rápida por WhatsApp' }[locale]}
                            </a>

                            <Link
                                href={`/${locale}/book`}
                                className="w-full h-9 rounded-xl text-[13px] font-bold text-white grid place-items-center
                           bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                onClick={close}
                            >
                                🎫 {t.detail}
                            </Link>

                            <div className="flex gap-2">
                                <Link href={`/${locale}/about`} className="flex-1 h-9 rounded-xl text-[12px] font-semibold grid place-items-center bg-yellow-400/90 hover:bg-yellow-400 text-slate-900" onClick={close}>
                                    ℹ️ {t.learn}
                                </Link>
                                <Link href={`/${locale}/contact`} className="flex-1 h-9 rounded-xl text-[12px] font-semibold grid place-items-center bg-gradient-to-r from-blue-600 to-orange-500 text-white" onClick={close}>
                                    📞 {t.contact}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
