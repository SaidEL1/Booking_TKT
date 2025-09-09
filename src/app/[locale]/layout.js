import '../globals.css';
import { getTranslation } from '../../lib/translations';
import AOSWrapper from '../../components/AOSWrapper';

// Metadata by language
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const currentLocale = locale || 'ar';

  const titles = {
    ar: 'وكالة ناصر للسفريات - حجز تذاكر، تحويل أموال، ترجمة',
    en: 'Nasser Travel Agency - Bookings, Money Transfer, Translation',
    fr: 'Agence de Voyages Nasser - Réservations, Transfert d\'Argent, Traduction',
    es: 'Agencia de Viajes Nasser - Reservas, Transferencia de Dinero, Traducción'
  };

  const descriptions = {
    ar: 'وكالة ناصر للسفريات في ألميريا، إسبانيا. نقدم خدمات حجز تذاكر العبارات، تحويل الأموال، وخدمات الترجمة المعتمدة. موثوقية وأمان في كل معاملة.',
    en: 'Nasser Travel Agency in Almería, Spain. We offer ferry ticket bookings, money transfers, and certified translation services. Reliability and security in every transaction.',
    fr: 'Agence de Voyages Nasser à Almería, Espagne. Nous proposons des réservations de billets de ferry, des transferts d\'argent et des services de traduction certifiée. Fiabilité et sécurité à chaque transaction.',
    es: 'Agencia de Viajes Nasser en Almería, España. Ofrecemos reservas de billetes de ferry, transferencias de dinero y servicios de traducción jurada. Fiabilidad y seguridad en cada transacción.'
  };

  return {
    title: titles[currentLocale] || titles.ar,
    description: descriptions[currentLocale] || descriptions.ar
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const currentLocale = locale || 'ar';
  const isRTL = currentLocale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <AOSWrapper>
        {children}
      </AOSWrapper>
    </div>
  );
}
