'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, ClipboardList, ArrowRight, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputStyle = {
  width: '100%', height: '46px', paddingLeft: '44px', paddingRight: '16px',
  borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', color: 'white',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const buttonStyle = {
  height: '46px', padding: '0 24px', borderRadius: '12px',
  background: 'var(--color-bc-orange)', color: 'white',
  fontWeight: 700, fontSize: '12px', letterSpacing: '1px',
  textTransform: 'uppercase', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '8px', boxShadow: '0 4px 16px rgba(220,120,40,0.2)',
  transition: 'all 0.2s', flexShrink: 0,
}

const sectionStyle = {
  borderRadius: '24px', padding: '24px',
}

export default function PedidosHistoricoPage() {
  const supabase = createClient()
  const [ciBusqueda, setCiBusqueda] = useState('')
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [error, setError] = useState('')

  const buscarPedidos = async (ciValue) => {
    setCargando(true)
    setError('')
    setBuscado(true)
    
    try {
      localStorage.setItem('bajocero_ultimo_ci', ciValue)
      
      const { data, error: fetchError } = await supabase
        .from('venta')
        .select(`
          *,
          pago_venta (pago (*)),
          venta_detalles (*, producto (*))
        `)
        .eq('cliente_ci', ciValue)
        .order('id', { ascending: false })

      if (fetchError) throw fetchError
      setPedidos(data || [])
    } catch (err) {
      console.error('Error al buscar pedidos:', err)
      setError('Ocurrió un error al buscar tus pedidos. Por favor intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  // Intentar cargar el último CI usado desde LocalStorage al iniciar
  useEffect(() => {
    const ultimoCi = localStorage.getItem('bajocero_ultimo_ci')
    if (ultimoCi) {
      Promise.resolve().then(() => {
        setCiBusqueda(ultimoCi)
        buscarPedidos(ultimoCi)
      })
    } else {
      const ultimoPedidoId = localStorage.getItem('bajocero_ultimo_pedido_id')
      if (ultimoPedidoId) {
        window.location.href = `/pedidos/${ultimoPedidoId}`
      }
    }
  }, [])

  const handleBuscar = (e) => {
    e.preventDefault()
    const cleanCi = ciBusqueda.trim()
    if (!cleanCi) {
      setError('Por favor ingresa tu CI para buscar.')
      return
    }
    
    // Validación de formato de CI
    const ciRegex = /^[a-zA-Z0-9-]{5,12}$/
    if (!ciRegex.test(cleanCi)) {
      setError('El CI debe tener entre 5 y 12 caracteres (solo letras, números y guiones).')
      return
    }
    
    buscarPedidos(cleanCi)
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '80px',
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
      color: 'white'
    }}>
      {/* Glows de fondo */}
      <div style={{
        position: 'absolute', top: '-100px', left: '20%',
        width: '500px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,74,143,0.1) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '20%',
        width: '500px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(220,120,40,0.05) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ClipboardList className="text-bc-orange" size={28} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 12px' }}>
            Mis Pedidos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
            Ingresa tu CI para consultar el historial y el estado de entrega en tiempo real de tus pedidos de agua purificada.
          </p>
        </div>

        {/* Buscador */}
        <form onSubmit={handleBuscar} style={{ ...sectionStyle, display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }} className="glass">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search className="text-white/30" size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Ingresa tu Documento de Identidad (CI)..."
              value={ciBusqueda}
              onChange={(e) => {
                setCiBusqueda(e.target.value)
                setError('')
              }}
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={cargando} style={buttonStyle}>
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '12px', fontWeight: 500, textAlign: 'center', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Listado de Pedidos */}
        <div>
          {cargando ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: '12px' }}>
              <span style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--color-bc-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px' }}>Consultando base de datos...</span>
            </div>
          ) : buscado && pedidos.length === 0 ? (
            <div style={{ ...sectionStyle, textAlign: 'center', padding: '48px 24px' }} className="glass">
              <ClipboardList size={30} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>No se encontraron pedidos</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto 24px' }}>
                No tenemos registros de compras para el CI ingresado.
              </p>
              <Link href="/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Ver catálogo <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AnimatePresence>
                {pedidos.map((ped) => {
                  const itemsCount = ped.venta_detalles?.reduce((acc, i) => acc + i.cantidad, 0) || 0
                  const pago = ped.pago_venta?.[0]?.pago || {}
                  const totalPedido = ped.venta_detalles?.reduce((acc, d) => acc + (d.precio_unitario * d.cantidad), 0) || 0
                  const descuento = (totalPedido * (ped.porcentaje_descuento || 0)) / 100
                  const totalConDescuento = totalPedido - descuento
                  
                  const esPagado = ped.estado === 'Pagado' || pago.estado === 'Pagado'

                  return (
                    <motion.div
                      key={ped.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass"
                      style={{
                        borderRadius: '24px',
                        padding: '24px 28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '24px',
                      }}
                    >
                      {/* Info general */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 900, fontSize: '15px', color: 'white' }}>Pedido #{ped.id}</span>
                          <span style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)'
                          }}>
                            {ped.tipo}
                          </span>
                          <span style={{
                            background: esPagado ? 'rgba(52,211,153,0.12)' : 'rgba(245,158,11,0.12)',
                            border: esPagado ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(245,158,11,0.2)',
                            padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800,
                            textTransform: 'uppercase', color: esPagado ? '#34d399' : '#f59e0b'
                          }}>
                            {ped.estado}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} style={{ color: 'var(--color-bc-blue)' }} />
                            <span>{ped.fecha}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ShoppingBag size={13} style={{ color: 'var(--color-bc-blue)' }} />
                            <span>{itemsCount} producto{itemsCount !== 1 ? 's' : ''}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CreditCard size={13} style={{ color: 'var(--color-bc-blue)' }} />
                            <span>{pago.metodo || 'Efectivo'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total y botón */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px', marginBottom: '2px', display: 'block' }}>Total</span>
                          <span style={{ fontSize: '17px', fontWeight: 900, color: 'white' }}>{totalConDescuento.toFixed(2)} Bs.</span>
                        </div>

                        <Link
                          href={`/pedidos/${ped.id}`}
                          style={{
                            height: '38px', padding: '0 18px',
                            background: 'var(--color-bc-orange)', color: 'white',
                            fontWeight: 700, fontSize: '11px', letterSpacing: '0.5px',
                            textTransform: 'uppercase', borderRadius: '10px', textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 4px 12px rgba(220,120,40,0.15)', transition: 'all 0.2s'
                          }}
                        >
                          Ver Detalle <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}