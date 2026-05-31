'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, LogOut, ClipboardList } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import useCart from '@/hooks/useCart'
import useAuthStore from '@/store/authStore'
import Image from 'next/image'

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
                  style={{ background: 'rgba(7,16,15,0.95)' }}
                >
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
    </>
  )
}