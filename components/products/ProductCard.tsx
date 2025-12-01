"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  showAddToCart = true,
}: ProductCardProps) {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item: any) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        toast.success(`Jumlah ${product.name} ditambahkan!`);
      } else {
        cart.push({ ...product, quantity: 1 });
        toast.success(`${product.name} ditambahkan ke keranjang!`);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/products/${product.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.image || "/placeholder-product.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-1">
          {product.category && (
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5"
            >
              {product.category.name}
            </Badge>
          )}

          {product.stock < 10 && product.stock > 0 && (
            <Badge
              variant="destructive"
              className="bg-orange-500 text-xs px-2 py-0.5"
            >
              Sisa {product.stock}
            </Badge>
          )}

          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5">
              Habis
            </Badge>
          )}
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors h-10">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="text-lg font-bold text-amber-600 mb-1">
            {formatPrice(product.price)}
          </div>
          <div className="text-xs text-gray-500">Stok: {product.stock}</div>
        </div>
      </div>

      {showAddToCart && (
        <div className="p-3 pt-0">
          <Button
            size="sm"
            className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            {product.stock === 0 ? "Habis" : "Tambah"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-4/3 bg-gray-200 animate-pulse" />
      <CardContent className="p-3 space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mt-4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <div className="h-9 bg-gray-200 rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  );
}
