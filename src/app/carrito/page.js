import CarritoClient from '@/components/carrito/CarritoClient'

export const metadata = {
  title: 'Carrito de Compras — Bajo Cero',
  description: 'Revisa los productos en tu carrito de compra y procede al checkout.',
}

export default function CarritoPage() {
  return <CarritoClient />
}
