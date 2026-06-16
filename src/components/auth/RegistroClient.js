'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Lock, UserPlus, Phone, MapPin } from 'lucide-react'
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
  letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', display: 'block',
}

export default function RegistroClient() {
  const router = useRouter()
  const { registro, cargando, error } = useAuthStore()

  const [ci, setCi] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [contrasena, setContrasena] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const cleanCi = ci.trim()
    const cleanNombre = nombre.trim()
    const cleanApellido = apellido.trim()
    const cleanTelefono = telefono.trim()
    const cleanDireccion = direccion.trim()

    if (!cleanCi || !cleanNombre || !cleanApellido || !cleanTelefono || !cleanDireccion || !contrasena) {
      toast.error('Por favor completa todos los campos')
      return
    }

    // Validación de CI
    const ciRegex = /^[a-zA-Z0-9-]{5,12}$/
    if (!ciRegex.test(cleanCi)) {
      toast.error('El CI debe tener entre 5 y 12 caracteres y contener solo letras, números y guiones')
      return
    }

    // Validación de Nombre
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,50}$/
    if (!nameRegex.test(cleanNombre)) {
      toast.error('El nombre debe tener entre 2 y 50 caracteres y contener solo letras y espacios')
      return
    }

    // Validación de Apellido
    if (!nameRegex.test(cleanApellido)) {
      toast.error('El apellido debe tener entre 2 y 50 caracteres y contener solo letras y espacios')
      return
    }

    // Validación de Teléfono
    const telefonoRegex = /^\+?[0-9\s-]{7,15}$/
    if (!telefonoRegex.test(cleanTelefono)) {
      toast.error('El teléfono debe tener entre 7 y 15 dígitos')
      return
    }

    // Validación de Dirección
    if (cleanDireccion.length < 5 || cleanDireccion.length > 150) {
      toast.error('La dirección debe tener entre 5 y 150 caracteres')
      return
    }
    if (cleanDireccion.includes('<') || cleanDireccion.includes('>')) {
      toast.error('La dirección contiene caracteres no permitidos')
      return
    }

    // Validación de Contraseña
    if (contrasena.length < 6 || contrasena.length > 32) {
      toast.error('La contraseña debe tener entre 6 y 32 caracteres')
      return
    }

    const exito = await registro({
      ci: cleanCi,
      nombre: cleanNombre,
      apellido: cleanApellido,
      telefono: cleanTelefono,
      direccion: cleanDireccion,
      contrasena
    })

    if (exito) {
      toast.success('¡Registro exitoso! Iniciando sesión...')
      const target = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/pedidos' : '/pedidos'
      router.push(target)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '80px',
      background: '#07100F',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Toaster position="bottom-right" />

      {/* Glows */}
      <div style={{ position: 'absolute', top: '-100px', right: '25%', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,74,143,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '25%', width: '400px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,120,40,0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', padding: '0 24px', position: 'relative', zIndex: 10 }}>

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
            padding: '36px 28px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UserPlus size={24} color="var(--color-bc-orange)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, margin: '0 0 6px' }}>Crear Cuenta</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Regístrate o configura tu contraseña si ya compraste antes</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* CI */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={labelStyle}>CI / Documento de Identidad *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input type="text" required placeholder="Ej. 7465086" value={ci} onChange={(e) => setCi(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* Nombre */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={labelStyle}>Nombre *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input type="text" required placeholder="Ej. Daniel" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* Apellido */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <label style={labelStyle}>Apellido *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input type="text" required placeholder="Ej. Zambrana" value={apellido} onChange={(e) => setApellido(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={labelStyle}>Teléfono / Celular *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input type="tel" required placeholder="Ej. 71808300" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Dirección */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={labelStyle}>Dirección de entrega *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input type="text" required placeholder="Calle, Nro., Edificio, Zona" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Contraseña */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <label style={labelStyle}>Elige una contraseña *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" required placeholder="••••••••" value={contrasena} onChange={(e) => setContrasena(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Error de Zustand */}
            {error && (
              <div style={{ padding: '12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '12px', color: '#f43f5e', fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Enviar */}
            <button
              type="submit"
              disabled={cargando}
              style={{
                width: '100%', height: '46px', borderRadius: '999px',
                background: cargando ? 'rgba(255,255,255,0.1)' : 'var(--color-bc-orange)',
                color: cargando ? 'rgba(255,255,255,0.3)' : 'white',
                fontWeight: 700, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase',
                border: 'none', cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '8px',
                transition: 'all 0.2s', marginTop: '10px', justifyContent: 'center',
                boxShadow: cargando ? 'none' : '0 8px 24px rgba(220,120,40,0.2)'
              }}
            >
              {cargando ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Registrando...</>
              ) : (
                <><UserPlus size={15} /> Registrarse y Entrar</>
              )}
            </button>
          </form>

          {/* Enlace a Login */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link href={`/auth/login${typeof window !== 'undefined' ? window.location.search : ''}`} style={{ color: 'var(--color-bc-orange)', fontWeight: 600, textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
