"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useTransactions } from "@/lib/useProducts";
import { TransactionHeaderList } from "@/components/transactions/TransactionHeader";
import { Transaction } from "@/types";
import { TransactionCardList } from "@/components/transactions/TransactionCardList";

export default function TransactionsPage() {
  const router = useRouter();

  // ✅ Pakai custom hook dengan auto-refetch setiap 1 menit
  const { data, isLoading, error } = useTransactions();

  const transactions: Transaction[] = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Gagal Memuat Transaksi</h2>
        <p className="text-gray-600 mb-6">
          Terjadi kesalahan saat memuat data.
        </p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-3xl font-bold mb-3">Belum Ada Transaksi</h2>
          <p className="text-gray-600 mb-8">
            Anda belum melakukan pembelian. Mulai belanja sekarang!
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
    <div className="max-w-5xl mx-auto">
      <TransactionHeaderList transactions={transactions} />

      <TransactionCardList transactions={transactions} />

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Lanjut Belanja
        </Button>
      </div>
    </div>
  );
}
