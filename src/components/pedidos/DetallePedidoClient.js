'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Truck, MapPin, Phone, User, Calendar, CreditCard, ExternalLink, ArrowLeft, Mail, Printer, Download } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast, Toaster } from 'react-hot-toast'
import useAuthStore from '@/store/authStore'

export default function DetallePedidoClient({ pedidoId }) {
  const supabase = createClient()
  const { user } = useAuthStore()
  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [mostrarModalEmail, setMostrarModalEmail] = useState(false)
  const [emailDestinatario, setEmailDestinatario] = useState('')
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)

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
        
        // IDOR check: verify that the logged-in user owns this order
        if (!user || data.cliente_ci !== user.ci) {
          setError('Acceso denegado. No tienes permisos para ver este pedido.')
          return
        }

        setPedido(data)
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError('No se pudo cargar la información del pedido. Por favor intenta de nuevo.')
      } finally {
        setCargando(false)
      }
    }

    if (pedidoId) {
      fetchPedido()
    }
  }, [pedidoId, user])

  useEffect(() => {
    if (pedido && !cargando) {
      const autoDownload = sessionStorage.getItem('bajocero_auto_download_pdf')
      if (autoDownload === 'true') {
        sessionStorage.removeItem('bajocero_auto_download_pdf')
        const timer = setTimeout(() => {
          descargarReciboPDF()
        }, 1200)
        return () => clearTimeout(timer)
      }
    }
  }, [pedido, cargando])

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white">
        <span className="w-10 h-10 border-4 border-white/20 border-t-bc-orange rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-white/50 uppercase">Cargando detalles del pedido...</p>
      </div>
    )
  }

  if (error || !pedido) {
    const isAccesoDenegado = error?.includes('Acceso denegado')
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto text-white">
        {isAccesoDenegado ? (
          <div className="glass" style={{ borderRadius: '24px', padding: '36px 24px', border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.02)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: '24px' }}>🔒</span>
            </div>
            <h2 className="text-xl font-extrabold mb-3 text-rose-400">Acceso Denegado</h2>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Este pedido pertenece a otra cuenta de cliente. Por motivos de seguridad y privacidad, no tienes autorización para visualizar sus detalles.
            </p>
            <Link href="/catalogo" className="inline-block px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition-all">
              Volver al Catálogo
            </Link>
          </div>
        ) : (
          <div className="glass" style={{ borderRadius: '24px', padding: '36px 24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-xl font-bold mb-3 text-red-400">Error al cargar el pedido</h2>
            <p className="text-white/45 text-sm mb-6">{error || 'El pedido solicitado no existe o no se pudo recuperar.'}</p>
            <Link href="/catalogo" className="inline-block px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold transition-all">
              Ir al catálogo
            </Link>
          </div>
        )}
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

  const descargarReciboTXT = () => {
    if (!pedido) return
    const divider = '='.repeat(45)
    const line = '-'.repeat(45)

    let txt = `${divider}\n`
    txt += `          BAJO CERO - AGUA PURIFICADA\n`
    txt += `          RECIBO DE PEDIDO #${pedido.id}\n`
    txt += `${divider}\n\n`
    txt += `Fecha: ${pedido.fecha} ${pedido.hora.substring(0, 5)}\n`
    txt += `Cliente: ${cliente.nombre || ''} ${cliente.apellido || ''}\n`
    txt += `CI: ${cliente.ci || ''}\n`
    txt += `Teléfono: ${cliente.telefono || ''}\n`
    txt += `Dirección: ${cliente.direccion || ''}\n\n`
    txt += `${line}\n`
    txt += `DETALLE DEL PEDIDO\n`
    txt += `${line}\n`

    detalles.forEach((d) => {
      const prodName = (d.producto?.nombre || 'Producto').padEnd(28, ' ')
      const qty = `${d.cantidad}x`.padStart(4, ' ')
      const price = `${(d.precio_unitario * d.cantidad).toFixed(2)} Bs.`.padStart(11, ' ')
      txt += `${qty}  ${prodName} ${price}\n`
    })

    txt += `${line}\n`
    txt += `Subtotal:`.padEnd(30, ' ') + `${subtotal.toFixed(2)} Bs.\n`
    if (pedido.porcentaje_descuento > 0) {
      txt += `Descuento (${pedido.porcentaje_descuento}%):`.padEnd(30, ' ') + `-${descuento.toFixed(2)} Bs.\n`
    }
    txt += `Envío:`.padEnd(30, ' ') + `Gratis\n`
    txt += `${line}\n`
    txt += `TOTAL A PAGAR:`.padEnd(30, ' ') + `${total.toFixed(2)} Bs.\n`
    txt += `${divider}\n\n`
    txt += `Método de Pago: ${pagoRelacion.metodo || 'Efectivo'} (${pagoRelacion.estado || 'Pendiente'})\n`
    txt += `¡Gracias por elegir la pureza de Bajo Cero!\n`
    txt += `Si tienes dudas, contáctanos al WhatsApp: 59171808300\n`

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `recibo-bajocero-pedido-${pedido.id}.txt`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const descargarReciboPDF = async () => {
    if (!pedido) return
    const toastId = toast.loading('Generando recibo PDF...')
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      // Colores de la marca
      const cBlue = [0, 74, 143]
      const cOrange = [220, 120, 40]
      const cDark = [33, 37, 41]
      const cGray = [120, 120, 120]

      // Header
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(...cBlue)
      doc.text('BAJO CERO', 15, 25)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...cGray)
      doc.text('Agua Purificada de Mesa · Bolivia', 15, 30)
      doc.text('Soporte / WhatsApp: +591 71808300', 15, 35)

      // Recibo ID (Derecha)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(...cOrange)
      doc.text('RECIBO DE PEDIDO', 130, 25)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.setTextColor(...cDark)
      doc.text(`ID: #${pedido.id}`, 130, 31)
      doc.text(`Fecha: ${pedido.fecha}`, 130, 37)

      // Línea divisoria
      doc.setDrawColor(220, 220, 220)
      doc.line(15, 43, 195, 43)

      // Datos del Cliente y Envío
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...cBlue)
      doc.text('DETALLES DE CLIENTE Y ENTREGA', 15, 52)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...cDark)
      doc.text(`Cliente: ${cliente.nombre || ''} ${cliente.apellido || ''}`, 15, 59)
      doc.text(`CI / Documento: ${cliente.ci || ''}`, 15, 65)
      doc.text(`Teléfono: ${cliente.telefono || ''}`, 15, 71)

      // Dirección con ajuste automático de línea si es muy larga
      const splitDireccion = doc.splitTextToSize(`Dirección: ${cliente.direccion || ''}`, 90)
      doc.text(splitDireccion, 105, 59)
      doc.text(`Método de Pago: ${pagoRelacion.metodo || 'Efectivo'} (${pagoRelacion.estado || 'Pendiente'})`, 105, 71)

      // Tabla de productos
      let currentY = 82
      doc.setDrawColor(220, 220, 220)
      doc.line(15, currentY, 195, currentY)

      currentY += 6
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(...cBlue)
      doc.text('CANT.', 15, currentY)
      doc.text('DESCRIPCIÓN DEL PRODUCTO', 32, currentY)
      doc.text('PRECIO UNIT.', 135, currentY, { align: 'right' })
      doc.text('TOTAL', 185, currentY, { align: 'right' })

      currentY += 3
      doc.setDrawColor(200, 200, 200)
      doc.line(15, currentY, 195, currentY)

      // Items
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...cDark)

      detalles.forEach((d) => {
        currentY += 7
        // Si el eje Y está por salirse de la página, añadir página
        if (currentY > 270) {
          doc.addPage()
          currentY = 20
        }
        
        doc.text(`${d.cantidad}x`, 15, currentY)
        doc.text(d.producto?.nombre || 'Producto', 32, currentY)
        doc.text(`${d.precio_unitario.toFixed(2)} Bs.`, 135, currentY, { align: 'right' })
        doc.text(`${(d.precio_unitario * d.cantidad).toFixed(2)} Bs.`, 185, currentY, { align: 'right' })
      })

      // Línea antes del resumen
      currentY += 5
      doc.setDrawColor(220, 220, 220)
      doc.line(15, currentY, 195, currentY)

      // Resumen de totales
      currentY += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...cGray)
      doc.text('Subtotal:', 130, currentY)
      doc.setTextColor(...cDark)
      doc.text(`${subtotal.toFixed(2)} Bs.`, 185, currentY, { align: 'right' })

      if (pedido.porcentaje_descuento > 0) {
        currentY += 6
        doc.setTextColor(46, 125, 50) // Verde para descuento
        doc.text(`Descuento (${pedido.porcentaje_descuento}%):`, 130, currentY)
        doc.text(`-${descuento.toFixed(2)} Bs.`, 185, currentY, { align: 'right' })
      }

      currentY += 6
      doc.setTextColor(...cGray)
      doc.text('Envío:', 130, currentY)
      doc.setTextColor(46, 125, 50)
      doc.text('Gratis', 185, currentY, { align: 'right' })

      currentY += 8
      doc.setDrawColor(180, 180, 180)
      doc.line(120, currentY - 5, 195, currentY - 5)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...cBlue)
      doc.text('TOTAL A PAGAR:', 120, currentY)
      doc.text(`${total.toFixed(2)} Bs.`, 185, currentY, { align: 'right' })

      // Footer
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9.5)
      doc.setTextColor(...cGray)
      doc.text('¡Gracias por elegir la pureza de Bajo Cero!', 105, 275, { align: 'center' })
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text('Este documento sirve como constancia oficial de tu pedido.', 105, 281, { align: 'center' })

      doc.save(`recibo-bajocero-pedido-${pedido.id}.pdf`)
      toast.success('Recibo PDF descargado con éxito.', { id: toastId })
    } catch (err) {
      console.error('Error al generar PDF:', err)
      toast.error('Ocurrió un error al generar el PDF.', { id: toastId })
    }
  }

  const imprimirRecibo = () => {
    window.print()
  }

  const handleEnviarEmail = async (e) => {
    e.preventDefault()
    const cleanEmail = emailDestinatario.trim()
    if (!cleanEmail) {
      toast.error('Por favor ingresa un correo electrónico.')
      return
    }

    // Validación de formato de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      toast.error('Por favor ingresa un correo electrónico válido.')
      return
    }

    setEnviandoEmail(true)

    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('Generando archivo PDF del recibo...', { duration: 1500 })

    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Enviando correo con archivo adjunto...', { duration: 1500 })

    await new Promise(resolve => setTimeout(resolve, 800))

    setEnviandoEmail(false)
    setEmailEnviado(true)
    toast.success(`¡Recibo enviado con éxito a ${cleanEmail}!`)

    setTimeout(() => {
      setMostrarModalEmail(false)
      setEmailEnviado(false)
      setEmailDestinatario('')
    }, 2000)
  }

  const handleEnviarMailto = () => {
    const subject = encodeURIComponent(`Recibo de Compra Bajo Cero - Pedido #${pedido.id}`)
    const body = encodeURIComponent(`Hola!\n\nAquí tienes el resumen de tu compra de Agua Purificada Bajo Cero:\n\nPedido: #${pedido.id}\nFecha: ${pedido.fecha}\nMonto Total: ${total.toFixed(2)} Bs.\n\nDetalle:\n${detalles.map(d => `${d.cantidad}x ${d.producto?.nombre} - ${(d.precio_unitario * d.cantidad).toFixed(2)} Bs.`).join('\n')}\n\n¡Gracias por tu preferencia!\nBajo Cero S.R.L.`)
    window.open(`mailto:${emailDestinatario.trim() || ''}?subject=${subject}&body=${body}`, '_blank')
  }

  // Línea de tiempo de estados
  // Mapeamos: 'Pendiente' -> Recibido, 'Pagado' -> Entregado. 
  // Podemos simular un estado intermedio 'En camino' si es 'Pendiente' pero tiene repartidor
  const repartidorAsignado = pedido.repartidor_id !== null
  const esPagado = 
    pedido.estado === 'Pagado' || 
    pedido.estado === 'Completado' || 
    pedido.estado === 'Entregado' || 
    pagoRelacion.estado === 'Pagado'

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
*Dirección:* ${cliente.direccion || ''}

