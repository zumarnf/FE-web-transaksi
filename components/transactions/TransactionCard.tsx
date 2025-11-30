"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, ChevronRight } from "lucide-react";

interface TransactionCardProps {
  transaction: {
    id: number;
    total: number;
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>;
    status: string;
    created_at: string;
  };
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const router = useRouter();

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
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      success: { label: "Berhasil", variant: "default" },
      pending: { label: "Menunggu", variant: "secondary" },
      failed: { label: "Gagal", variant: "destructive" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "secondary",
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

  const getTotalItems = () => {
    return transaction.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Order #{transaction.id}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(transaction.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="text-right">{getStatusBadge(transaction.status)}</div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-b">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Produk</p>
          <p className="font-semibold">{getTotalItems()} item</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
          <p className="text-xl font-bold text-amber-600">
            {formatPrice(transaction.total)}
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
  );
}
