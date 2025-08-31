export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/', '/data/'],
    },
    sitemap: 'https://agencianasseralmeria.com/sitemap.xml',
  }
}
