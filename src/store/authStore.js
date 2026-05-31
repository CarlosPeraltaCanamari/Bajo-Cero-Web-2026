import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { ci, nombre, apellido, telefono, direccion, nit, habilitado_plan_pagos }
      cargando: false,
      error: null,

      login: async (ci, contrasena) => {
        set({ cargando: true, error: null })
        const supabase = createClient()
        
        try {
          const cleanCi = ci.trim()
          const { data: cliente, error: fetchError } = await supabase
            .from('cliente')
            .select('*')
            .eq('ci', cleanCi)
            .maybeSingle()

          if (fetchError) {
            throw new Error(`Error en el servidor: ${fetchError.message}`)
          }

          if (!cliente) {
            set({ error: 'El CI ingresado no está registrado.', cargando: false })
            return false
          }

          if (!cliente.contrasena) {
            set({ error: 'Este cliente no tiene contraseña configurada. Por favor regístrate primero.', cargando: false })
            return false
          }

          if (cliente.contrasena !== contrasena) {
            set({ error: 'Contraseña incorrecta.', cargando: false })
            return false
          }

          // Login exitoso
          set({ user: cliente, cargando: false })
          // Guardar CI de manera conveniente para historial de pedidos
          localStorage.setItem('bajocero_ultimo_ci', cliente.ci)
          return true
        } catch (err) {
          set({ error: err.message, cargando: false })
          return false
        }
      },

      registro: async (clienteData) => {
        set({ cargando: true, error: null })
        const supabase = createClient()
        const { ci, nombre, apellido, telefono, direccion, contrasena } = clienteData

        try {
          const cleanCi = ci.trim()
          
          // Verificar si existe el CI
          const { data: clienteExistente } = await supabase
            .from('cliente')
            .select('*')
            .eq('ci', cleanCi)
            .maybeSingle()

          if (clienteExistente && clienteExistente.contrasena) {
            set({ error: 'Este CI ya se encuentra registrado con una contraseña.', cargando: false })
            return false
          }

          let finalUser = null

          if (clienteExistente) {
            // Si ya existe pero no tiene contraseña (creado en checkout previo), lo actualizamos
            const { data: updatedClient, error: updateError } = await supabase
              .from('cliente')
              .update({
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                direccion: direccion.trim(),
                contrasena: contrasena
              })
              .eq('ci', cleanCi)
              .select()
              .single()

            if (updateError) throw updateError
            finalUser = updatedClient
          } else {
            // Si no existe, creamos un nuevo cliente
            const { data: newClient, error: insertError } = await supabase
              .from('cliente')
              .insert({
                ci: cleanCi,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                direccion: direccion.trim(),
                contrasena: contrasena,
                habilitado_plan_pagos: false
              })
              .select()
              .single()

            if (insertError) throw insertError
            finalUser = newClient
          }

          set({ user: finalUser, cargando: false })
          localStorage.setItem('bajocero_ultimo_ci', finalUser.ci)
          return true
        } catch (err) {
          set({ error: err.message, cargando: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, error: null })
      },

      setUser: (user) => set({ user })
    }),
    {
      name: 'bajocero-auth',
    }
  )
)

export default useAuthStore
