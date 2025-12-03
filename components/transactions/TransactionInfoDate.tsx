"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";

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
  status: string;
  created_at: string;
  total_price: string | number;
  details: TransactionDetail[];
}

interface TransactionInfoDateProps {
  transaction: Transaction;
}

export function TransactionInfoDate({ transaction }: TransactionInfoDateProps) {
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
    if (!details || !Array.isArray(details)) return 0;
    return details.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <Card className="p-6 mb-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Status Pesanan</p>
          {getStatusBadge(transaction.status)}
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Tanggal Transaksi</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="font-medium">{formatDate(transaction.created_at)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Total Item</p>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <p className="font-medium">
              {getTotalItems(transaction.details)} produk
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
