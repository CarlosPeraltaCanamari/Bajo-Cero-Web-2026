import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  title: 'Bajo Cero — Agua Premium',
  description: 'Agua purificada premium con entrega a domicilio en Bolivia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${nunito.variable} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}