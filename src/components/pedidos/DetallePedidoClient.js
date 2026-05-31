'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Truck, MapPin, Phone, User, Calendar, CreditCard, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DetallePedidoClient({ pedidoId }) {
  const supabase = createClient()
  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPedido() {
      try {
        const { data, error: fetchError } = await supabase
          .from('venta')
          .select(`
            *,
            cliente (*),
            venta_detalles (*, producto (*)),
            pago_venta (pago (*))
          `)
          .eq('id', pedidoId)
          .single()

        if (fetchError) throw fetchError
        setPedido(data)
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError(err.message || 'No se pudo cargar la información del pedido.')
      } finally {
        setCargando(false)
      }
    }

    if (pedidoId) {
      fetchPedido()
    }
  }, [pedidoId])

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white">
        <span className="w-10 h-10 border-4 border-white/20 border-t-bc-orange rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-white/50 uppercase">Cargando detalles del pedido...</p>
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto text-white">
        <h2 className="text-xl font-bold mb-3 text-red-400">Error al cargar el pedido</h2>
        <p className="text-white/45 text-sm mb-6">{error || 'El pedido solicitado no existe o no se pudo recuperar.'}</p>
        <Link href="/catalogo" className="px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold transition-all">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  // Desglosar relaciones
  const cliente = pedido.cliente || {}
  const detalles = pedido.venta_detalles || []
  const pagoRelacion = pedido.pago_venta?.[0]?.pago || {}

  // Calcular subtotales locales si es necesario
  const subtotal = detalles.reduce((acc, d) => acc + (d.precio_unitario * d.cantidad), 0)
  const descuento = (subtotal * (pedido.porcentaje_descuento || 0)) / 100
  const total = subtotal - descuento

  // Línea de tiempo de estados
  // Mapeamos: 'Pendiente' -> Recibido, 'Pagado' -> Entregado. 
  // Podemos simular un estado intermedio 'En camino' si es 'Pendiente' pero tiene repartidor
  const repartidorAsignado = pedido.repartidor_id !== null
  const esPagado = pedido.estado === 'Pagado' || pagoRelacion.estado === 'Pagado'

  let estadoActual = 0 // 0: Recibido, 1: En Camino/Preparación, 2: Entregado/Pagado
  if (esPagado) {
    estadoActual = 2
  } else if (repartidorAsignado) {
    estadoActual = 1
  }

  const pasosTimeline = [
    { titulo: 'Recibido', desc: 'Pedido registrado en el sistema.', icon: Clock },
    { titulo: 'En Preparación / Camino', desc: 'Tu pedido está siendo preparado o el repartidor va en camino.', icon: Truck },
    { titulo: 'Entregado y Pagado', desc: 'El pedido fue recibido y el pago fue verificado.', icon: Check }
  ]

  // Enlace WhatsApp
  const numWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '59171808300'
  const waText = encodeURIComponent(`Hola Bajo Cero! Hice un pedido con ID #${pedido.id}.
*Cliente:* ${cliente.nombre} ${cliente.apellido} (CI: ${cliente.ci})
*Celular:* ${cliente.telefono}
*Método de Pago:* ${pagoRelacion.metodo || 'Efectivo'} (${pagoRelacion.estado || 'Pendiente'})
*Monto Total:* ${total.toFixed(2)} Bs.
*Dirección:* ${pedido.direccion_entrega}

Quiero confirmar el pedido y coordinar la entrega.`)
  const urlWhatsApp = `https://wa.me/${numWhatsApp}?text=${waText}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', color: 'white', padding: '0' }} className="lg:grid-cols-12">

      {/* Columna Izquierda: Mensaje y Estado */}
      <div className="lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Banner éxito */}
        <div className="glass" style={{ borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at top right, rgba(0,74,143,0.1) 0%, transparent 70%)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', borderRadius: '50%', backgroundColor: 'rgba(0,74,143,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <span className="bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px] uppercase tracking-[1.5px] px-2.5 py-1 rounded-full border border-emerald-500/20 mb-4 inline-block">¡Pedido Exitoso!</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, marginBottom: '12px', marginTop: 0, lineHeight: 1.15 }}>¡Gracias por tu compra!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.6, maxWidth: '480px', margin: '0 0 20px' }}>
            Hemos registrado tu pedido correctamente. Nuestro equipo ya se encuentra procesándolo para que llegue fresco y puro a tu puerta.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Pedido:</span>
              <span style={{ fontWeight: 700 }}>#{pedido.id}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Fecha:</span>
              <span style={{ fontWeight: 700 }}>{pedido.fecha} {pedido.hora.substring(0, 5)}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Estado:</span>
              <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: esPagado ? '#34d399' : '#f59e0b' }}>
                {pedido.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Línea de tiempo del pedido */}
        <div className="glass" style={{ borderRadius: '24px', padding: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', marginTop: 0 }}>
            Estado de la Entrega
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '4px' }}>
            {pasosTimeline.map((paso, idx) => {
              const PasoIcon = paso.icon
              const completado = idx <= estadoActual
              const esActivo = idx === estadoActual

              return (
                <div key={paso.titulo} style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>

                  {/* Izquierda: Icono y línea vertical */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div
                      className="transition-all"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backgroundColor: completado ? 'var(--color-bc-blue)' : '#09090b',
                        borderColor: completado ? 'var(--color-bc-blue)' : 'rgba(255,255,255,0.15)',
                        color: completado ? 'white' : 'rgba(255,255,255,0.3)',
                        boxShadow: completado ? '0 0 12px rgba(0,74,143,0.4)' : 'none',
                        zIndex: 10
                      }}
                    >
                      <PasoIcon size={14} className={esActivo ? 'animate-pulse' : ''} />
                    </div>
                    {idx < pasosTimeline.length - 1 && (
                      <div style={{ width: '1.5px', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
                    )}
                  </div>

                  {/* Derecha: Texto descriptivo */}
                  <div style={{ paddingBottom: idx < pasosTimeline.length - 1 ? '36px' : '8px' }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: completado ? 'white' : 'rgba(255,255,255,0.3)', color: esActivo ? 'var(--color-bc-orange)' : undefined }}>
                      {paso.titulo}
                    </h4>
                    <p style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.5, color: completado ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}>
                      {paso.desc}
                    </p>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="glass" style={{ borderRadius: '24px', padding: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', marginTop: 0 }}>
            Resumen de Productos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {detalles.map((d) => {
              const prod = d.producto || {}
              return (
                <div key={d.producto_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '13px', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {prod.url ? (
                        <img src={prod.url} alt={prod.nombre} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>H2O</span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>{prod.nombre || 'Producto'}</h4>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Cat: {prod.categoria}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{d.cantidad} x {d.precio_unitario.toFixed(2)} Bs.</span>
                    <span style={{ fontWeight: 700, color: 'white', textAlign: 'right', minWidth: '70px' }}>{(d.cantidad * d.precio_unitario).toFixed(2)} Bs.</span>
                  </div>
                </div>
              )
            })}

            {/* Desglose total */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.45)' }}>
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} Bs.</span>
              </div>

              {pedido.porcentaje_descuento > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                  <span>Descuento ({pedido.porcentaje_descuento}%)</span>
                  <span>-{descuento.toFixed(2)} Bs.</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.45)' }}>
                <span>Envío</span>
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Gratis</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontWeight: 900, fontSize: '15px' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 900 }}>{total.toFixed(2)} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Bs.</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Columna Derecha: Datos de entrega y Acciones */}
      <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Coordinación por WhatsApp */}
        <div className="glass" style={{ borderRadius: '24px', padding: '28px', background: 'radial-gradient(ellipse at bottom left, rgba(16,185,129,0.08) 0%, transparent 70%)', border: '1px solid rgba(16,185,129,0.1)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', marginTop: 0 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} className="animate-pulse" />
            Coordinar Entrega
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 20px' }}>
            ¡Agiliza la entrega de tu pedido! Haz clic en el botón de abajo para enviar los detalles de tu compra y tu ubicación por WhatsApp directamente a nuestro soporte.
          </p>
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%', height: '46px', borderRadius: '999px',
              background: '#10b981', color: 'white', fontWeight: 700, fontSize: '11px',
              letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(16,185,129,0.2)',
              cursor: 'pointer'
            }}
          >
            <span>Coordinar por WhatsApp</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Datos Cliente y Envío */}
        <div className="glass" style={{ borderRadius: '24px', padding: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', marginTop: 0 }}>
            Detalles de Entrega
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '12px' }}>

            {/* Cliente */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <User size={15} color="var(--color-bc-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Destinatario</span>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{cliente.nombre} {cliente.apellido}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>CI: {cliente.ci}</span>
              </div>
            </div>

            {/* Teléfono */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Phone size={15} color="var(--color-bc-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Teléfono de contacto</span>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{cliente.telefono}</span>
              </div>
            </div>

            {/* Dirección */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={15} color="var(--color-bc-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Dirección de envío</span>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{pedido.direccion_entrega}</span>
              </div>
            </div>

            {/* Método de Pago */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CreditCard size={15} color="var(--color-bc-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Pago asociado</span>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{pagoRelacion.metodo || 'Efectivo'}</span>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: pagoRelacion.estado === 'Pagado' ? '#34d399' : '#f59e0b', marginTop: '2px' }}>
                  Estado: {pagoRelacion.estado || 'Pendiente'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Seguir explorando */}
        <Link
          href="/catalogo"
          style={{
            width: '100%', height: '46px', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
            fontWeight: 700, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
            textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s', cursor: 'pointer', background: 'rgba(255,255,255,0.02)'
          }}
          className="hover:bg-white/5 hover:text-white transition-all"
        >
          <ArrowLeft size={13} />
          Volver al Catálogo
        </Link>

      </div>
    </div>
  )
}
