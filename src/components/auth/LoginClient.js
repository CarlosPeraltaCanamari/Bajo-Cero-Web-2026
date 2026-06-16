'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Lock, LogIn, KeyRound } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import useAuthStore from '@/store/authStore'

const inputStyle = {
  width: '100%', height: '44px', padding: '0 16px 0 44px',
  borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', color: 'white',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', display: 'block',
}

export default function LoginClient() {
  const router = useRouter()
  const { login, cargando, error } = useAuthStore()
  
  const [ci, setCi] = useState('')
  const [contrasena, setContrasena] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const cleanCi = ci.trim()
    if (!cleanCi || !contrasena) {
      toast.error('Completa todos los campos')
      return
    }

    // Validación de formato de CI
    const ciRegex = /^[a-zA-Z0-9-]{5,12}$/
    if (!ciRegex.test(cleanCi)) {
      toast.error('El CI debe tener entre 5 y 12 caracteres y contener solo letras, números y guiones')
      return
    }

    // Validación de longitud de contraseña
    if (contrasena.length < 6 || contrasena.length > 32) {
      toast.error('La contraseña debe tener entre 6 y 32 caracteres')
      return
    }

    const exito = await login(cleanCi, contrasena)
    if (exito) {
      toast.success('Sesión iniciada correctamente')
      const target = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/pedidos' : '/pedidos'
      router.push(target)
    }
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Toaster position="bottom-right" />
      
      {/* Glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '30%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '30%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Volver */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={13} /> Inicio
        </Link>

        {/* Card */}
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifycontent: 'center', margin: '0 auto 16px', justifyContent: 'center' }}>
              <KeyRound size={24} color="var(--color-bc-orange)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, margin: '0 0 8px' }}>Iniciar Sesión</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Accede a tu cuenta de cliente en Bajo Cero</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* CI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={labelStyle}>CI / Documento de Identidad</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  required
                  placeholder="Ingresa tu CI"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={labelStyle}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Error local de Zustand */}
            {error && (
              <div style={{ padding: '12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%', height: '46px', borderRadius: '999px',
                background: cargando ? 'rgba(255,255,255,0.1)' : 'var(--color-bc-orange)',
                color: cargando ? 'rgba(255,255,255,0.3)' : 'white',
                fontWeight: 700, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase',
                border: 'none', cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s', marginTop: '8px',
                boxShadow: cargando ? 'none' : '0 8px 24px rgba(220,120,40,0.2)'
              }}
            >
              {cargando ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Entrando...</>
              ) : (
                <><LogIn size={15} /> Entrar</>
              )}
            </button>
          </form>

          {/* Enlace a Registro */}
          <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            ¿No tienes contraseña configurada?{' '}
            <Link href={`/auth/registro${typeof window !== 'undefined' ? window.location.search : ''}`} style={{ color: 'var(--color-bc-orange)', fontWeight: 600, textDecoration: 'none' }}>
              Regístrate aquí
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
