"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { productsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from "lucide-react";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [quantity, setQuantity] = useState(1);

  // Fetch product detail
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", params.id],
    queryFn: async () => {
      // ✅ FIX: Fetch dari API
      const res = await productsAPI.getById(params.id as string);
      return res.data;
    },
  });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Add to cart
  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang!`);

    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdated"));

    // Redirect to cart after 500ms
    setTimeout(() => router.push("/dashboard/cart"), 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">
          Produk yang Anda cari tidak tersedia atau sudah dihapus.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button onClick={() => router.push("/dashboard/products")}>
            Lihat Semua Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 mt-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <img
              src={
                product.image ||
                "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image"
              }
              alt={product.name}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image";
              }}
            />
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          {product.category && (
            <Badge variant="secondary" className="text-sm">
              {product.category.name}
            </Badge>
          )}

          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Stock Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Stok: <span className="font-semibold">{product.stock}</span>
              </span>
            </div>

            {product.stock === 0 && <Badge variant="destructive">Habis</Badge>}
          </div>

          {/* Price */}
          <div className="border-y py-4">
            <div className="text-3xl font-bold text-amber-600">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Deskripsi Produk</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Harga:</span>
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6"
            onClick={addToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
          </Button>

          {/* Additional Info */}
          <div className="text-sm text-gray-600 space-y-2 border-t pt-4">
            <p>✓ Gratis ongkir untuk pembelian di atas Rp 500.000</p>
            <p>✓ Garansi resmi 1 tahun</p>
            <p>✓ Bisa ditukar dalam 7 hari</p>
          </div>
        </div>
      </div>
    </div>
  );
}
