'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Tag, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useCart from '@/hooks/useCart'

export default function CarritoClient() {
  const { items, subtotal, isEmpty, removeItem, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  const [codigoCupon, setCodigoCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [errorCupon, setErrorCupon] = useState('')

  const aplicarCupon = () => {
    setErrorCupon('')
    const codigo = codigoCupon.trim().toUpperCase()
    if (codigo === 'BAJOCERO10') {
      setCuponAplicado({ codigo: 'BAJOCERO10', porcentaje: 10 })
      setCodigoCupon('')
    } else if (codigo === 'PROMO20') {
      setCuponAplicado({ codigo: 'PROMO20', porcentaje: 20 })
      setCodigoCupon('')
    } else {
      setErrorCupon('Cupón inválido. Prueba con BAJOCERO10.')
    }
  }

  const descuento = cuponAplicado ? (subtotal * cuponAplicado.porcentaje) / 100 : 0
  const total = subtotal - descuento

  const handleCheckout = () => {
    if (cuponAplicado) {
      localStorage.setItem('bajocero_descuento_porcentaje', String(cuponAplicado.porcentaje))
      localStorage.setItem('bajocero_descuento_codigo', cuponAplicado.codigo)
    } else {
      localStorage.removeItem('bajocero_descuento_porcentaje')
      localStorage.removeItem('bajocero_descuento_codigo')
    }
    router.push('/checkout')
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '80px',
      background: '#020b18',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glows */}
      <div style={{ position: 'absolute', top: '-100px', right: '10%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '5%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }} className="px-4 sm:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div>
            <Link href="/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '12px' }}>
              <ArrowLeft size={13} /> Volver al catálogo
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
              Mi Carrito
            </h1>
          </div>
          {!isEmpty && (
            <button onClick={clearCart} style={{
              color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '1px', textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
              padding: '8px 16px', background: 'rgba(255,255,255,0.04)',
              cursor: 'pointer', transition: 'all 0.2s'
            }} className="mt-2 sm:mt-8 self-start sm:self-auto hover:bg-white/10 hover:text-white">
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Carrito vacío */}
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '32px', padding: '80px 24px', textAlign: 'center',
              maxWidth: '480px', margin: '40px auto',
            }}
          >
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <ShoppingCart size={30} color="var(--color-bc-orange)" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'white' }}>Tu carrito está vacío</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto 32px' }}>
              Explora nuestra tienda y selecciona tus formatos favoritos.
            </p>
            <Link href="/catalogo" style={{
              display: 'inline-block', padding: '12px 32px',
              background: 'var(--color-bc-orange)', color: 'white',
              fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px',
              textTransform: 'uppercase', borderRadius: '999px', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(220,120,40,0.25)',
            }}>
              Comenzar a comprar
            </Link>
          </motion.div>

        ) : (
          /* Layout dos columnas */
          <div style={{ alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7">

            {/* Lista productos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.producto_id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border border-white/8 bg-white/4 rounded-2xl transition-colors duration-200 hover:border-white/12"
                  >
                    {/* Bloque info: Imagen e Info de Producto */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Imagen */}
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '14px',
                        background: item.imagen ? '#F4F8FC' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, overflow: 'hidden',
                      }}>
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                        ) : (
                          <ShoppingCart size={22} color="rgba(255,255,255,0.2)" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 style={{ fontWeight: 700, fontSize: '15px', color: 'white', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.nombre}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                          Precio unitario: {item.precio.toFixed(2)} Bs.
                        </p>
                      </div>
                    </div>

                    {/* Bloque acciones: Cantidad, Total, Eliminar */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0">
                      {/* Cantidad */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '999px', padding: '4px',
                      }}>
                        <button onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: 'white' }}>
                          {item.cantidad}
                        </span>
                        <button onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Total item */}
                      <div style={{ textAlign: 'right', minWidth: '72px' }}>
                        <span style={{ fontWeight: 900, fontSize: '16px', color: 'white' }}>
                          {(item.precio * item.cantidad).toFixed(2)}
                        </span>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '3px', fontWeight: 700, textTransform: 'uppercase' }}>Bs.</span>
                      </div>

                      {/* Eliminar */}
                      <button onClick={() => removeItem(item.producto_id)} style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', transition: 'all 0.2s', flexShrink: 0 }} className="hover:text-rose-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Resumen sticky */}
            <div className="lg:sticky lg:top-24">
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '20px',
              }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'white', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: 0 }}>
                  Resumen de Compra
                </h2>

                {/* Cupón */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
                    ¿Tienes un cupón de descuento?
                  </span>

                  {cuponAplicado ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                        <Check size={14} />
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{cuponAplicado.codigo} (-{cuponAplicado.porcentaje}%)</span>
                      </div>
                      <button onClick={() => setCuponAplicado(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34d399', display: 'flex' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Tag size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                        <input
                          type="text"
                          placeholder="Código de cupón"
                          value={codigoCupon}
                          onChange={(e) => { setCodigoCupon(e.target.value); setErrorCupon('') }}
                          onKeyDown={(e) => e.key === 'Enter' && aplicarCupon()}
                          style={{ width: '100%', height: '40px', paddingLeft: '36px', paddingRight: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <button onClick={aplicarCupon} style={{ padding: '0 16px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                        Aplicar
                      </button>
                    </div>
                  )}
                  {errorCupon && <span style={{ fontSize: '11px', color: '#fb7185', fontWeight: 500 }}>{errorCupon}</span>}
                </div>

                {/* Desglose */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Subtotal</span><span>{subtotal.toFixed(2)} Bs.</span>
                  </div>
                  {cuponAplicado && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                      <span>Descuento ({cuponAplicado.porcentaje}%)</span>
                      <span>-{descuento.toFixed(2)} Bs.</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.5)' }}>
                    <span>Envío (Sucre / Santa Cruz)</span>
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Gratis</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>Total</span>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: 'white' }}>{total.toFixed(2)}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Bs.</span>
                  </div>
                </div>

                {/* Botón */}
                <button onClick={handleCheckout} style={{
                  width: '100%', height: '50px', borderRadius: '999px',
                  background: 'var(--color-bc-orange)', color: 'white',
                  fontWeight: 700, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(220,120,40,0.25)',
                }}>
                  <ShoppingCart size={15} />
                  Proceder al Pago
                </button>

                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                  Entrega en 24h en Sucre o Santa Cruz. Pago al recibir o por QR.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}