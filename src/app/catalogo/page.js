import { createClient } from '@/lib/supabase/server'
import CatalogoClient from './CatalogoClient'

export const revalidate = 0

export default async function CatalogoPage() {
  const supabase = await createClient()
  
  const { data: productos, error } = await supabase
    .from('producto')
    .select('*')
    .eq('estado', 'Activo')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error al cargar productos desde Supabase:', error)
  }

  return (
    <CatalogoClient productosIniciales={productos || []} />
  )
}