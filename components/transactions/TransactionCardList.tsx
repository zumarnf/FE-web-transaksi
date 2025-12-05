"use client";

import { Calendar, ChevronRight, Package } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Transaction, TransactionDetail } from "@/types";
import { ModalCofirm } from "../modal/ModalConfirm";

interface TransactionCardListProps {
  transactions: Transaction[];
}

export function TransactionCardList({
  transactions,
}: TransactionCardListProps) {
  const router = useRouter();
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
      pending: { label: "Tertunda", className: "bg-orange-500 text-white" },
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
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
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
  );
}
