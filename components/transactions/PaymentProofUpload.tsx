"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Eye, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentProofUploadProps {
  transactionId: number;
  currentStatus: string;
  currentPaymentProof?: string | null;
  onUploadSuccess?: () => void;
}

export function PaymentProofUpload({
  transactionId,
  currentStatus,
  currentPaymentProof,
  onUploadSuccess,
}: PaymentProofUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Hanya tampilkan upload jika status pending
  if (currentStatus !== "pending") {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validasi file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("payment_proof", selectedFile);
      formData.append("transaction_id", String(transactionId)); // FIX

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/upload-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal upload bukti pembayaran");
      }

      toast.success(
        "Bukti pembayaran berhasil diupload! Menunggu verifikasi admin."
      );

      setSelectedFile(null);
      setPreviewUrl(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal upload bukti pembayaran");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            Upload Bukti Pembayaran
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Transaksi Anda menunggu konfirmasi pembayaran. Upload bukti transfer
            untuk mempercepat proses verifikasi.
          </p>

          {/* File Input */}
          <div className="space-y-4">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                <input
                  type="file"
                  id="payment-proof"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="payment-proof"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="font-medium text-amber-700">
                    Klik untuk upload bukti pembayaran
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG (Max. 2MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="border border-amber-300 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {previewUrl && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Preview Button */}
                    <Dialog open={showPreview} onOpenChange={setShowPreview}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 border-amber-300 hover:bg-amber-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Preview Bukti Pembayaran</DialogTitle>
                        </DialogHeader>
                        {previewUrl && (
                          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Upload Bukti Pembayaran
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Info Alert */}
          <Alert className="mt-4 border-amber-200 bg-amber-50">
            <AlertDescription className="text-sm text-amber-800">
              <strong>Catatan:</strong> Pastikan bukti transfer jelas dan
              mencantumkan nominal yang sesuai. Verifikasi akan dilakukan
              maksimal 1x24 jam.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Card>
  );
}
