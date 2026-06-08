'use server'

import { createClient } from '@/lib/supabase/server'
import { hashPassword, verifyPassword } from '@/utils/crypto'

/**
 * Server action for logging in a customer.
 * Compares the provided password with the stored hash using scrypt.
 * Auto-migrates plaintext passwords on first successful login.
 * @param {string} ci Customer CI
 * @param {string} contrasena Plaintext password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function loginAction(ci, contrasena) {
  try {
    const cleanCi = ci.trim()
    const supabase = await createClient()

    const { data: cliente, error: fetchError } = await supabase
      .from('cliente')
      .select('*')
      .eq('ci', cleanCi)
      .maybeSingle()

    if (fetchError) {
      return { success: false, error: `Error en el servidor: ${fetchError.message}` }
    }

    if (!cliente) {
      return { success: false, error: 'El CI ingresado no está registrado.' }
    }

    if (!cliente.contrasena) {
      return { success: false, error: 'Este cliente no tiene contraseña configurada. Por favor regístrate primero.' }
    }

    const matches = await verifyPassword(contrasena, cliente.contrasena)
    if (!matches) {
      return { success: false, error: 'Contraseña incorrecta.' }
    }

    // Migración automática de contraseña a hash seguro si es texto plano
    if (!cliente.contrasena.includes(':')) {
      const hashed = await hashPassword(contrasena)
      const { error: updateError } = await supabase
        .from('cliente')
        .update({ contrasena: hashed })
        .eq('ci', cleanCi)
      
      if (updateError) {
        console.error('Error al migrar contraseña a hash seguro:', updateError)
      } else {
        cliente.contrasena = hashed
      }
    }

    return { success: true, user: cliente }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Server action for registering a new customer.
 * Hashes the password on the server before insertion.
 * @param {object} clienteData Registration data
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function registroAction(clienteData) {
  try {
    const supabase = await createClient()
    const { ci, nombre, apellido, telefono, direccion, contrasena } = clienteData
    const cleanCi = ci.trim()

    // Verificar si existe el CI
    const { data: clienteExistente, error: checkError } = await supabase
      .from('cliente')
      .select('*')
      .eq('ci', cleanCi)
      .maybeSingle()

    if (checkError) throw checkError

    if (clienteExistente && clienteExistente.contrasena) {
      return { success: false, error: 'Este CI ya se encuentra registrado con una contraseña.' }
    }

    // Hashear la contraseña en el servidor
    const hashedContrasena = await hashPassword(contrasena)
    let finalUser = null

    if (clienteExistente) {
      // Si ya existe pero no tiene contraseña (creado en checkout previo), actualizamos
      const { data: updatedClient, error: updateError } = await supabase
        .from('cliente')
        .update({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
          contrasena: hashedContrasena
        })
        .eq('ci', cleanCi)
        .select()
        .single()

      if (updateError) throw updateError
      finalUser = updatedClient
    } else {
      // Si no existe, creamos
      const { data: newClient, error: insertError } = await supabase
        .from('cliente')
        .insert({
          ci: cleanCi,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
          contrasena: hashedContrasena,
          habilitado_plan_pagos: false
        })
        .select()
        .single()

      if (insertError) throw insertError
      finalUser = newClient
    }

    return { success: true, user: finalUser }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
