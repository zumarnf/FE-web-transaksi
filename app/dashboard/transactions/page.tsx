"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import { useTransactions } from "@/lib/useProducts";

interface TransactionDetail {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  price_per_item: string;
  subtotal: string;
  product?: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
}

interface Transaction {
  id: number;
  user_id: number;
  total_price: string;
  status: string;
  payment_proof: string | null;
  created_at: string;
  updated_at: string;
  details: TransactionDetail[];
}

export default function TransactionsPage() {
  const router = useRouter();

  // ✅ Pakai custom hook dengan auto-refetch setiap 1 menit
  const { data, isLoading, error } = useTransactions();

  const transactions: Transaction[] = data?.data || [];

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
      console.error("Invalid price:", price);
      return "Rp0";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Sukses", className: "bg-green-500 text-white" },
      paid: { label: "Dibayar", className: "bg-green-500 text-white" },
      cancelled: { label: "Dibatalkan", className: "bg-red-500 text-white" },
      waiting_verification: {
        label: "Menunggu Verifikasi",
        className: "bg-orange-500 text-white",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-500 text-white",
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTotalItems = (details: TransactionDetail[]) => {
    if (!details || !Array.isArray(details)) {
      console.warn("Invalid details:", details);
      return 0;
    }
    return details.reduce((total, item) => total + (item.quantity || 0), 0);
  };

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Riwayat Transaksi</h1>
        <p className="text-gray-600">
          {transactions.length} transaksi ditemukan
        </p>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card
            key={transaction.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() =>
              router.push(`/dashboard/transactions/${transaction.id}`)
            }
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{transaction.id}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(transaction.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {getStatusBadge(transaction.status)}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-b">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                <p className="font-semibold">
                  {getTotalItems(transaction.details)} item
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatPrice(transaction.total_price)}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/transactions/${transaction.id}`);
                }}
              >
                Lihat Detail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

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
