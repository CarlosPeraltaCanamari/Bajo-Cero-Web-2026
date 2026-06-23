import Image from 'next/image'
import Link from 'next/link'
import HomeAnimations from '@/components/home/HomeAnimations'
import { Comfortaa } from 'next/font/google'

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Agua a Domicilio en Sucre y Santa Cruz | Bajo Cero Agua Purificada',
  description: 'Pedido y recarga de agua purificada de mesa a domicilio en Sucre y Santa Cruz de la Sierra. Distribución rápida de bidones de 20 litros con envío gratis.',
  keywords: ['agua en sucre', 'agua en santa cruz', 'agua a domicilio sucre', 'agua a domicilio santa cruz', 'agua purificada bolivia', 'bidones de agua sucre', 'bajo cero agua', 'agua de mesa santa cruz'],
  openGraph: {
    title: 'Agua a Domicilio en Sucre y Santa Cruz | Bajo Cero Agua Purificada',
    description: 'Pedido y recarga de agua purificada de mesa a domicilio en Sucre y Santa Cruz de la Sierra. Distribución rápida de bidones de 20 litros con envío gratis.',
    url: 'https://bajo-cero-web.vercel.app',
    siteName: 'Bajo Cero',
    locale: 'es_BO',
    type: 'website',
  },
}

export default function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Bajo Cero',
        alternateName: ['Bajo Cero Agua Purificada', 'Agua Bajo Cero'],
        url: 'https://bajo-cero-web.vercel.app',
    }

    return (
        <main style={{ background: '#020b18' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <video
                    src="/SVG BajoCero/bajocerovideo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/80" />

                {/* Anime.js Background Bubbles & Animation Trigger */}
                <HomeAnimations />

                <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16">
                    <p className="anime-hero-subtitle text-white/50 text-xs uppercase tracking-[6px] mb-6 font-medium">
                        Bolivia · Agua Purificada a Domicilio
                    </p>
                    <h1
                        className={`anime-hero-title text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight bg-linear-to-b from-white via-slate-100 to-sky-200 bg-clip-text text-transparent filter drop-shadow-[0_4px_20px_rgba(168,212,224,0.25)] ${comfortaa.className}`}
                        style={{ opacity: 0 }}
                    >
                        bajo cero
                    </h1>
                    <p className="anime-hero-desc text-white/60 text-base md:text-lg mb-10 max-w-md leading-relaxed" style={{ opacity: 0 }}>
                        Pureza desde las alturas de Bolivia. Agua purificada de alta calidad directa a tu hogar u oficina en Sucre y Santa Cruz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/catalogo" className="anime-hero-cta glass px-8 py-3.5 rounded-full text-white text-sm font-semibold hover:bg-white/15 transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap min-w-[180px] hover:scale-105 hover:border-white/30 hover:shadow-lg hover:shadow-white/5" style={{ opacity: 0 }}>
                            Ver catálogo
                        </Link>
                        <Link href="/mayorista" className="anime-hero-cta px-8 py-3.5 rounded-full text-white text-sm font-semibold bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-orange-500/20 inline-flex items-center justify-center whitespace-nowrap min-w-[180px] hover:scale-105 hover:shadow-orange-500/35" style={{ opacity: 0 }}>
                            Comprar al por mayor
                        </Link>
                    </div>
                </div>

            </section>

        </main>
    )
}