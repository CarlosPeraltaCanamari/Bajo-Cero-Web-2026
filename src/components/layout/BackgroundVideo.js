'use client'

import { usePathname } from 'next/navigation'

export default function BackgroundVideo() {
  const pathname = usePathname()

  // No renderizar el video de fondo general en la página de inicio (landing page)
  if (pathname === '/') {
    return null
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <video
        src="/SVG BajoCero/bajocerovideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', scale: '1.05' }}
      />
      {/* Overlay oscuro para una legibilidad superior de textos y tarjetas glass */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2, 11, 24, 0.85) 0%, rgba(2, 11, 24, 0.92) 100%)' }} />
    </div>
  )
}
