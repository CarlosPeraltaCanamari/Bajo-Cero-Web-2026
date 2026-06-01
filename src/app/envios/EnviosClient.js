'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Truck, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ShoppingBag, 
  MessageSquare
} from 'lucide-react'

export default function EnviosClient() {
  const coverageSucre = [
    'Centro Histórico',
    'Zona Alta (La Madona / Santa Ana)',
    'Zona Garcilazo',
    'El Rollo',
    'Barrio Petrolero',
    'Zona Cementerio',
    'Zona Mesa Verde'
  ]

  const coverageSantaCruz = [
    'Equipetrol',
    'Las Palmas',
    'Centro / Casco Viejo',
    'Urbarí',
    'Zona Norte (Radial 26 / Av. Banzer)',
    'Zona Sur',
    'Zona Este (Plan 3000 / Av. Virgen de Cotoca)',
    'Zona Oeste (Doble Vía La Guardia)'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '80px',
      background: '#07100F',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glows premium de fondo */}
      <div style={{
        position: 'absolute', top: '-100px', left: '20%',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,74,143,0.18) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '15%',
        width: '500px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }} className="px-4 sm:px-10">
        
        {/* ── ENCABEZADO HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '700px', margin: '0 auto 64px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(220, 120, 40, 0.12)',
              border: '1px solid rgba(220, 120, 40, 0.2)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '20px'
            }}
          >
            <Truck size={14} color="var(--color-bc-orange)" />
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-bc-orange)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Envíos y Distribución de Agua
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(36px, 5vw, 52px)', 
              fontWeight: 900, 
              color: 'white', 
              marginBottom: '16px', 
              lineHeight: 1.1, 
              letterSpacing: '-1px' 
            }}
          >
            Nuestra Cobertura de Entrega
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.7 }}
          >
            Operamos con distribución directa en las ciudades de **Sucre** y **Santa Cruz de la Sierra**. 
            Llevamos agua premium purificada directo a tu hogar, oficina o negocio sin costo de envío.
          </motion.p>
        </div>

        {/* ── COBERTURA POR CIUDAD ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ marginBottom: '72px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Sucre */}
          <motion.div 
            variants={itemVariants}
            className="glass" 
            style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 74, 143, 0.15)', color: '#A8D4E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Sucre</h2>
                <span style={{ fontSize: '11px', color: 'rgba(52,211,153,0.8)', fontWeight: 600 }}>Envío Gratis · Despacho en 24h</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
              Abastecemos diariamente a la Ciudad Blanca. El pedido de agua purificada se entrega en la dirección indicada al día siguiente de su confirmación.
            </p>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Zonas de Cobertura Activa:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-4">
                {coverageSucre.map((zone) => (
                  <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-bc-orange)' }} />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Santa Cruz */}
          <motion.div 
            variants={itemVariants}
            className="glass" 
            style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 74, 143, 0.15)', color: '#A8D4E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Santa Cruz de la Sierra</h2>
                <span style={{ fontSize: '11px', color: 'rgba(52,211,153,0.8)', fontWeight: 600 }}>Envío Gratis · Despacho en 24h</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
              Atendemos de forma directa en las principales zonas residenciales y comerciales de Santa Cruz, manteniendo tu hidratación con bidones de agua purificada de mesa.
            </p>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Zonas de Cobertura Activa:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-4">
                {coverageSantaCruz.map((zone) => (
                  <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-bc-orange)' }} />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── HORARIOS Y POLÍTICAS ── */}
        <div style={{ marginBottom: '72px', alignItems: 'stretch' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] gap-10">
          
          {/* Horarios (Izquierda) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass" 
            style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--color-bc-orange)" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Horarios y Tiempos de Entrega</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
              Garantizamos la frescura de nuestro servicio planificando las rutas de entrega diariamente:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { dia: 'Lunes a Viernes', horas: 'Turno Mañana (08:30 - 12:30) / Turno Tarde (14:00 - 18:30)' },
                { dia: 'Sábados', horas: 'Turno Único (09:00 - 14:00)' },
                { dia: 'Domingos y Feriados', horas: 'Cerrado (despachos de emergencia previa coordinación corporativa)' },
              ].map((item) => (
                <div key={item.dia} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'white' }}>{item.dia}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.horas}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Políticas de Seguridad (Derecha) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass" 
            style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="var(--color-bc-orange)" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Garantía de Entrega</h3>
              </div>
              <ul style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1.6, margin: 0 }}>
                <li><strong style={{ color: 'white' }}>Sanitización</strong>: Todos nuestros bidones pasan por un riguroso proceso de desinfección externa justo antes de ser cargados y entregados en tu dirección.</li>
                <li><strong style={{ color: 'white' }}>Repartidores Certificados</strong>: Nuestro personal cuenta con credenciales y capacitación para manipulación segura de alimentos.</li>
                <li><strong style={{ color: 'white' }}>Pago Seguro</strong>: Tienes la opción de pagar a contraentrega en efectivo o mediante código QR Simple al recibir tu producto.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(0,74,143,0.1)', border: '1px solid rgba(0,74,143,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
              <Calendar size={18} color="var(--color-bc-blue)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>Pedidos realizados antes de las 18:00 se programan para el turno de la mañana del día siguiente.</span>
            </div>
          </motion.div>
        </div>

        {/* ── CÓMO FUNCIONA ── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
            El Proceso de tu Pedido
          </h3>
          <div style={{ width: '40px', height: '1.5px', background: 'var(--color-bc-orange)', margin: '0 auto' }} />
        </div>

        <div style={{ marginBottom: '80px' }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { step: '01', title: 'Pides en la Web', desc: 'Elige tu agua Bajo Cero y completa la dirección en el Checkout.' },
            { step: '02', title: 'Confirmación Express', desc: 'Te contactamos inmediatamente por WhatsApp para confirmar la fecha y el turno.' },
            { step: '03', title: 'Recibes y Disfrutas', desc: 'Entregamos tu agua sellada y sanitizada en tu puerta. ¡Pagas al recibir!' },
          ].map((item) => (
            <div key={item.step} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '28px', position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900, color: 'rgba(168,212,224,0.08)', position: 'absolute', top: '16px', right: '20px', lineHeight: 1 }}>{item.step}</span>
              <h4 style={{ color: 'white', fontWeight: 800, fontSize: '15px', marginTop: '16px', marginBottom: '10px' }}>{item.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── CALL TO ACTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ 
            background: 'linear-gradient(135deg, rgba(0,74,143,0.15) 0%, rgba(220,120,40,0.08) 100%)',
            border: '1px solid rgba(168,212,224,0.15)',
            borderRadius: '28px',
            padding: '48px',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>¿Listo para pedir tu Agua Premium?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Accede a nuestro catálogo de pureza y realiza tu primer pedido en menos de dos minutos. Envíos gratis en Sucre y Santa Cruz.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/catalogo" style={{
              height: '46px', padding: '0 32px', borderRadius: '999px',
              background: 'var(--color-bc-orange)', color: 'white',
              fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 8px 24px rgba(220,120,40,0.25)',
              transition: 'all 0.2s', cursor: 'pointer'
            }} className="hover:opacity-90 active:scale-98">
              <ShoppingBag size={14} />
              Ir al Catálogo
            </Link>
            <a 
              href="https://wa.me/59171808300"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: '46px', padding: '0 32px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.06)', color: 'white',
                fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s', cursor: 'pointer'
              }} className="hover:bg-white/12 active:scale-98"
            >
              <MessageSquare size={14} />
              Contacto WhatsApp
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  )
}
