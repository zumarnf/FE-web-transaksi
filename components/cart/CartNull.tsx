"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function CartNull() {
    const router = useRouter();
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
