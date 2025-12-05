"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // ✅ Fixed import
import { Transaction } from "@/types"; // ✅ Import dari types

interface TransactionSummaryProps {
  transaction: Transaction;
}

export function TransactionSummary({ transaction }: TransactionSummaryProps) {
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
        <h3 className="text-lg font-bold my-4">Bukti Pembayaran</h3>
        <img
          className=""
          src={
            transaction.payment_proof ||
            "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image"
          }
          alt="Payment Proof"
        />
      </div>
    </Card>
  );
}
