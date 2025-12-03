"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/userCartStore";
import { ProductDetailErr } from "@/components/products/ProductDetailErr";
import { ProductDesc } from "@/components/products/ProductDesc";
import { Loading } from "@/components/ui/loading";
import { useProduct } from "@/lib/useProducts";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  // ✅ Pakai custom hook dengan caching otomatis
  const { data: product, isLoading, error } = useProduct(params.id as string);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const increaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Stok hanya tersisa ${product?.stock}`);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Produk sedang habis!");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Stok hanya tersisa ${product.stock}`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        category: product.category,
      });
    }

    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang!`);
    setQuantity(1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return <ProductDetailErr />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        className="mb-4 mt-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <img
              src={
                product.image ||
                "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image"
              }
              alt={product.name}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image";
              }}
            />
          </Card>
        </div>
        <ProductDesc
          product={product}
          quantity={quantity}
          formatPrice={formatPrice}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          addToCart={addToCart}
        />
      </div>
    </div>
  );
}
