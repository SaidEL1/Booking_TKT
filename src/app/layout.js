import './globals.css'
import WhatsAppButton from '../components/WhatsAppButton'

export const metadata = {
  title: 'Ticket Booking System',
  description: 'Multilingual ticket booking application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
