'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight, Lock } from 'lucide-react'
import useCart from '@/hooks/useCart'

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    isEmpty,
    removeItem,
    updateQuantity,
    isCartDrawerOpen,
    setCartDrawerOpen,
  } = useCart()

  const router = useRouter()
  const pathname = usePathname()
  const drawerRef = useRef(null)

  // Cerrar el drawer cuando cambia la ruta
  useEffect(() => {
    setCartDrawerOpen(false)
  }, [pathname, setCartDrawerOpen])

  // Evitar scroll en el body cuando el drawer está abierto
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartDrawerOpen])

  const handleCheckout = () => {
    setCartDrawerOpen(false)
    router.push('/checkout')
  }

  const handleVerCarrito = () => {
    setCartDrawerOpen(false)
    router.push('/carrito')
  }

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Fondo traslúcido overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
            }}
          />

          {/* Drawer contenedor */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '440px',
              background: '#040d1e',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10000,
              color: 'white',
            }}
          >
            {/* Glow decorativo de fondo */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 74, 143, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Cabecera */}
            <div style={{
              padding: '24px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 10
            }} className="justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-bc-orange" />
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 900,
                  margin: 0
                }}>
                  Mi Carrito
                </h2>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s',
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Drawer (Scrollable) */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              position: 'relative',
              zIndex: 10,
            }} className="custom-scrollbar">
              {isEmpty ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '70%',
                  textAlign: 'center',
                  padding: '24px',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <ShoppingCart size={24} color="rgba(255, 255, 255, 0.25)" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Tu carrito está vacío</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    maxWidth: '240px',
                    marginBottom: '28px',
                  }}>
                    Explora nuestro catálogo y selecciona agua purificada premium.
                  </p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    style={{
                      padding: '10px 24px',
                      background: 'var(--color-bc-orange)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(220,120,40,0.25)',
                      transition: 'all 0.2s',
                    }}
                    className="hover:scale-105 active:scale-98"
                  >
                    Ver Productos
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.producto_id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '16px',
                          alignItems: 'center',
                          position: 'relative',
                        }}
                      >
                        {/* Imagen del item */}
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          background: item.imagen ? '#F4F8FC' : 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {item.imagen ? (
                            <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                          ) : (
                            <ShoppingCart size={18} color="rgba(255, 255, 255, 0.15)" />
                          )}
                        </div>

                        {/* Detalle */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            margin: '0 0 4px 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'white'
                          }}>
                            {item.nombre}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                            {/* Control Cantidad */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '999px',
                              padding: '2px',
                            }}>
                              <button
                                onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Minus size={10} />
                              </button>
                              <span style={{
                                width: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textAlign: 'center'
                              }}>
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Total item */}
                            <span style={{ fontSize: '13px', fontWeight: 900, color: 'white' }}>
                              {(item.precio * item.cantidad).toFixed(2)} Bs.
                            </span>
                          </div>
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => removeItem(item.producto_id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.25)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            marginLeft: '4px',
                            transition: 'all 0.2s',
                          }}
                          className="hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer de Drawer */}
            {!isEmpty && (
              <div style={{
                padding: '24px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(2, 11, 24, 0.4)',
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {/* Desglose */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} Bs.</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <span>Envío (Sucre / SCZ)</span>
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Gratis</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    marginTop: '4px'
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '14px' }}>Total Estimado</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'white' }}>
                      {subtotal.toFixed(2)} <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 700 }}>Bs.</span>
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={handleCheckout}
                    style={{
                      width: '100%',
                      height: '46px',
                      background: 'var(--color-bc-orange)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(220, 120, 40, 0.25)',
                      transition: 'all 0.2s',
                    }}
                    className="hover:scale-[1.02] active:scale-98"
                  >
                    Proceder al Pago
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={handleVerCarrito}
                    style={{
                      width: '100%',
                      height: '44px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:bg-white/10 active:scale-98"
                  >
                    Ver Carrito Completo
                  </button>
                </div>

                {/* Información extra */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '9px',
                  textAlign: 'center'
                }}>
                  <Lock size={9} />
                  <span>Transacción segura • Entrega en 24h</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
