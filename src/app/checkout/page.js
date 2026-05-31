import CheckoutClient from '@/components/checkout/CheckoutClient'

export const metadata = {
  title: 'Confirmar Compra — Bajo Cero',
  description: 'Completa tus datos de envío y selecciona tu método de pago favorito.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
