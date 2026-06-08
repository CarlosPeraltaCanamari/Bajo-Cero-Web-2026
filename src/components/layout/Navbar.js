'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, LogOut, ClipboardList, Phone, MapPin, Home, Droplet, Truck, Sparkles } from 'lucide-react'
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
  const router = useRouter()
  const { totalItems, toggleCartDrawer } = useCart()
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

  const mobileTabs = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/catalogo', label: 'Catálogo', icon: Droplet },
    { href: '/envios', label: 'Envíos', icon: Truck },
    { href: '/mayorista', label: 'Mayorista', icon: Sparkles },
    { href: '#profile', label: 'Cuenta', icon: User },
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
          <button
            onClick={toggleCartDrawer}
            className="relative flex items-center justify-center rounded-full text-white/55 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            style={{ width: '34px', height: '34px', flexShrink: 0, background: 'transparent', border: 'none', padding: 0 }}
          >
            <ShoppingCart size={17} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bc-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

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
      {/* TOP HEADER MOBILE (LOGO ONLY) */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 md:hidden flex justify-between items-center px-4 py-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(2, 11, 24, 0.95), rgba(2, 11, 24, 0))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/bajocerologo.png"
            alt="Bajo Cero"
            width={70}
            height={36}
            style={{ objectFit: 'contain', height: '30px', width: 'auto' }}
            priority
          />
        </Link>
      </div>

      {/* BOTTOM TAB BAR MOBILE */}
      <div 
        className="fixed z-50 md:hidden flex items-center justify-center gap-3 px-4 w-full"
        style={{
          bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Main capsule */}
        <nav
          className="flex items-center justify-around flex-1 shadow-2xl relative"
          style={{
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(8, 26, 48, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 4px',
          }}
        >
          {mobileTabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === '#profile' && profileModalOpen)
            const Icon = tab.icon

            const handleTabClick = (e) => {
              if (tab.href === '#profile') {
                e.preventDefault()
                if (user) {
                  setProfileModalOpen(true)
                } else {
                  router.push('/auth/login')
                }
              }
            }

            return (
              <Link
                key={tab.label}
                href={tab.href}
                onClick={handleTabClick}
                className="flex flex-col items-center justify-center relative flex-1 h-full select-none cursor-pointer text-decoration-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-x-1.5 inset-y-2 rounded-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                
                <div 
                  className="flex flex-col items-center justify-center relative z-10 transition-colors duration-200"
                  style={{
                    color: isActive ? '#A8D4E0' : 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                  <span style={{ fontSize: '9px', fontWeight: isActive ? 800 : 500, marginTop: '3px', letterSpacing: '0.3px' }}>
                    {tab.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Separate circular ShoppingCart button */}
        <button
          onClick={toggleCartDrawer}
          className="flex items-center justify-center shadow-2xl relative shrink-0 transition-transform active:scale-95 border-none cursor-pointer"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(8, 26, 48, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            padding: 0,
          }}
        >
          <ShoppingCart size={21} style={{ color: 'white' }} />
          {totalItems > 0 && (
            <span 
              className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 bg-bc-orange text-white text-[10px] font-black rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: '#020b18',
                boxShadow: '0 4px 12px rgba(220,120,40,0.3)',
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

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