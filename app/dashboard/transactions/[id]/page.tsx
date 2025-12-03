"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useTransaction } from "@/lib/useProducts";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionInfoDate } from "@/components/transactions/TransactionInfoDate";

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

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ Pakai custom hook dengan caching
  const {
    data: transaction,
    isLoading,
    error,
  } = useTransaction(params.id as string);

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

  if (error || !transaction) {
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
      <TransactionHeader
        transaction={transaction}
        handleDownloadInvoice={handleDownloadInvoice}
      />

      {/* Transaction Info Card */}
      <TransactionInfoDate transaction={transaction} />

      {/* Items List */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Detail Produk</h2>

        <div className="space-y-4">
          {transaction.details && transaction.details.length > 0 ? (
            transaction.details.map(
              (item: TransactionDetail, index: number) => (
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
              )
            )
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
