'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Plus, Minus, ArrowUpDown, Droplet } from 'lucide-react'
import useCart from '@/hooks/useCart'
import { Toaster, toast } from 'react-hot-toast'

export default function CatalogoClient({ productosIniciales = [] }) {
  const { addItem, setCartDrawerOpen } = useCart()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [orden, setOrden] = useState('defecto')
  const [cantidades, setCantidades] = useState({})

  const categorias = useMemo(() => {
    const cats = productosIniciales.map((p) => p.categoria)
    return ['Todos', ...new Set(cats.filter(Boolean))]
  }, [productosIniciales])

  const productosFiltrados = useMemo(() => {
    let resultado = [...productosIniciales]
    if (busqueda.trim() !== '') {
      const query = busqueda.toLowerCase()
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(query))
    }
    if (categoriaActiva !== 'Todos') {
      resultado = resultado.filter((p) => p.categoria === categoriaActiva)
    }
    if (orden === 'precio-asc') resultado.sort((a, b) => Number(a.precio_venta) - Number(b.precio_venta))
    else if (orden === 'precio-desc') resultado.sort((a, b) => Number(b.precio_venta) - Number(a.precio_venta))
    return resultado
  }, [productosIniciales, busqueda, categoriaActiva, orden])

  const obtenerCantidad = (id) => cantidades[id] || 1

  const cambiarCantidad = (id, delta) => {
    setCantidades((prev) => {
      const actual = prev[id] || 1
      return { ...prev, [id]: Math.max(1, actual + delta) }
    })
  }

  const handleAgregarAlCarrito = (producto) => {
    const cantidad = obtenerCantidad(producto.id)
    addItem({ ...producto, imagen: producto.url || null }, cantidad)
    setCartDrawerOpen(true)
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold text-sm">¡Agregado al carrito!</span>
        <span className="text-xs text-white/60">{cantidad}x {producto.nombre}</span>
      </div>,
      {
        duration: 3000,
        style: {
          background: '#081a30', color: '#fff',
          border: '1px solid rgba(168,212,224,0.2)', borderRadius: '16px',
        },
        iconTheme: { primary: '#DC7828', secondary: '#fff' },
      }
    )
    setCantidades((prev) => ({ ...prev, [producto.id]: 1 }))
  }

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '100px',   /* espacio bajo el navbar fijo */
      paddingBottom: '80px',
      background: '#020b18',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster position="bottom-right" />

      {/* Glows de fondo */}
      <div style={{
        position: 'absolute', top: '-100px', left: '25%',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,74,143,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '25%',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(220,120,40,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>

        {/* ENCABEZADO */}
        <div style={{ textAlign: 'center', marginBottom: '56px', maxWidth: '600px', margin: '0 auto 56px' }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ fontSize: '10px', color: 'rgba(168,212,224,0.5)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500 }}
          >
            Pureza garantizada
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.05, letterSpacing: '-1px' }}
          >
            Catálogo de Pureza
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.7 }}
          >
            Elige el formato ideal de nuestra agua premium. Frescura y bienestar directo a tu puerta.
          </motion.p>
        </div>

        {/* FILTROS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}
        >
          {/* Buscador */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} size={18} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%', height: '48px', paddingLeft: '52px', paddingRight: '20px',
                borderRadius: '14px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Orden */}
          <div style={{ position: 'relative', width: '220px' }}>
            <ArrowUpDown style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} size={15} />
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              style={{
                width: '100%', height: '48px', paddingLeft: '44px', paddingRight: '16px',
                borderRadius: '14px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)',
                fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="defecto" style={{ background: '#081a30' }}>Relevancia</option>
              <option value="precio-asc" style={{ background: '#081a30' }}>Precio: Menor a Mayor</option>
              <option value="precio-desc" style={{ background: '#081a30' }}>Precio: Mayor a Menor</option>
            </select>
          </div>
        </motion.div>

        {/* TABS CATEGORÍAS */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '48px' }}
        >
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                padding: '8px 22px', borderRadius: '999px', fontSize: '13px',
                fontWeight: 600, letterSpacing: '0.3px', cursor: 'pointer',
                transition: 'all 0.25s',
                background: categoriaActiva === cat ? 'var(--color-bc-orange)' : 'rgba(255,255,255,0.06)',
                color: categoriaActiva === cat ? 'white' : 'rgba(255,255,255,0.55)',
                border: categoriaActiva === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: categoriaActiva === cat ? '0 4px 20px rgba(220,120,40,0.3)' : 'none',
                transform: categoriaActiva === cat ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* GRID */}
        {productosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px', padding: '64px 32px', textAlign: 'center', maxWidth: '400px', margin: '0 auto',
            }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <Search size={22} color="rgba(255,255,255,0.3)" />
            </div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Sin resultados</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.6 }}>
              Intenta cambiar los términos de búsqueda o selecciona otra categoría.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}
          >
            <AnimatePresence mode="popLayout">
              {productosFiltrados.map((prod) => {
                const cantidad = obtenerCantidad(prod.id)
                return (
                  <motion.div
                    layout key={prod.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '24px',
                      padding: '20px',
                      display: 'flex', flexDirection: 'column',
                      transition: 'all 0.3s',
                      cursor: 'default',
                    }}
                    whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,74,143,0.25)', borderColor: 'rgba(123,184,200,0.2)' }}
                  >
                    {/* Imagen */}
                    <div style={{
                      width: '100%', aspectRatio: '1 / 1',
                      borderRadius: '16px',
                      background: prod.url ? '#F4F8FC' : 'rgba(255,255,255,0.04)',
                      border: prod.url ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', marginBottom: '20px', position: 'relative',
                      flexShrink: 0,
                    }}>
                      {/* Tag categoría */}
                      <span style={{
                        position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                        padding: '3px 10px', borderRadius: '999px',
                        fontSize: '9px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
                        background: 'var(--color-bc-blue)', color: 'white',
                      }}>
                        {prod.categoria}
                      </span>

                      {prod.url ? (
                        <img
                          src={prod.url}
                          alt={prod.nombre}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            padding: '20px',
                            boxSizing: 'border-box',
                          }}
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <Droplet size={36} color="rgba(0,74,143,0.6)" />
                          <span style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>Bajo Cero</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <h3 style={{ color: 'white', fontWeight: 800, fontSize: '17px', marginBottom: '4px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                          {prod.nombre}
                        </h3>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                          {prod.categoria}
                        </p>
                      </div>

                      {/* Precio */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                          {prod.precio_venta}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Bs.</span>
                      </div>

                      {/* Controles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Cantidad */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '999px', padding: '4px', gap: '2px',
                          flexShrink: 0,
                        }}>
                          <button
                            onClick={() => cambiarCantidad(prod.id, -1)}
                            disabled={cantidad <= 1}
                            style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              border: 'none', background: 'transparent', cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: cantidad <= 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: 'white' }}>
                            {cantidad}
                          </span>
                          <button
                            onClick={() => cambiarCantidad(prod.id, 1)}
                            style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              border: 'none', background: 'transparent', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s',
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Agregar */}
                        <button
                          onClick={() => handleAgregarAlCarrito(prod)}
                          style={{
                            flex: 1, height: '40px',
                            background: 'var(--color-bc-orange)',
                            color: 'white', fontWeight: 700, fontSize: '12px',
                            textTransform: 'uppercase', letterSpacing: '1px',
                            borderRadius: '999px', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 16px rgba(220,120,40,0.25)',
                          }}
                        >
                          <ShoppingBag size={13} />
                          Agregar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}