"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function ProductDetailErr() {
  const router = useRouter();
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
