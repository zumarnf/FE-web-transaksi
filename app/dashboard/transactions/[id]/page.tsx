"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useTransaction } from "@/lib/useProducts";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionInfoDate } from "@/components/transactions/TransactionInfoDate";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { PaymentProofUpload } from "@/components/transactions/PaymentProofUpload";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/useProducts";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useTransaction(params.id as string);

  const handleDownloadInvoice = () => {
    toast.success("Invoice akan didownload...");
  };

  const handleUploadSuccess = () => {
    refetch();

    queryClient.invalidateQueries({
      queryKey: queryKeys.transactions.lists(),
    });

    toast.success("Transaksi berhasil diperbarui");
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
      <TransactionHeader
        transaction={transaction}
        handleDownloadInvoice={handleDownloadInvoice}
      />

      <TransactionInfoDate transaction={transaction} />

      {/* ✅ Payment Proof Upload - Hanya muncul jika status pending */}
      <PaymentProofUpload
        transactionId={transaction.id}
        currentStatus={transaction.status}
        currentPaymentProof={transaction.payment_proof}
        onUploadSuccess={handleUploadSuccess}
      />

      <TransactionList transaction={transaction} />

      <TransactionSummary transaction={transaction} />

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
