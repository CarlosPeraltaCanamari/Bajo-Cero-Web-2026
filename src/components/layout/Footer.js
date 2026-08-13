import Link from 'next/link'

export default function Footer() {
    const year = new Date().getFullYear()
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

    const links = [
        { href: '/', label: 'Inicio' },
        { href: '/catalogo', label: 'Catálogo' },
        { href: '/envios', label: 'Envíos' },
        { href: '/mayorista', label: 'Mayorista' },
        { href: '/pedidos', label: 'Mis pedidos' },
    ]

    return (
        <footer style={{ position: 'relative', zIndex: 10, background: '#080808', color: 'white' }}>

            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)',
            }} />

            <div style={{ maxWidth: '960px', margin: '0 auto' }} className="container-responsive footer-padding">
                <div className="grid-responsive-3col">

                    {/* Brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, color: 'white' }}>
                            bajo cero
                        </span>
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.3)', maxWidth: '180px' }}>
                            Agua purificada de mesa. Frescura directa a tu puerta.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0
                            }} />
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                                Entregando en Sucre y Santa Cruz
                            </span>
                        </div>
                    </div>

                    {/* Sitio */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3 style={{
                            fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                            textTransform: 'uppercase', color: 'var(--color-bc-orange-gold)',
                            marginBottom: '6px'
                        }}>
                            Sitio
                        </h3>
                        {links.map(({ href, label }) => (
                            <Link key={href} href={href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', width: 'fit-content' }}
                                className="hover:text-white transition-colors duration-200">
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Contacto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3 style={{
                            fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                            textTransform: 'uppercase', color: 'var(--color-bc-orange-gold)',
                            marginBottom: '6px'
                        }}>
                            Contacto
                        </h3>

                        <a href="mailto:info@bajocero.bo"
                            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
                            className="hover:text-white transition-colors duration-200">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            info@bajocero.bo
                        </a>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Sucre / Santa Cruz, Bolivia
                        </span>
                    </div>

                </div>
            </div>

            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)',
            }} />

            <div style={{ maxWidth: '960px', margin: '0 auto' }} className="container-responsive footer-bottom-padding flex flex-col md:flex-row justify-between items-center gap-2">
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>© {year} Bajo Cero®</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>Hecho con ❄️ en Bolivia</p>
            </div>

        </footer>
    )
}