// Custom social media icons since Heroicons doesn't include these
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 7.102.048 6.273.088 5.718.222 5.238.42a7.894 7.894 0 0 0-2.357 1.434A7.894 7.894 0 0 0 .42 4.238C.222 4.718.087 5.274.048 6.101.01 6.929 0 7.396 0 12.017c0 4.624.01 5.09.048 5.918.04.83.174 1.383.372 1.861.2.777.478 1.477.923 2.357.444.879 1.070 1.723 1.856 2.508.784.784 1.629 1.410 2.508 1.856.88.445 1.58.723 2.357.923.478.198 1.032.333 1.861.372C6.929 23.99 7.396 24 12.017 24c4.624 0 5.09-.01 5.918-.048.83-.04 1.383-.174 1.861-.372a7.894 7.894 0 0 0 2.357-.923 7.894 7.894 0 0 0 1.856-2.508c.445-.88.723-1.58.923-2.357.198-.478.333-1.032.372-1.861C23.99 17.107 24 16.64 24 12.017c0-4.624-.01-5.09-.048-5.918-.04-.83-.174-1.383-.372-1.861a7.894 7.894 0 0 0-.923-2.357A7.894 7.894 0 0 0 20.149.881 7.894 7.894 0 0 0 17.792.42C17.312.222 16.758.087 15.929.048 15.101.01 14.634 0 10.017 0h2zm-.152 5.4a6.617 6.617 0 1 1 0 13.234 6.617 6.617 0 0 1 0-13.234zm0 2.25a4.367 4.367 0 1 0 0 8.734 4.367 4.367 0 0 0 0-8.734zm6.988-2.882a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1z" clipRule="evenodd" />
  </svg>
)

const TikTokIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export default function MapAndSocial() {
  // Google Maps embed URL for the specific location
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.8!2d-2.4637!3d36.8408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7a9f1c8b8b8b8b%3A0x1234567890abcdef!2sC.%20Real%2094%2C%2004002%20Almer%C3%ADa%2C%20Spain!5e0!3m2!1sen!2ses!4v1234567890123!5m2!1sen!2ses"

  const socialLinks = [
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: '#',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: '#',
      color: 'text-pink-600 hover:text-pink-700'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      href: '#',
      color: 'text-black hover:text-gray-800'
    }
  ]

  return (
    <div className="flex flex-col lg:flex-col-reverse lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
      {/* Map Section */}
      <div className="w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
          <iframe
            src={mapSrc}
            className="w-full h-64 md:h-96 max-w-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - C. Real 94, 04002 Almería"
          ></iframe>
        </div>
      </div>

      {/* Social Icons Section */}
      <div className="w-full">
        <div className="flex space-x-4 sm:space-x-8">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon
            return (
              <div key={social.name} className="w-1/3">
                <a
                  href={social.href}
                  className={`flex items-center justify-center p-4 rounded-md bg-white/50 transition duration-200 hover:bg-white/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${social.color}`}
                  aria-label={`Visit our ${social.name} page`}
                >
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
