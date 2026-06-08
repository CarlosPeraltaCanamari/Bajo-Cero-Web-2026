import Image from 'next/image'
import Link from 'next/link'
import HomeAnimations from '@/components/home/HomeAnimations'
import { Comfortaa } from 'next/font/google'

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Agua a Domicilio en Sucre y Santa Cruz | Bajo Cero Agua Premium',
  description: 'Pedido y recarga de agua purificada de mesa a domicilio en Sucre y Santa Cruz de la Sierra. Distribución rápida de bidones de 20 litros con envío gratis.',
  keywords: ['agua en sucre', 'agua en santa cruz', 'agua a domicilio sucre', 'agua a domicilio santa cruz', 'agua purificada bolivia', 'bidones de agua sucre', 'bajo cero agua', 'agua de mesa santa cruz'],
  openGraph: {
    title: 'Agua a Domicilio en Sucre y Santa Cruz | Bajo Cero Agua Premium',
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
        alternateName: ['Bajo Cero Agua Premium', 'Agua Bajo Cero'],
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
                        Bolivia · Agua Premium a Domicilio
                    </p>
                    <h1
                        className={`anime-hero-title text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight ${comfortaa.className}`}
                        style={{ opacity: 0 }}
                    >
                        bajo cero
                    </h1>
                    <p className="anime-hero-desc text-white/60 text-base md:text-lg mb-10 max-w-md leading-relaxed" style={{ opacity: 0 }}>
                        Pureza desde las alturas de Bolivia. Agua purificada de alta calidad directa a tu hogar u oficina en Sucre y Santa Cruz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/catalogo" className="anime-hero-cta glass px-7 py-3 rounded-full text-white text-sm font-semibold hover:bg-white/15 transition-all duration-300" style={{ opacity: 0 }}>
                            Ver catálogo
                        </Link>
                        <Link href="/mayorista" className="anime-hero-cta px-7 py-3 rounded-full text-white text-sm font-semibold bg-bc-orange hover:bg-bc-orange-dark transition-all duration-300 shadow-lg shadow-orange-500/20" style={{ opacity: 0 }}>
                            Comprar al por mayor
                        </Link>
                    </div>
                </div>

                <div className="anime-hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
                    <span className="text-white/30 text-[10px] tracking-[4px] uppercase">scroll</span>
                    <div className="anime-hero-scroll-line w-px h-10 bg-linear-to-b from-white/30 to-transparent" />
                </div>
            </section>

            {/* STATS — fondo azul agua oscuro */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #020b18 0%, #081a30 100%)',
            }} className="section-py-stats container-responsive overflow-hidden">
                {/* Glow azul agua */}
                <div style={{
                    position: 'absolute', top: '-40px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px', height: '200px',
                    background: 'radial-gradient(ellipse, rgba(44,95,122,0.35) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                {/* Mosaico grid */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: `linear-gradient(rgba(123,184,200,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(123,184,200,0.8) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />

                <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
                    <div className="grid-responsive-4col">
                        {[
                            { num: '15+', label: 'Años de experiencia' },
                            { num: '50K', label: 'Clientes satisfechos' },
                            { num: '100%', label: 'Pureza garantizada' },
                            { num: '24h', label: 'Entrega rápida' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ textAlign: 'center' }} className="flex flex-col items-center gap-2 stats-item-padding border-white/10 even:border-l md:border-l md:first:border-l-0">
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, color: '#A8D4E0', lineHeight: 1 }}>
                                    {s.num}
                                </span>
                                <span style={{ fontSize: '11px', color: 'rgba(168,212,224,0.45)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Separador */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(123,184,200,0.15) 30%, rgba(123,184,200,0.15) 70%, transparent)' }} />

            {/* BENEFICIOS — fondo con tono arena/rosado */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #081a30 0%, #07101b 50%, #040c16 100%)',
            }} className="anime-benefits-trigger section-py-large container-responsive overflow-hidden">
                {/* Glow rosado atardecer en esquina */}
                <div style={{
                    position: 'absolute', top: '0', right: '-100px',
                    width: '500px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(232,180,160,0.07) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }} />
                {/* Glow azul izquierda */}
                <div style={{
                    position: 'absolute', bottom: '0', left: '-80px',
                    width: '400px', height: '300px',
                    background: 'radial-gradient(ellipse, rgba(44,95,122,0.15) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }} />
                {/* Mosaico puntos */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.03,
                    backgroundImage: `radial-gradient(rgba(168,212,224,0.9) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }} />

                <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(168,212,224,0.4)', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>
                        Agua Purificada de Mesa en Sucre y Santa Cruz
                    </p>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '48px' }}>
                        Calidad que se siente
                    </h2>

                    <div className="grid-responsive-3col">
                        {[
                            { icon: '❄️', title: 'Pureza Garantizada', desc: 'Agua purificada mediante microfiltración y ósmosis inversa. El 99.9% de las impurezas eliminadas.' },
                            { icon: '🚚', title: 'Envío Gratis en 24h', desc: 'Distribución y reparto a domicilio rápido en Sucre y Santa Cruz de la Sierra sin costo adicional.' },
                            { icon: '💧', title: 'Agua de Mesa Premium', desc: 'Ideal para hidratación diaria en hogares y oficinas. Un sabor ligero y pureza que cuida tu salud.' },
                        ].map((item) => (
                            <div key={item.title} style={{
                                background: 'rgba(123,184,200,0.05)',
                                border: '1px solid rgba(123,184,200,0.1)',
                                borderRadius: '20px',
                                display: 'flex', flexDirection: 'column', gap: '12px',
                                transition: 'all 0.3s',
                            }} className="anime-benefit-card card-benefit-padding hover:bg-white/5">
                                <span style={{ fontSize: '32px', lineHeight: 1 }}>{item.icon}</span>
                                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{item.title}</h3>
                                <p style={{ color: 'rgba(168,212,224,0.45)', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Separador */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,180,160,0.12) 30%, rgba(232,180,160,0.12) 70%, transparent)' }} />

            {/* CTA MAYORISTA — tono arena cálido */}
            <section style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #040c16 0%, #02070f 100%)',
            }} className="anime-cta-trigger section-py-large container-responsive overflow-hidden">
                {/* Glow arena/rosado */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px', height: '400px',
                    background: 'radial-gradient(ellipse, rgba(196,168,130,0.07) 0%, rgba(232,180,160,0.05) 40%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                {/* Mosaico diagonal */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.025,
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(196,168,130,0.6) 0px, rgba(196,168,130,0.6) 1px, transparent 1px, transparent 28px)`,
                }} />
                {/* Glow naranja CTA */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px', height: '200px',
                    background: 'radial-gradient(ellipse, rgba(220,120,40,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
                    <div style={{
                        background: 'rgba(123,184,200,0.04)',
                        border: '1px solid rgba(196,168,130,0.15)',
                        borderRadius: '28px',
                    }} className="anime-cta-card card-py-cta">
                        <p style={{ fontSize: '10px', color: 'rgba(196,168,130,0.5)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
                            Empresas y distribuidores
                        </p>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.1 }}>
                            ¿Tienes un negocio?
                        </h2>
                        <p style={{ color: 'rgba(196,168,130,0.5)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7 }}>
                            Precios especiales para compras al por mayor.<br />Hasta 45% de descuento según volumen.
                        </p>
                        <Link href="/mayorista" style={{
                            display: 'inline-block', padding: '12px 32px',
                            background: 'var(--color-bc-orange)', color: 'white',
                            fontWeight: 600, fontSize: '14px', borderRadius: '999px',
                            textDecoration: 'none',
                            boxShadow: '0 8px 32px rgba(220,120,40,0.3)',
                        }} className="hover:opacity-90 transition-opacity">
                            Quiero precios mayoristas
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    )
}