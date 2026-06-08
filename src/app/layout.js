import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/carrito/CartDrawer'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  metadataBase: new URL('https://bajo-cero-web.vercel.app'),
  title: {
    default: 'Bajo Cero',
    template: '%s | Bajo Cero',
  },
  description: 'Agua purificada con entrega a domicilio en Bolivia',
  icons: {
    icon: '/bajocerologo.png',
    shortcut: '/bajocerologo.png',
    apple: '/bajocerologo.png',
  },
  openGraph: {
    siteName: 'Bajo Cero',
    title: 'Bajo Cero',
    description: 'Agua purificada con entrega a domicilio en Bolivia',
    url: 'https://bajo-cero-web.vercel.app',
    locale: 'es_BO',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${nunito.variable} flex flex-col min-h-screen`}>
        <Navbar />
        <CartDrawer />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}