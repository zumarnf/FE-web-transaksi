"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import { transactionsAPI } from "@/lib/api";

interface TransactionItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface Transaction {
  id: number;
  user_id: number;
  total: number;
  items: TransactionItem[];
  status: string;
  created_at: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data } = await transactionsAPI.getAll();
      setTransactions(data.data || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      success: { label: "Berhasil", variant: "default" },
      pending: { label: "Menunggu", variant: "secondary" },
      failed: { label: "Gagal", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "outline",
    };

    return (
      <Badge
        variant={config.variant}
        className={status === "success" ? "bg-green-500" : ""}
      >
        {config.label}
      </Badge>
    );
  };

  const getTotalItems = (items: TransactionItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Empty state
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
    <div className="max-w-full px-20 pt-10 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Riwayat Transaksi</h1>
        <p className="text-gray-600">Total {transactions.length} Transaksi</p>
      </div>

      {/* Transactions List */}
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

            {/* Transaction Info */}
            <div className="flex items-center justify-between py-4 border-t border-b">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Produk</p>
                <p className="font-semibold">
                  {getTotalItems(transaction.items)} item
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatPrice(transaction.total)}
                </p>
              </div>
            </div>

            {/* Action */}
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

      {/* Back to Products */}
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
