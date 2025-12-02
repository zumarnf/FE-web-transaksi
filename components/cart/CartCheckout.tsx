"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { ShoppingCart, Loader2 } from "lucide-react";

interface CartCheckoutProps {
  totalItems: number;
  subtotal: number;
  handleCheckout: () => void;
  formatPrice: (price: number) => string;
  isCheckingOut?: boolean;
}

export function CartCheckout({
  totalItems,
  subtotal,
  handleCheckout,
  formatPrice,
  isCheckingOut = false,
}: CartCheckoutProps) {
  const router = useRouter();

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Total Produk</span>
          <span>{totalItems} item</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-600">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full bg-amber-500 hover:bg-amber-600"
        onClick={handleCheckout}
        disabled={isCheckingOut}
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Checkout
          </>
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full mt-3"
        onClick={() => router.push("/dashboard/products")}
        disabled={isCheckingOut}
      >
        Lanjut Belanja
      </Button>
    </Card>
  );
}
