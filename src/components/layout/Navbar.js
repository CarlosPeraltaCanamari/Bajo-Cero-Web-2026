'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, LogOut, ClipboardList, Phone, MapPin } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useCart from '@/hooks/useCart'
import useAuthStore from '@/store/authStore'
import Image from 'next/image'

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { user, logout } = useAuthStore()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/envios', label: 'Envíos' },
    { href: '/mayorista', label: 'Mayorista' },
  ]

  return (
    <>
      {/* NAVBAR FLOTANTE PÍLDORA — desktop */}
      <header className="fixed top-5 left-0 right-0 z-50 hidden md:flex justify-center px-5">
        <nav
          className="glass rounded-full flex items-center gap-2 shadow-2xl relative"
          style={{ height: '44px', padding: '0 16px' }}
        >

          {/* Logo */}
          {/* Logo desktop */}
          <Link href="/" style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/bajocerologo.png"
              alt="Bajo Cero"
              width={80}
              height={50}
              style={{ objectFit: 'contain', height: '40px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Links */}
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-all duration-200 ${pathname === href
                ? 'bg-white/10 text-white'
                : 'text-white/55 hover:text-white hover:bg-white/8'
                }`}
              style={{
                padding: '4px 14px',
                borderRadius: '999px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {label}
            </Link>
          ))}

          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)', margin: '0 6px' }} />

          {/* Carrito */}
          <Link
            href="/carrito"
            className="relative flex items-center justify-center rounded-full text-white/55 hover:text-white hover:bg-white/10 transition-all"
            style={{ width: '34px', height: '34px', flexShrink: 0 }}
          >
            <ShoppingCart size={17} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bc-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Usuario */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-full text-white/55 hover:text-white hover:bg-white/10 transition-all font-semibold text-xs px-2.5 h-[34px] cursor-pointer"
                style={{ background: 'transparent', border: 'none' }}
              >
                <div className="w-5 h-5 rounded-full bg-bc-orange text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.nombre[0]}
                </div>
                <span>{user.nombre}</span>
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-40 glass rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-50 text-left border border-white/10"
                  style={{ background: 'rgba(8, 26, 48, 0.95)' }}
                >
                  <button
                    onClick={() => {
                      setProfileModalOpen(true)
                      setDropdownOpen(false)
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium border-none bg-transparent cursor-pointer w-full text-left"
                  >
                    <User size={13} />
                    Mi Cuenta
                  </button>
                  <Link
                    href="/pedidos"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium text-left text-decoration-none"
                  >
                    <ClipboardList size={13} />
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setDropdownOpen(false)
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors font-medium border-none bg-transparent cursor-pointer w-full text-left"
                  >
                    <LogOut size={13} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center justify-center rounded-full text-white/55 hover:text-white hover:bg-white/10 transition-all"
              style={{ width: '34px', height: '34px', flexShrink: 0 }}
            >
              <User size={17} />
            </Link>
          )}

        </nav>
      </header>

      {/* NAVBAR MOBILE */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-dark flex items-center justify-between px-4 py-3">
          <Link href="/">
            <span className="font-black text-lg text-white" style={{ fontFamily: 'var(--font-display)' }}>
              bajo cero
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/carrito" className="relative text-white/70">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-bc-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-white/70 hover:text-white transition-colors ml-1"
            >
              {menuAbierto ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="glass-dark border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAbierto(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === href
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-1" />
            {user ? (
              <>
                <button
                  onClick={() => {
                    setProfileModalOpen(true)
                    setMenuAbierto(false)
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 border-none bg-transparent text-left cursor-pointer w-full"
                >
                  <User size={16} />
                  Mi Cuenta
                </button>
                <Link
                  href="/pedidos"
                  onClick={() => setMenuAbierto(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-decoration-none"
                >
                  <ClipboardList size={16} />
                  Mis Pedidos
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMenuAbierto(false)
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/10 transition-all flex items-center gap-2 border-none bg-transparent text-left cursor-pointer w-full"
                >
                  <LogOut size={16} />
                  Cerrar sesión ({user.nombre})
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMenuAbierto(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all text-decoration-none"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </header>

      {/* MODAL DETALLES DE CUENTA ("Mi Perfil") */}
      {profileModalOpen && user && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setProfileModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#081a30',
              border: '1px solid rgba(168,212,224,0.15)',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '420px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              color: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de Cerrar */}
            <button
              onClick={() => setProfileModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px'
              }}
              className="hover:text-white transition-colors"
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'var(--color-bc-orange)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 12px',
                  fontSize: '24px',
                  fontWeight: 900,
                  textTransform: 'uppercase'
                }}
              >
                {user.nombre[0]}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, margin: 0 }}>
                {user.nombre} {user.apellido}
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Cliente Bajo Cero
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              {/* CI */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <User size={16} color="var(--color-bc-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Documento de Identidad (CI)</span>
                  <span style={{ fontWeight: 700 }}>{user.ci}</span>
                </div>
              </div>

              {/* Teléfono */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Phone size={16} color="var(--color-bc-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Teléfono / Celular</span>
                  <span style={{ fontWeight: 700 }}>{user.telefono}</span>
                </div>
              </div>

              {/* Dirección */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <MapPin size={16} color="var(--color-bc-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)' }}>Dirección de Entrega</span>
                  <span style={{ fontWeight: 700, lineHeight: 1.4 }}>{user.direccion}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => setProfileModalOpen(false)}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-white/12 active:scale-98"
              >
                Cerrar
              </button>
              
              <button
                onClick={() => {
                  logout()
                  setProfileModalOpen(false)
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(244,63,94,0.1)',
                  color: '#f43f5e',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(244,63,94,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-rose-950/20 active:scale-98"
              >
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}