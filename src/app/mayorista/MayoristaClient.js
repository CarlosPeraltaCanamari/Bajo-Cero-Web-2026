'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { 
  Building2, 
  CheckCircle2, 
  Calculator, 
  MessageSquare, 
  Percent, 
  Truck, 
  ArrowRight, 
  Droplet, 
  Mail, 
  Phone, 
  User, 
  Store,
  ChevronRight
} from 'lucide-react'

// Productos disponibles para el cálculo de mayoristas
const PRODUCTOS_CALCULADORA = [
  { id: '1', nombre: 'Bidón de Agua Premium 20L', precio: 20.00, desc: 'Ideal para oficinas y hogares' },
  { id: '2', nombre: 'Botella de Agua Premium 2L', precio: 6.00, desc: 'Formato familiar de consumo diario' },
  { id: '3', nombre: 'Botella de Agua Premium 500ml', precio: 3.00, desc: 'Práctica para eventos y personal' },
  { id: '4', nombre: 'Pack de 6 Botellas 2L', precio: 32.00, desc: 'Empaque termocontraíble ideal para retail' }
]

export default function MayoristaClient() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(PRODUCTOS_CALCULADORA[0])
  const [cantidad, setCantidad] = useState(48) // Por defecto empezamos con escala de descuento
  const [formNombre, setFormNombre] = useState('')
  const [formEmpresa, setFormEmpresa] = useState('')
  const [formTelefono, setFormTelefono] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formVolumen, setFormVolumen] = useState('24-48')
  const [formMensaje, setFormMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Obtener descuentos de variables de entorno con fallbacks seguros
  const desc24 = Number(process.env.NEXT_PUBLIC_DESC_MAYOR_24 || 25)
  const desc48 = Number(process.env.NEXT_PUBLIC_DESC_MAYOR_48 || 35)
  const desc100 = Number(process.env.NEXT_PUBLIC_DESC_MAYOR_100 || 45)

  // Determinar descuento aplicable según cantidad
  const porcentajeDescuento = useMemo(() => {
    if (cantidad >= 100) return desc100
    if (cantidad >= 48) return desc48
    if (cantidad >= 24) return desc24
    return 0
  }, [cantidad, desc24, desc48, desc100])

  // Cálculos de precios
  const subtotal = useMemo(() => {
    return productoSeleccionado.precio * cantidad
  }, [productoSeleccionado, cantidad])

  const descuentoMonto = useMemo(() => {
    return (subtotal * porcentajeDescuento) / 100
  }, [subtotal, porcentajeDescuento])

  const total = useMemo(() => {
    return subtotal - descuentoMonto
  }, [subtotal, descuentoMonto])

  const ahorroPorUnidad = useMemo(() => {
    return (productoSeleccionado.precio * porcentajeDescuento) / 100
  }, [productoSeleccionado, porcentajeDescuento])

  const precioUnitarioEfectivo = useMemo(() => {
    return productoSeleccionado.precio - ahorroPorUnidad
  }, [productoSeleccionado, ahorroPorUnidad])

  // Manejo de formulario corporativo
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formNombre.trim() || !formTelefono.trim() || !formEmpresa.trim()) {
      toast.error('Por favor completa los campos obligatorios (*).')
      return
    }

    setEnviando(true)
    const toastId = toast.loading('Enviando solicitud corporativa...')

    try {
      // Simulamos la llamada a la BD/API de Supabase
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('¡Solicitud recibida! Nos contactaremos contigo a la brevedad.', { id: toastId })
      
      // WhatsApp redirección para agilizar la cotización
      const numWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '59171808300'
      const waText = encodeURIComponent(`Hola Bajo Cero! Quisiera solicitar información sobre compras corporativas/mayoristas.
*Contacto:* ${formNombre.trim()}
*Empresa/Negocio:* ${formEmpresa.trim()}
*Teléfono:* ${formTelefono.trim()}
*Email:* ${formEmail.trim() || 'No provisto'}
*Volumen mensual estimado:* ${formVolumen} unidades/mes
*Mensaje:* ${formMensaje.trim() || 'Interesado en cotizaciones'}`)
      
      window.open(`https://wa.me/${numWhatsApp}?text=${waText}`, '_blank')

      // Resetear formulario
      setFormNombre('')
      setFormEmpresa('')
      setFormTelefono('')
      setFormEmail('')
      setFormMensaje('')
    } catch (err) {
      toast.error('Ocurrió un error al enviar tu solicitud.', { id: toastId })
    } finally {
      setEnviando(false)
    }
  }

  // WhatsApp directo desde calculadora
  const handleCotizarCalculadora = () => {
    const numWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '59171808300'
    const waText = encodeURIComponent(`Hola Bajo Cero! Hice una simulación en su calculadora de mayorista y quisiera cotizar el siguiente pedido:
*Producto:* ${productoSeleccionado.nombre}
*Cantidad:* ${cantidad} unidades
*Precio unitario oficial:* ${productoSeleccionado.precio.toFixed(2)} Bs.
*Descuento obtenido:* ${porcentajeDescuento}%
*Precio unitario con descuento:* ${precioUnitarioEfectivo.toFixed(2)} Bs.
*Total estimado a pagar:* ${total.toFixed(2)} Bs.
*Ahorro total:* ${descuentoMonto.toFixed(2)} Bs.

Quedo atento para coordinar los detalles de facturación y entrega.`)

    window.open(`https://wa.me/${numWhatsApp}?text=${waText}`, '_blank')
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '80px',
      background: '#020b18',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster position="bottom-right" />

      {/* Luces y glows de fondo premium */}
      <div style={{
        position: 'absolute', top: '-120px', left: '10%',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,74,143,0.18) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '-10%',
        width: '500px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '20%',
        width: '700px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(123,184,200,0.1) 0%, transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }} className="px-4 sm:px-10">

        {/* ── SECCIÓN HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '72px', maxWidth: '750px', margin: '0 auto 72px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0, 74, 143, 0.15)',
              border: '1px solid rgba(0, 74, 143, 0.25)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '20px'
            }}
          >
            <Building2 size={13} color="#A8D4E0" />
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#A8D4E0', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Distribución y Canal Corporativo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(38px, 6vw, 60px)', 
              fontWeight: 900, 
              color: 'white', 
              marginBottom: '18px', 
              lineHeight: 1.05, 
              letterSpacing: '-1.5px' 
            }}
          >
            Socio Mayorista Bajo Cero
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.7 }}
          >
            Abastecemos a oficinas, restaurantes, hoteles, revendedores y grandes supermercados en toda Bolivia. 
            Accede a tarifas de distribución con descuentos escalonados de hasta un 45%.
          </motion.p>
        </div>

        {/* ── SECCIÓN LOGOS DE CONFIANZA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ marginBottom: '96px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Cadenas y Socios que Confían en Nosotros
            </h3>
            <div style={{ width: '40px', height: '1.5px', background: 'var(--color-bc-orange)', margin: '0 auto' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                name: 'HIPERMAXI',
                tagline: 'Cadena de Supermercados',
                image: '/SVG BajoCero/hipermaxi-seeklogo.png'
              },
              {
                name: 'SAS',
                tagline: 'Supermercados S.A.',
                image: '/SVG BajoCero/SAS.png'
              },
              {
                name: 'SOLAR',
                tagline: 'Distribución y Retail',
                image: '/SVG BajoCero/solar.png'
              }
            ].map((client, idx) => (
              <motion.div
                key={client.name}
                whileHover={{ y: -5, borderColor: 'rgba(123, 184, 200, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
              >
                {/* Logo Container with white background for images */}
                <div style={{
                  width: '100%',
                  height: '70px',
                  borderRadius: '14px',
                  background: '#F4F8FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  padding: '12px',
                  boxSizing: 'border-box'
                }}>
                  <img
                    src={client.image}
                    alt={client.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {client.name}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(168, 212, 224, 0.35)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {client.tagline}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SECCIÓN CENTRAL: CALCULADORA Y FORMULARIO ── */}
        <div style={{ alignItems: 'stretch' }} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">

          {/* CALCULADORA (Izquierda) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass"
            style={{ 
              borderRadius: '28px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  backgroundColor: 'rgba(220, 120, 40, 0.15)', color: 'var(--color-bc-orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Calculator size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.3px' }}>
                    Calculadora de Descuentos
                  </h2>
                  <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>
                    Simula los beneficios según el volumen del pedido
                  </p>
                </div>
              </div>

              {/* Selector de Producto */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', display: 'block' }}>
                  Selecciona el Producto
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRODUCTOS_CALCULADORA.map((p) => {
                    const esSeleccionado = productoSeleccionado.id === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => setProductoSeleccionado(p)}
                        style={{
                          border: `1px solid ${esSeleccionado ? 'var(--color-bc-orange)' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '16px',
                          padding: '14px',
                          cursor: 'pointer',
                          background: esSeleccionado ? 'rgba(220,120,40,0.08)' : 'rgba(255,255,255,0.02)',
                          transition: 'all 0.25s',
                        }}
                      >
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'white', margin: '0 0 2px' }}>{p.nombre}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', margin: '0 0 6px' }}>{p.desc}</p>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: esSeleccionado ? 'var(--color-bc-orange)' : 'rgba(255,255,255,0.7)' }}>
                          {p.precio.toFixed(2)} Bs. <span style={{ fontSize: '9px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/ unit.</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selector de Cantidad */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    Cantidad de Unidades
                  </label>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>
                    {cantidad} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>unidades</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="200"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '999px',
                    accentColor: 'var(--color-bc-orange)',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                />

                {/* Marcadores de Escala */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                  <span style={{ color: cantidad >= 24 ? '#34d399' : undefined }}>24+ un. ({desc24}% desc.)</span>
                  <span style={{ color: cantidad >= 48 ? '#34d399' : undefined }}>48+ un. ({desc48}% desc.)</span>
                  <span style={{ color: cantidad >= 100 ? '#34d399' : undefined }}>100+ un. ({desc100}% desc.)</span>
                </div>
              </div>

              {/* Resumen del Descuento Escalado */}
              <div style={{ 
                background: 'rgba(123, 184, 200, 0.04)', 
                border: '1px solid rgba(123, 184, 200, 0.1)', 
                borderRadius: '20px', 
                padding: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Subtotal oficial:</span>
                    <span style={{ textDecoration: porcentajeDescuento > 0 ? 'line-through' : 'none' }}>{subtotal.toFixed(2)} Bs.</span>
                  </div>

                  {porcentajeDescuento > 0 ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Percent size={13} /> Descuento aplicado:
                        </span>
                        <span>-{porcentajeDescuento}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
                        <span>Ahorro total:</span>
                        <span>-{descuentoMonto.toFixed(2)} Bs.</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(220,120,40,0.1)', border: '1px solid rgba(220,120,40,0.15)', borderRadius: '10px', padding: '10px', fontSize: '11px', color: '#f59e0b' }}>
                      <Percent size={13} style={{ flexShrink: 0 }} />
                      <span>Agrega {24 - cantidad} unidades más para desbloquear el primer nivel de descuento ({desc24}%).</span>
                    </div>
                  )}

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  
                  {/* Comparación unitaria */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Precio unitario final:</span>
                    <span style={{ color: 'white', fontWeight: 700 }}>
                      {precioUnitarioEfectivo.toFixed(2)} Bs. 
                      {porcentajeDescuento > 0 && <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 500, marginLeft: '6px' }}>({ahorroPorUnidad.toFixed(2)} Bs. menos)</span>}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>Precio Final Estimado:</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'white' }}>
                      {total.toFixed(2)} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Bs.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCotizarCalculadora}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                background: 'var(--color-bc-orange)',
                color: 'white',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(220,120,40,0.2)',
                transition: 'all 0.2s',
                marginTop: '20px'
              }}
              className="hover:opacity-90 active:scale-98"
            >
              <MessageSquare size={15} />
              Enviar Cotización por WhatsApp
            </button>
          </motion.div>

          {/* FORMULARIO DE CONTACTO (Derecha) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass"
            style={{ 
              borderRadius: '28px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '10px', 
                backgroundColor: 'rgba(0, 74, 143, 0.15)', color: '#A8D4E0',
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Building2 size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.3px' }}>
                  Solicitud de Distribución
                </h2>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>
                  Completa tus datos y un asesor se pondrá en contacto
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Nombre Completo *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Zambrana"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    style={{
                      width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                      borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Empresa o Negocio *
                </label>
                <div style={{ position: 'relative' }}>
                  <Store size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cafetería Los Andes / Ketal S.A."
                    value={formEmpresa}
                    onChange={(e) => setFormEmpresa(e.target.value)}
                    style={{
                      width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                      borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    Teléfono / Celular *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 71508200"
                      value={formTelefono}
                      onChange={(e) => setFormTelefono(e.target.value)}
                      style={{
                        width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                        borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                        fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="email"
                      placeholder="Ej. roberto@empresa.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      style={{
                        width: '100%', height: '42px', paddingLeft: '42px', paddingRight: '16px',
                        borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                        fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Volumen Mensual Estimado
                </label>
                <select
                  value={formVolumen}
                  onChange={(e) => setFormVolumen(e.target.value)}
                  style={{
                    width: '100%', height: '42px', padding: '0 16px',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)',
                    fontSize: '13px', outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="Menos de 24" style={{ background: '#081a30' }}>Menos de 24 unidades al mes</option>
                  <option value="24-48" style={{ background: '#081a30' }}>Entre 24 y 48 unidades al mes</option>
                  <option value="48-100" style={{ background: '#081a30' }}>Entre 48 y 100 unidades al mes</option>
                  <option value="Más de 100" style={{ background: '#081a30' }}>Más de 100 unidades al mes (Gran Distribuidor)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Mensaje / Detalles Adicionales
                </label>
                <textarea
                  rows="3"
                  placeholder="Detalla qué formatos de agua necesitas o si tienes algún requerimiento especial..."
                  value={formMensaje}
                  onChange={(e) => setFormMensaje(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                    fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    resize: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  marginTop: '10px'
                }}
                className="hover:bg-white/12 active:scale-98"
              >
                {enviando ? 'Enviando...' : 'Enviar Solicitud y Hablar por WhatsApp'}
                <ArrowRight size={13} />
              </button>
            </form>
          </motion.div>

        </div>

        {/* ── SECCIÓN BENEFICIOS ADICIONALES ── */}
        <div style={{ marginTop: '96px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Truck size={24} color="var(--color-bc-orange)" />,
                title: 'Logística Programada',
                desc: 'Entrega directa y planificada en tu local u oficina según los días de tu preferencia.'
              },
              {
                icon: <Percent size={24} color="var(--color-bc-orange)" />,
                title: 'Facturación y Crédito',
                desc: 'Emitimos facturas válidas de Impuestos y ofrecemos planes de crédito corporativo para clientes de alto volumen.'
              },
              {
                icon: <CheckCircle2 size={24} color="var(--color-bc-orange)" />,
                title: 'Garantía de Pureza',
                desc: 'Agua purificada bajo los más altos estándares de calidad, ideal para la preparación de alimentos y consumo directo.'
              }
            ].map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                style={{
                  background: 'rgba(123,184,200,0.03)',
                  border: '1px solid rgba(123,184,200,0.06)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '12px', 
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {benefit.icon}
                </div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '15px', margin: 0 }}>
                  {benefit.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
