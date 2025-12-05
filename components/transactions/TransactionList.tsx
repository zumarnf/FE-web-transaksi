"use client";

import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { TransactionDetail } from "@/types";

interface Transaction {
  id: number;
  status: string;
  created_at: string;
  total_price: string | number;
  details: TransactionDetail[];
}

interface TransactionListProps {
  transaction: Transaction;
}

export function TransactionList({ transaction }: TransactionListProps) {
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

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Detail Produk</h2>
      <div className="space-y-4">
        {transaction.details && transaction.details.length > 0 ? (
          transaction.details.map((item: TransactionDetail, index: number) => (
            <div key={item.id || index}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.name || `Produk ID: ${item.product_id}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Jumlah: {item.quantity} x {formatPrice(item.price_per_item)}
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
  );
}
