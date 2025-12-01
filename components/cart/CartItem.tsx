"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    image: string;
    price: number;
    stock: number;
    quantity: number;
    category?: {
      id: number;
      name: string;
    };
  };
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div
          className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
          onClick={() => router.push(`/dashboard/products/${item.id}`)}
        >
          <img
            src={
              item.image ||
              "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image"
            }
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image";
            }}
          />
        </div>

        <div className="flex-1">
          <h3
            className="font-semibold text-lg mb-1 hover:text-amber-600 cursor-pointer"
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

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
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
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <span className="text-sm text-gray-500">Stok: {item.stock}</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
          <p className="text-xl font-bold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </Card>
  );
}
