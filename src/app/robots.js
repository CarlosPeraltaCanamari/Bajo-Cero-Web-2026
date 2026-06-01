export default function robots() {
  const baseUrl = 'https://bajo-cero-web.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/carrito', '/checkout', '/pedidos/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
