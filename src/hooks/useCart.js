import useCartStore from '@/store/cartStore'

export default function useCart() {
  const items          = useCartStore((s) => s.items)
  const addItem        = useCartStore((s) => s.addItem)
  const removeItem     = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart      = useCartStore((s) => s.clearCart)

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  const subtotal   = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  return { items, totalItems, subtotal, isEmpty: items.length === 0, addItem, removeItem, updateQuantity, clearCart }
}