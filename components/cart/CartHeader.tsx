"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CartHeaderProps {
  totalItems: number;
  clearCart: () => void;
}

export function CartHeader({ totalItems, clearCart }: CartHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between my-6">
      <div className="gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Keranjang Belanja</h1>
          <p className="text-gray-600 mt-1">{totalItems} produk di keranjang</p>
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
  );
}
