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
        <footer style={{ background: '#080808', color: 'white' }}>

            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)',
            }} />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '56px 48px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '48px' }}>

                    {/* Brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, color: 'white' }}>
                            bajo cero
                        </span>
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.3)', maxWidth: '180px' }}>
                            Agua purificada premium. Frescura directa a tu puerta.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0
                            }} />
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                                Entregando en La Paz
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
                        <a href={'https://wa.me/' + whatsapp} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}
                            className="hover:text-white transition-colors duration-200">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                        </a>
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
                            La Paz, Bolivia
                        </span>
                    </div>

                </div>
            </div>

            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)',
            }} />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>© {year} Bajo Cero®</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>Hecho con ❄️ en Bolivia</p>
            </div>

        </footer>
    )
}