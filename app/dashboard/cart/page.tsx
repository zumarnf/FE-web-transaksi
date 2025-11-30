"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { cartAPI } from "@/lib/api";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setIsLoading(true);
    const cartData = cartAPI.getCart();
    setCart(cartData);
    setIsLoading(false);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Update quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    const item = cart.find((item) => item.id === productId);

    if (!item) return;

    if (newQuantity > item.stock) {
      toast.error(`Stok ${item.name} hanya tersisa ${item.stock}`);
      return;
    }

    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    cartAPI.updateQuantity(productId, newQuantity);
    loadCart();
    toast.success("Jumlah diperbarui!");
  };

  // Remove item
  const removeItem = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    cartAPI.removeItem(productId);
    loadCart();
    toast.success(`${item?.name} dihapus dari keranjang`);
  };

  // Clear cart
  const clearCart = () => {
    if (confirm("Hapus semua produk dari keranjang?")) {
      cartAPI.clearCart();
      loadCart();
      toast.success("Keranjang dikosongkan");
    }
  };

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate total items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }

    // For now, just show success and clear cart
    // Nanti ganti dengan redirect ke checkout page
    toast.success("Pesanan berhasil dibuat!");

    // Save to transactions
    const transaction = {
      id: Date.now(),
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: subtotal,
      status: "success",
      created_at: new Date().toISOString(),
    };

    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );
    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Clear cart
    cartAPI.clearCart();

    // Redirect to transactions
    setTimeout(() => {
      router.push("/dashboard/transactions");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold mb-3">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-8">
            Belum ada produk di keranjang Anda. Yuk, belanja sekarang!
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/dashboard/products")}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Mulai Belanja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full px-20 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between my-6">
        <div className="gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Keranjang Belanja</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} produk di keranjang
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Kosongkan
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div
                  className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                  onClick={() => router.push(`/dashboard/products/${item.id}`)}
                >
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3
                    className="font-semibold text-lg mb-1 hover:text-amber-600 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/products/${item.id}`)
                    }
                  >
                    {item.name}
                  </h3>

                  {item.category && (
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category.name}
                    </p>
                  )}

                  <p className="text-xl font-bold text-amber-600 mb-3">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-1 font-semibold min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <span className="text-sm text-gray-500">
                      Stok: {item.stock}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                  <p className="text-xl font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Total Produk</span>
                <span>{totalItems} item</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-600">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-600"
              onClick={handleCheckout}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => router.push("/dashboard/products")}
            >
              Lanjut Belanja
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
