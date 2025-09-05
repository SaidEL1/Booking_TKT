'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getTranslation } from '../lib/translations';

/* ===== Cookies utils ===== */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(`${name}=`) === 0) {
            return c.substring(name.length + 1, c.length);
        }
    }
    return '';
}

const COOKIE_MODAL_KEY = 'bookingModalSeen7d';
const COOKIE_OPEN_KEY = 'bookingLauncherOpen';
const WA_NUMBER = '+34614459952';

/* ===== Promo utils ===== */
const getPromoMessage = (locale, t) => {
    const day = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const promo = t('promo') || {};
    return promo[day] || '';
};

/* ===== Component ===== */
export default function BookingLauncherLeft({ locale = 'ar' }) {
    const t = getTranslation(locale, 'BookingLauncherLeft');
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    // State for form fields
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Promo message based on current day and locale
    const promoMessage = useMemo(() => getPromoMessage(locale, t), [locale, t]);

    // Dynamic background gradient
    const grad = useMemo(() => {
        const colors = ['from-blue-500 to-cyan-400', 'from-green-500 to-teal-400', 'from-purple-500 to-indigo-400'];
        return colors[new Date().getDay() % colors.length];
    }, []);

    // خيارات الخدمة (label حسب اللغة)
    const services = useMemo(() => ([
        { value: 'ferry', label: t('serviceFerry') },
        { value: 'money', label: t('serviceMoney') },
        { value: 'translation', label: t('serviceTranslation') },
    ]), [t]);

    const serviceLabel = useMemo(() => {
        const s = services.find(x => x.value === service);
        return s ? s.label : '';
    }, [service, services]);

    // WhatsApp message logic
    const waText = useMemo(() => {
        const msgs = {
            ar: (s, d, n, p) => `مرحبًا، أرغب في حجز خدمة *${s}* ${d ? `لتاريخ *${d}*` : ''}. اسمي *${n}* ورقم هاتفي *${p}*.`,
            en: (s, d, n, p) => `Hello, I'd like to book the *${s}* service ${d ? `for the date *${d}*` : ''}. My name is *${n}* and my phone is *${p}*.`,
            fr: (s, d, n, p) => `Bonjour, je voudrais réserver le service *${s}* ${d ? `pour la date *${d}*` : ''}. Mon nom est *${n}* et mon téléphone est *${p}*.`,
            es: (s, d, n, p) => `Hola, quiero reservar el servicio *${s}* ${d ? `para la fecha *${d}*` : ''}. Mi nombre es *${n}* y mi teléfono es *${p}*.`,
        };
        const msgFn = msgs[locale] || msgs.en;
        const formattedDate = date ? new Date(date).toLocaleDateString(locale) : '';
        return encodeURIComponent(msgFn(serviceLabel, formattedDate, name, phone));
    }, [serviceLabel, date, name, phone, locale]);

    const canSend = useMemo(() => service && name && phone && phone.length >= 8, [service, name, phone]);

    const openPanel = useCallback(() => {
        setOpen(true);
    }, []);

    const close = () => setOpen(false);

    useEffect(() => {
        if (getCookie(COOKIE_MODAL_KEY) !== '1') {
            const timer = setTimeout(() => {
                setOpen(true);
                setCookie(COOKIE_MODAL_KEY, '1', 7);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [openPanel]);

    // تنظيف رقم الهاتف المدخل (اختياري)
    const normPhone = (v) => v.replace(/[^0-9+]/g, '');

    return (
        <>
            {!open && (
                <button
                    onClick={openPanel}
                    className={`fixed left-3 bottom-24 md:left-4 md:bottom-28 z-50 text-white rounded-full shadow-lg px-4 py-2 text-sm font-semibold hover:brightness-110 transition ${grad}`}
                    aria-label={t('quickBooking')}
                >
                    {t('quickBooking')}
                </button>
            )}

            {open && (
                <div
                    ref={panelRef}
                    className="fixed left-1/2 -translate-x-1/2 bottom-5 md:left-4 md:translate-x-0 z-50 transition-transform duration-300 ease-out transform scale-100"
                >
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-200 w-[86vw] max-w-[18rem] md:w-72 overflow-hidden">
                        {/* Header بنفس التدرّج الديناميكي */}
                        <div className={`h-12 flex items-center justify-between px-3 text-white ${grad}`}>
                            <span className="text-sm font-bold flex items-center gap-2">{t('quickBooking')}</span>
                            <button
                                onClick={close}
                                aria-label={t('close')}
                                className="w-7 h-7 rounded-full bg-black/20 text-white text-lg font-bold grid place-items-center hover:bg-black/40 transition"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Promo banner */}
                        {promoMessage && (
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-3 py-2 text-[11px] font-semibold">
                                {promoMessage}
                            </div>
                        )}

                        {/* Form body */}
                        <div className="p-3 space-y-2">

                            {/* الحقول */}
                            <div>
                                <label className="block text-[12px] font-semibold mb-1 text-gray-700">{t('selectService')}</label>
                                <select
                                    className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                >
                                    <option value="">{t('selectServicePlaceholder')}</option>
                                    {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[12px] font-semibold mb-1 text-gray-700">{t('preferredDate')}</label>
                                <input
                                    type="date"
                                    className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-semibold mb-1 text-gray-700">{t('name')}</label>
                                <input
                                    type="text"
                                    placeholder={t('namePlaceholder')}
                                    className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-semibold mb-1 text-gray-700">{t('phoneNumber')}</label>
                                <input
                                    type="tel"
                                    placeholder={t('phonePlaceholder')}
                                    className="w-full h-9 px-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={phone}
                                    onChange={(e) => setPhone(normPhone(e.target.value))}
                                />
                            </div>

                            {/* الأزرار */}
                            <a
                                href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full h-9 rounded-xl text-[13px] font-bold text-white grid place-items-center transition ${canSend ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                aria-disabled={!canSend}
                                onClick={(e) => { if (!canSend) e.preventDefault() }}
                                title={canSend ? t('whatsappBooking') : t('completeFields')}
                            >
                                {t('whatsappBooking')}
                            </a>

                            {/* زر حجز مفصل بنفس التدرّج الديناميكي */}
                            <Link
                                href={`/${locale}/booking`}
                                className={`w-full h-9 rounded-xl text-[13px] font-bold text-white grid place-items-center hover:brightness-110 transition ${grad}`}
                                onClick={close}
                            >
                                {t('detailedBooking')}
                            </Link>

                            <div className="flex gap-2">
                                <Link href={`/${locale}/about`} className="flex-1 h-9 rounded-xl text-[12px] font-semibold grid place-items-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:brightness-110" onClick={close}>
                                    {t('learnMore')}
                                </Link>
                                <Link href={`/${locale}/contact`} className="flex-1 h-9 rounded-xl text-[12px] font-semibold grid place-items-center text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:brightness-110" onClick={close}>
                                    {t('contactUs')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
