'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, QrCode, CheckCircle, ShieldCheck } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import QRCode from 'qrcode'
import useCart from '@/hooks/useCart'
import useAuthStore from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import GoogleMapPicker from './GoogleMapPicker'

const inputStyle = {
  width: '100%', height: '44px', padding: '0 16px',
  borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', color: 'white',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', display: 'block',
}

const sectionStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px', padding: '28px',
}

const stepBadge = {
  width: '22px', height: '22px', borderRadius: '50%',
  background: 'var(--color-bc-blue)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '11px', fontWeight: 900, flexShrink: 0, color: 'white',
}

export default function CheckoutClient() {
  const { items, subtotal, isEmpty, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const canvasRef = useRef(null)

  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0)
  const [codigoDescuento, setCodigoDescuento] = useState('')

  useEffect(() => {
    const pct = localStorage.getItem('bajocero_descuento_porcentaje')
    const cod = localStorage.getItem('bajocero_descuento_codigo')
    if (pct) setPorcentajeDescuento(Number(pct))
    if (cod) setCodigoDescuento(cod)
  }, [])

  const descuento = (subtotal * porcentajeDescuento) / 100
  const total = subtotal - descuento

  const { user } = useAuthStore()

  const [ci, setCi] = useState(user?.ci || '')
  const [nombre, setNombre] = useState(user?.nombre || '')
  const [apellido, setApellido] = useState(user?.apellido || '')
  const [telefono, setTelefono] = useState(user?.telefono || '')

  const ZONAS_CIUDAD = {
    'Sucre': [
      'Centro Histórico',
      'Zona Alta (La Madona / Santa Ana)',
      'Zona Garcilazo',
      'El Rollo',
      'Barrio Petrolero',
      'Zona Cementerio',
      'Zona Mesa Verde',
      'Otra Zona'
    ],
    'Santa Cruz': [
      'Equipetrol',
      'Las Palmas',
      'Centro / Casco Viejo',
      'Urbarí',
      'Zona Norte (Radial 26 / Av. Banzer)',
      'Zona Sur',
      'Zona Este (Plan 3000 / Av. Virgen de Cotoca)',
      'Zona Oeste (Doble Vía La Guardia)',
      'Otra Zona'
    ]
  }

  const parseDireccion = (fullDir) => {
    if (!fullDir) return { dir: '', city: 'Sucre', zone: 'Centro Histórico' }
    if (fullDir.includes('(Ciudad: ') && fullDir.includes(', Zona: ')) {
      const parts = fullDir.split(' (Ciudad: ')
      const dir = parts[0]
      const rightPart = parts[1].replace(')', '')
      const subParts = rightPart.split(', Zona: ')
      return { dir, city: subParts[0], zone: subParts[1] }
    }
    if (fullDir.includes(' (Zona: ')) {
      const parts = fullDir.split(' (Zona: ')
      return { dir: parts[0], city: 'Sucre', zone: parts[1].replace(')', '') }
    }
    return { dir: fullDir, city: 'Sucre', zone: 'Centro Histórico' }
  }

  const parsed = parseDireccion(user?.direccion)
  const [direccion, setDireccion] = useState(parsed.dir)
  const [ciudad, setCiudad] = useState(parsed.city)
  const [zona, setZona] = useState(parsed.zone)
  const [latitud, setLatitud] = useState(user?.latitud || null)
  const [longitud, setLongitud] = useState(user?.longitud || null)

  const handleCiudadChange = (newCity) => {
    setCiudad(newCity)
    setZona(ZONAS_CIUDAD[newCity][0])
  }
  const [requiereFactura, setRequiereFactura] = useState(false)
  const [nombreFactura, setNombreFactura] = useState('')
  const [nitFactura, setNitFactura] = useState('')
  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [cargando, setCargando] = useState(false)
  const [transaccionId, setTransaccionId] = useState('')

  useEffect(() => {
    if (metodoPago === 'QR' && canvasRef.current) {
      const qrText = `Agua Bajo Cero - Pedido por ${total.toFixed(2)} Bs. (CI: ${ci || 'Normal'})`
      QRCode.toCanvas(canvasRef.current, qrText, {
        width: 180, margin: 1,
        color: { dark: '#020b18', light: '#FFFFFF' }
      }, (error) => { if (error) console.error(error) })
    }
  }, [metodoPago, total, ci])

  useEffect(() => {
    if (isEmpty && !cargando) {
      toast.error('Tu carrito está vacío.')
      router.push('/catalogo')
    }
  }, [isEmpty, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ci.trim() || !nombre.trim() || !apellido.trim() || !telefono.trim() || !direccion.trim()) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }
    setCargando(true)
    const toastId = toast.loading('Procesando tu pedido...')
    try {
      const cleanCi = ci.trim()
      const cleanDireccion = `${direccion.trim()} (Ciudad: ${ciudad}, Zona: ${zona})`
      const { data: clienteExistente } = await supabase.from('cliente').select('*').eq('ci', cleanCi).maybeSingle()
      
      let updatedUser = null
      if (clienteExistente) {
        const { data, error } = await supabase
          .from('cliente')
          .update({ 
            nombre: nombre.trim(), 
            apellido: apellido.trim(), 
            telefono: telefono.trim(), 
            direccion: cleanDireccion,
            latitud: latitud,
            longitud: longitud
          })
          .eq('ci', cleanCi)
          .select()
          .single()
        if (error) throw new Error(error.message)
        updatedUser = data
      } else {
        const { data, error } = await supabase
          .from('cliente')
          .insert({ 
            ci: cleanCi, 
            nombre: nombre.trim(), 
            apellido: apellido.trim(), 
            telefono: telefono.trim(), 
            direccion: cleanDireccion, 
            habilitado_plan_pagos: false,
            latitud: latitud,
            longitud: longitud
          })
          .select()
          .single()
        if (error) throw new Error(error.message)
        updatedUser = data
      }
      
      // Actualizar el usuario local en useAuthStore si es el usuario logueado actualmente
      if (updatedUser && user && user.ci === cleanCi) {
        useAuthStore.getState().setUser(updatedUser)
      }

      const fecha = new Date().toISOString().split('T')[0]
      const hora = new Date().toTimeString().split(' ')[0]
      const { data: nuevaVenta, error: errorVenta } = await supabase.from('venta').insert({ fecha, hora, tipo: 'Contado', estado: 'Pendiente', porcentaje_descuento: porcentajeDescuento, cliente_ci: cleanCi, direccion_entrega: cleanDireccion }).select().single()
      if (errorVenta || !nuevaVenta) throw new Error(errorVenta?.message)
      const { error: errorDetalles } = await supabase.from('venta_detalles').insert(items.map(item => ({ venta_id: nuevaVenta.id, producto_id: item.producto_id, cantidad: item.cantidad, precio_unitario: item.precio })))
      if (errorDetalles) throw new Error(errorDetalles.message)
      const { data: nuevoPago, error: errorPago } = await supabase.from('pago').insert({ fecha, hora, monto: total, metodo: metodoPago, estado: 'Pendiente' }).select().single()
      if (errorPago || !nuevoPago) throw new Error(errorPago?.message)
      await supabase.from('pago_venta').insert({ pago_id: nuevoPago.pago_id, venta_id: nuevaVenta.id })
      if (requiereFactura) {
        await supabase.from('factura').insert({ subtotal, total, descuento, fecha_emision: fecha, nombre_completo: nombreFactura.trim() || `${nombre.trim()} ${apellido.trim()}`, nit: nitFactura.trim() || cleanCi, venta_id: nuevaVenta.id })
      }
      localStorage.setItem('bajocero_ultimo_pedido_id', String(nuevaVenta.id))
      localStorage.removeItem('bajocero_descuento_porcentaje')
      localStorage.removeItem('bajocero_descuento_codigo')
      clearCart()
      toast.success('¡Pedido realizado con éxito!', { id: toastId })
      router.push(`/pedidos/${nuevaVenta.id}`)
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId })
    } finally {
      setCargando(false)
    }
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
        background: '#020b18',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '30%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '30%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '500px', padding: '0 24px', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '40px 32px',
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShieldCheck size={28} color="var(--color-bc-orange)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Identificación de Cliente</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '32px' }}>
              Para confirmar tu pedido y gestionar tus entregas de forma segura en Bajo Cero, necesitas registrarte o iniciar sesión.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/auth/login?redirect=/checkout"
                style={{
                  height: '46px',
                  borderRadius: '999px',
                  background: 'var(--color-bc-orange)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 24px rgba(220,120,40,0.2)'
                }}
                className="hover:opacity-90 active:scale-98"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/registro?redirect=/checkout"
                style={{
                  height: '46px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                }}
                className="hover:bg-white/12 active:scale-98"
              >
                Crear una Cuenta
              </Link>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link href="/carrito" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 600 }} className="hover:text-white transition-colors">
                ← Volver al Carrito
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',   /* espacio generoso bajo el navbar */
      paddingBottom: '80px',
      background: '#020b18',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster position="bottom-right" />

      {/* Glows */}
      <div style={{ position: 'absolute', top: '-80px', left: '20%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '15%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }} className="px-4 sm:px-10">

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/carrito" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '14px' }}>
            <ArrowLeft size={13} /> Volver al carrito
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
            Confirmar Pedido
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7">

          {/* ── Izquierda ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 1. Datos de entrega */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px', marginTop: 0 }}>
                <span style={stepBadge}>1</span>
                Datos de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>CI / Documento de Identidad *</label>
                  <input type="text" required placeholder="Ej. 7465086" value={ci} onChange={(e) => setCi(e.target.value)} style={inputStyle} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>Usamos tu CI para identificarte y asociar tu pedido.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Nombre *</label>
                  <input type="text" required placeholder="Ej. Carlos" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Apellido *</label>
                  <input type="text" required placeholder="Ej. Perez" value={apellido} onChange={(e) => setApellido(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Teléfono / Celular *</label>
                  <input type="tel" required placeholder="Ej. 71808300" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Ciudad de Entrega *</label>
                  <select value={ciudad} onChange={(e) => handleCiudadChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}>
                    {['Sucre', 'Santa Cruz'].map(c => (
                      <option key={c} value={c} style={{ background: '#081a30' }}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Zona de Entrega *</label>
                  <select value={zona} onChange={(e) => setZona(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}>
                    {(ZONAS_CIUDAD[ciudad] || []).map(z => (
                      <option key={z} value={z} style={{ background: '#081a30' }}>{z}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Dirección Exacta de Entrega *</label>
                  <input type="text" required placeholder="Ej. Calle 15 de Calacoto Nro. 120, Edificio Altura Dpto. 4B" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={labelStyle}>Fijar Ubicación Exacta en el Mapa</label>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                    Arrastra el marcador naranja o haz clic en tu posición exacta para que el repartidor llegue sin problemas.
                  </span>
                  <GoogleMapPicker
                    lat={latitud}
                    lng={longitud}
                    defaultCity={ciudad}
                    onChange={({ lat, lng }) => {
                      setLatitud(lat)
                      setLongitud(lng)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Factura */}
            <div style={sectionStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: requiereFactura ? '18px' : '0', borderBottom: requiereFactura ? '1px solid rgba(255,255,255,0.07)' : 'none', marginBottom: requiereFactura ? '20px' : '0' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                  <span style={stepBadge}>2</span>
                  ¿Requiere Factura?
                </h2>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={requiereFactura} onChange={(e) => setRequiereFactura(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bc-orange" />
                </label>
              </div>
              {requiereFactura && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  style={{ overflow: 'hidden' }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>NIT / CI para Factura *</label>
                    <input type="text" required={requiereFactura} placeholder="Ej. 754458" value={nitFactura} onChange={(e) => setNitFactura(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Razón Social / Nombre *</label>
                    <input type="text" required={requiereFactura} placeholder="Ej. Daniel Zambrana" value={nombreFactura} onChange={(e) => setNombreFactura(e.target.value)} style={inputStyle} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* 3. Método de pago */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '20px', marginTop: 0 }}>
                <span style={stepBadge}>3</span>
                Método de Pago
              </h2>

              <div style={{ marginBottom: metodoPago === 'QR' ? '20px' : '0' }} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { key: 'Efectivo', icon: <DollarSign size={20} />, title: 'Efectivo al recibir', desc: 'Pagas al repartidor en tu puerta.' },
                  { key: 'QR', icon: <QrCode size={20} />, title: 'Pago Simple QR', desc: 'Escanea y transfiere desde tu app bancaria.' },
                ].map(({ key, icon, title, desc }) => (
                  <div key={key} onClick={() => setMetodoPago(key)} style={{
                    border: `1px solid ${metodoPago === key ? 'var(--color-bc-orange)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '16px', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    cursor: 'pointer', transition: 'all 0.25s',
                    background: metodoPago === key ? 'rgba(220,120,40,0.08)' : 'rgba(255,255,255,0.03)',
                    boxShadow: metodoPago === key ? '0 0 20px rgba(220,120,40,0.12)' : 'none',
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: metodoPago === key ? 'var(--color-bc-orange)' : 'rgba(255,255,255,0.07)', color: metodoPago === key ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.25s' }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: 'white', marginBottom: '3px' }}>{title}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {metodoPago === 'QR' && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '14px', flexShrink: 0 }}>
                    <canvas ref={canvasRef} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(52,211,153,0.2)' }}>Pago Simple</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Instrucciones</span>
                    </div>
                    <ol style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.7, margin: 0 }}>
                      <li>Abre la app de tu banco y selecciona <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Pago con QR</strong>.</li>
                      <li>Escanea el código. El monto <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{total.toFixed(2)} Bs.</strong> se carga automáticamente.</li>
                      <li>Registra el ID de transacción para validar tu pago.</li>
                    </ol>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>ID de Transacción (Opcional)</label>
                      <input type="text" placeholder="Ej. TXN-98432104" value={transaccionId} onChange={(e) => setTransaccionId(e.target.value)} style={{ ...inputStyle, height: '40px', fontSize: '13px' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Derecha sticky ── */}
          <div className="lg:sticky lg:top-24">
            <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0 }}>Resumen del Pedido</h2>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '8px' }}>
                  {items.length} producto{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {items.map((item) => (
                  <div key={item.producto_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 800, fontSize: '10px', color: 'var(--color-bc-orange)', background: 'rgba(220,120,40,0.12)', padding: '2px 7px', borderRadius: '6px', flexShrink: 0 }}>{item.cantidad}x</span>
                      <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nombre}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>{(item.precio * item.cantidad).toFixed(2)} Bs.</span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.45)' }}>
                  <span>Subtotal</span><span>{subtotal.toFixed(2)} Bs.</span>
                </div>
                {porcentajeDescuento > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                    <span>Descuento ({codigoDescuento})</span><span>-{descuento.toFixed(2)} Bs.</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.45)' }}>
                  <span>Envío</span>
                  <span style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Gratis</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'white' }}>Total a Pagar</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, color: 'white' }}>
                    {total.toFixed(2)} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Bs.</span>
                  </span>
                </div>
              </div>

              {/* Seguro */}
              <div style={{ background: 'rgba(0,74,143,0.1)', border: '1px solid rgba(0,74,143,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <ShieldCheck size={15} color="var(--color-bc-blue)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'white', margin: '0 0 3px' }}>Pedido Protegido</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: 0 }}>Tu compra está garantizada. Paga al repartidor o por QR de forma segura.</p>
                </div>
              </div>

              {/* Botón */}
              <button type="submit" disabled={cargando} style={{
                width: '100%', height: '50px', borderRadius: '999px',
                background: cargando ? 'rgba(255,255,255,0.1)' : 'var(--color-bc-orange)',
                color: cargando ? 'rgba(255,255,255,0.3)' : 'white',
                fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                border: 'none', cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
                boxShadow: cargando ? 'none' : '0 8px 24px rgba(220,120,40,0.25)',
              }}>
                {cargando ? (
                  <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Procesando...</>
                ) : (
                  <><CheckCircle size={15} /> Confirmar y Hacer Pedido</>
                )}
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  )
}