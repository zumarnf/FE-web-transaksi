"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/lib/userCartStore";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const router = useRouter();

  // Pakai store
  const updateQty = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleIncrease = () => {
    if (item.quantity >= item.stock) {
      toast.error(`Stok ${item.name} hanya tersisa ${item.stock}`);
      return;
    }
    updateQty(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    updateQty(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
    toast.success(`${item.name} dihapus dari keranjang`);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* IMAGE */}
        <div
          className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer shrink-0"
          onClick={() => router.push(`/dashboard/products/${item.id}`)}
        >
          <img
            src={
              item.image ||
              "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image"
            }
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-lg mb-1 hover:text-amber-600 cursor-pointer truncate"
            onClick={() => router.push(`/dashboard/products/${item.id}`)}
          >
            {item.name}
          </h3>

          {item.category && (
            <p className="text-sm text-gray-500 mb-2">{item.category.name}</p>
          )}

          <p className="text-xl font-bold text-amber-600 mb-3">
            {formatPrice(item.price)}
          </p>

          {/* QUANTITY CONTROL */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="px-4 py-1 font-semibold min-w-12 text-center">
                {item.quantity}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleIncrease}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <span className="text-sm text-gray-500">Stok: {item.stock}</span>

            {/* REMOVE BUTTON */}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-xl font-bold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </Card>
  );
}
