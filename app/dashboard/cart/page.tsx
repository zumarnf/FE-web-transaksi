"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { transactionsAPI } from "@/lib/api";
import { CartNull } from "@/components/cart/CartNull";
import { CartItem } from "@/components/cart/CartItem";
import { CartCheckout } from "@/components/cart/CartCheckout";
import { CartHeader } from "@/components/cart/CartHeader";
import { useCartStore } from "@/lib/userCartStore";

export default function CartPage() {
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Ambil semua dari Zustand store
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());
  const subtotal = useCartStore((state) => state.subtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClearCart = () => {
    if (confirm("Hapus semua produk dari keranjang?")) {
      clearCart();
      toast.success("Keranjang dikosongkan");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Format data untuk Laravel
      const cartItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      await transactionsAPI.create({ items: cartItems });

      toast.success("Pesanan berhasil dibuat!");
      clearCart();

      setTimeout(() => {
        router.push("/dashboard/transactions");
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) return <CartNull />;

  return (
    <div className="max-w-full px-20 mx-auto">
      {/* Header */}
      <CartHeader totalItems={totalItems} clearCart={handleClearCart} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartCheckout
            totalItems={totalItems}
            subtotal={subtotal}
            handleCheckout={handleCheckout}
            formatPrice={formatPrice}
            isCheckingOut={isCheckingOut}
          />
        </div>
      </div>
    </div>
  );
}
