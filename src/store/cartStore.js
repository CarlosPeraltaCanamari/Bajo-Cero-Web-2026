import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

      addItem: (producto, cantidad = 1) => {
        const { items } = get()
        const existe = items.find((i) => i.producto_id === producto.id)
        if (existe) {
          set({ items: items.map((i) => i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i) })
        } else {
          set({ items: [...items, { producto_id: producto.id, nombre: producto.nombre, precio: Number(producto.precio_venta), imagen: producto.imagen ?? null, cantidad }] })
        }
      },

      removeItem: (producto_id) =>
        set({ items: get().items.filter((i) => i.producto_id !== producto_id) }),

      updateQuantity: (producto_id, cantidad) => {
        if (cantidad < 1) { get().removeItem(producto_id); return }
        set({ items: get().items.map((i) => i.producto_id === producto_id ? { ...i, cantidad } : i) })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'bajocero-cart' }
  )
)

export default useCartStore