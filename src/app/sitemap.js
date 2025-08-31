export default function sitemap() {
  const baseUrl = 'https://agencianasseralmeria.com'
  const locales = ['ar', 'en', 'fr', 'es']
  const pages = ['', '/about', '/contact', '/book']
  
  const urls = []
  
  // Add root redirect
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  // Add all locale/page combinations
  locales.forEach(locale => {
    pages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 0.9 : 0.8,
      })
    })
  })
  
  return urls
}
