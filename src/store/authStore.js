import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginAction, registroAction } from '@/app/actions/auth'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { ci, nombre, apellido, telefono, direccion, nit, habilitado_plan_pagos }
      cargando: false,
      error: null,

      login: async (ci, contrasena) => {
        set({ cargando: true, error: null })
        
        try {
          const res = await loginAction(ci, contrasena)

          if (!res.success) {
            set({ error: res.error, cargando: false })
            return false
          }

          // Login exitoso
          set({ user: res.user, cargando: false })
          localStorage.setItem('bajocero_ultimo_ci', res.user.ci)
          return true
        } catch (err) {
          set({ error: err.message, cargando: false })
          return false
        }
      },

      registro: async (clienteData) => {
        set({ cargando: true, error: null })

        try {
          const res = await registroAction(clienteData)

          if (!res.success) {
            set({ error: res.error, cargando: false })
            return false
          }

          set({ user: res.user, cargando: false })
          localStorage.setItem('bajocero_ultimo_ci', res.user.ci)
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
