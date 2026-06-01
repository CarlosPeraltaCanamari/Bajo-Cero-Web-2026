import { createClient } from '@/lib/supabase/server'
import CatalogoClient from './CatalogoClient'

export const revalidate = 0

export const metadata = {
  title: 'Catálogo de Agua Purificada | Pedir Online en Sucre y Santa Cruz',
  description: 'Compra agua premium a domicilio. Bidones de 20 litros, botellas de agua de mesa, dispensadores y recargas para tu hogar u oficina en Sucre y Santa Cruz de la Sierra. Envíos gratis en 24h.',
  keywords: ['comprar bidon de agua sucre', 'comprar agua a domicilio santa cruz', 'recarga de agua sucre', 'agua purificada de mesa bolivia', 'catalogo bajo cero', 'dispensador de agua bolivia'],
}

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