"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Package,
  Download,
  ShoppingBag,
} from "lucide-react";
import { transactionsAPI } from "@/lib/api";
import { toast } from "sonner";

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

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [params.id]);

  const loadTransaction = async () => {
    setIsLoading(true);
    try {
      const { data } = await transactionsAPI.getById(params.id as string);

      console.log("Transaction Detail:", data);

      if (!data) {
        toast.error("Transaksi tidak ditemukan");
        setTransaction(null);
      } else {
        setTransaction(data);
      }
    } catch (error: any) {
      console.error("Failed to load transaction:", error);
      toast.error("Gagal memuat detail transaksi");
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!details || !Array.isArray(details)) return 0;
    return details.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const handleDownloadInvoice = () => {
    toast.success("Invoice akan didownload...");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold mb-2">Transaksi Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">
          Transaksi yang Anda cari tidak tersedia.
        </p>
        <Button onClick={() => router.push("/dashboard/transactions")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/transactions")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detail Transaksi</h1>
            <p className="text-gray-600">Order #{transaction.id}</p>
          </div>
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Transaction Info Card */}
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
              <p className="font-medium">
                {formatDate(transaction.created_at)}
              </p>
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

      {/* Items List */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Detail Produk</h2>

        <div className="space-y-4">
          {transaction.details && transaction.details.length > 0 ? (
            transaction.details.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product?.name || `Produk ID: ${item.product_id}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Jumlah: {item.quantity} x{" "}
                      {formatPrice(item.price_per_item)}
                    </p>
                  </div>
                  <p className="font-bold text-amber-600">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
                {index < transaction.details.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              Tidak ada detail produk
            </p>
          )}
        </div>
      </Card>

      {/* Payment Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Ringkasan Pembayaran</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal Produk</span>
            <span>{formatPrice(transaction.total_price)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Biaya Admin</span>
            <span>{formatPrice(0)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Ongkir</span>
            <span>{formatPrice(0)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-xl font-bold">
            <span>Total Pembayaran</span>
            <span className="text-amber-600">
              {formatPrice(transaction.total_price)}
            </span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/transactions")}
        >
          Kembali ke Riwayat
        </Button>
        <Button
          className="bg-amber-500 hover:bg-amber-600"
          onClick={() => router.push("/dashboard/products")}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Belanja Lagi
        </Button>
      </div>
    </div>
  );
}