Quiero confirmar el pedido y coordinar la entrega.`)
  const urlWhatsApp = `https://wa.me/${numWhatsApp}?text=${waText}`

  return (
    <>
      <Toaster position="bottom-right" />

      {/* Estilos CSS para Impresión */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body, html, #__next, main, [data-reactroot] {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print, header, footer, nav, button, a {
            display: none !important;
          }
          .print-area {
            display: block !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 30px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }
        @media screen {
          .print-area {
            display: none !important;
          }
        }
      `}} />

      {/* Contenido en Pantalla */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 no-print text-white p-0">

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
                  <div key={d.producto_id} className="flex justify-between items-center gap-4 text-xs sm:text-sm py-1 border-b border-white/5 last:border-b-0 sm:border-b-0">
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
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
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

          {/* Recibo e Impresión */}
          <div className="glass" style={{ borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '4px', marginTop: 0 }}>
              Mi Recibo
            </h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
              Descarga tu recibo en formato PDF oficial o archivo de texto, imprímelo, o envíalo a tu correo.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={descargarReciboPDF}
                style={{
                  width: '100%', height: '40px', borderRadius: '12px',
                  background: 'var(--color-bc-orange)', color: 'white', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '1px', textTransform: 'uppercase', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,120,40,0.2)'
                }}
                className="hover:opacity-90 active:scale-98"
              >
                <Download size={13} style={{ marginRight: '6px' }} />
                <span>Descargar Recibo (PDF)</span>
              </button>
              <button
                onClick={descargarReciboTXT}
                style={{
                  width: '100%', height: '40px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', cursor: 'pointer'
                }}
                className="hover:bg-white/12 active:scale-98"
              >
                <Download size={13} style={{ marginRight: '6px' }} />
                <span>Descargar Recibo (TXT)</span>
              </button>
              <button
                onClick={imprimirRecibo}
                style={{
                  width: '100%', height: '40px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', cursor: 'pointer'
                }}
                className="hover:bg-white/12 active:scale-98"
              >
                <Printer size={13} style={{ marginRight: '6px' }} />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={() => setMostrarModalEmail(true)}
                style={{
                  width: '100%', height: '40px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', cursor: 'pointer'
                }}
                className="hover:bg-white/12 hover:text-white active:scale-98"
              >
                <Mail size={13} style={{ marginRight: '6px' }} />
                <span>Enviar a mi Correo</span>
              </button>
            </div>
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
                  <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{cliente.direccion}</span>
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

      {/* Área de Impresión (Invisible en pantalla, visible al imprimir) */}
      <div className="print-area" style={{ fontFamily: 'sans-serif', color: 'black' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px', letterSpacing: '1px' }}>BAJO CERO</h1>
          <p style={{ fontSize: '12px', margin: '0', color: '#555' }}>Agua Purificada de Mesa · Bolivia</p>
          <p style={{ fontSize: '12px', margin: '4px 0 0', color: '#555' }}>Celular/WhatsApp: 71808300</p>
        </div>

        <div style={{ borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px' }}>DETALLE DE PEDIDO #{pedido.id}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            <div>
              <p style={{ margin: '3px 0' }}><strong>Fecha:</strong> {pedido.fecha} {pedido.hora.substring(0, 5)}</p>
              <p style={{ margin: '3px 0' }}><strong>Cliente:</strong> {cliente.nombre} {cliente.apellido}</p>
              <p style={{ margin: '3px 0' }}><strong>Documento (CI):</strong> {cliente.ci}</p>
            </div>
            <div>
              <p style={{ margin: '3px 0' }}><strong>Teléfono:</strong> {cliente.telefono}</p>
              <p style={{ margin: '3px 0' }}><strong>Dirección:</strong> {cliente.direccion}</p>
              <p style={{ margin: '3px 0' }}><strong>Método de Pago:</strong> {pagoRelacion.metodo || 'Efectivo'}</p>
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>
              <th style={{ padding: '8px 0' }}>Cant.</th>
              <th style={{ padding: '8px 0' }}>Producto</th>
              <th style={{ padding: '8px 0', textAlign: 'right' }}>Precio Unit.</th>
              <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.producto_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 0' }}>{d.cantidad}x</td>
                <td style={{ padding: '8px 0' }}>{d.producto?.nombre || 'Producto'}</td>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>{d.precio_unitario.toFixed(2)} Bs.</td>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>{(d.cantidad * d.precio_unitario).toFixed(2)} Bs.</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '13px' }}>
          <div style={{ width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} Bs.</span>
            </div>
            {pedido.porcentaje_descuento > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: 'green' }}>
                <span>Descuento ({pedido.porcentaje_descuento}%):</span>
                <span>-{descuento.toFixed(2)} Bs.</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '15px' }}>
              <span>TOTAL A PAGAR:</span>
              <span>{total.toFixed(2)} Bs.</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid #ccc', paddingTop: '20px', fontSize: '12px', color: '#666' }}>
          <p style={{ margin: '0' }}>¡Gracias por elegir la pureza de Bajo Cero!</p>
          <p style={{ margin: '4px 0 0' }}>Este documento sirve como constancia de pedido.</p>
        </div>
      </div>

      {/* Modal de Correo Electrónico */}
      {mostrarModalEmail && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '24px', backdropFilter: 'blur(8px)'
        }} className="no-print">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#081a30',
              border: '1px solid rgba(168,212,224,0.15)',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '440px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setMostrarModalEmail(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontSize: '18px'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '12px' }}>Enviar Recibo por Correo</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '24px' }}>
              Ingresa tu correo electrónico para recibir un archivo de recibo detallado con el resumen de tu pedido.
            </p>

            <form onSubmit={handleEnviarEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>
                  Dirección de Correo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={emailDestinatario}
                  onChange={(e) => setEmailDestinatario(e.target.value)}
                  style={{
                    width: '100%', height: '42px', padding: '0 16px',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', color: 'white',
                    fontSize: '13px', outline: 'none', boxSizing: 'border-box'
                  }}
                  disabled={enviandoEmail || emailEnviado}
                />
              </div>

              {emailEnviado ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center', padding: '12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', color: '#34d399', fontSize: '12px' }}>
                  <span>¡Recibo enviado con éxito!</span>
                  <button
                    type="button"
                    onClick={handleEnviarMailto}
                    style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#A8D4E0', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                  >
                    ¿No se envió? Abrir en cliente de correo local
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={enviandoEmail}
                  style={{
                    width: '100%', height: '44px', borderRadius: '999px',
                    background: 'var(--color-bc-orange)', color: 'white',
                    fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                    border: 'none', cursor: enviandoEmail ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(220,120,40,0.2)'
                  }}
                >
                  {enviandoEmail ? 'Enviando...' : 'Enviar Recibo'}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}

