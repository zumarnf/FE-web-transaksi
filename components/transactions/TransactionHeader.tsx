"use client";

import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types";

interface TransactionHeaderProps {
  transaction: Transaction;
  handleDownloadInvoice: () => void;
}

interface TransactionHeaderListProps {
  transactions: Transaction[];
}

// Header untuk detail transaksi
export function TransactionHeader({
  transaction,
  handleDownloadInvoice,
}: TransactionHeaderProps) {
  const router = useRouter();

  return (
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
  );
}

// Header untuk list transaksi
export function TransactionHeaderList({
  transactions,
}: TransactionHeaderListProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Riwayat Transaksi</h1>
      <p className="text-gray-600">{transactions.length} transaksi ditemukan</p>
    </div>
  );
}
