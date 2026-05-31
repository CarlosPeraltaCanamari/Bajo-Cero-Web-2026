import DetallePedidoClient from '@/components/pedidos/DetallePedidoClient'

export const metadata = {
  title: 'Detalle de Pedido — Bajo Cero',
  description: 'Sigue el estado de tu entrega de agua premium Bajo Cero.',
}

export default async function PedidoDetallePage({ params }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '110px',
      paddingBottom: '80px',
      background: '#07100F',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <DetallePedidoClient pedidoId={id} />
      </div>
    </main>
  )
}
