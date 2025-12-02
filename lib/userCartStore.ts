import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
  category?: {
    id: number;
    name: string;
  };
};

export type CartStore = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;

  totalItems: () => number;
  subtotal: () => number;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            // Cek stock
            if (exists.quantity >= item.stock) {
              return state; // Jangan tambah jika sudah max stock
            }
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id) {
              // Cek stock sebelum increase
              if (i.quantity >= i.stock) return i;
              return { ...i, quantity: i.quantity + 1 };
            }
            return i;
          }),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      updateQuantity: (id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }

          return {
            items: state.items.map((i) => {
              if (i.id === id) {
                // Pastikan tidak melebihi stock
                const newQty = Math.min(qty, i.stock);
                return { ...i, quantity: newQty };
              }
              return i;
            }),
          };
        }),

      totalItems: () => get().items.reduce((a, i) => a + i.quantity, 0),

      subtotal: () => get().items.reduce((a, i) => a + i.price * i.quantity, 0),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
