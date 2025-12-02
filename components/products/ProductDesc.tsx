"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, Package } from "lucide-react";
import { Product } from "@/types";

interface ProductDescProps {
  product: Product;
  quantity: number;
  formatPrice: (price: number) => string;
  increaseQty: () => void;
  decreaseQty: () => void;
  addToCart: () => void;
}

export function ProductDesc({
  product,
  quantity,
  formatPrice,
  increaseQty,
  decreaseQty,
  addToCart,
}: ProductDescProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            Stok:{" "}
            <span
              className={`font-semibold ${
                product.stock > 10
                  ? "text-green-600"
                  : product.stock > 0
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {product.stock}
            </span>
          </span>
        </div>

        {product.stock === 0 && <Badge variant="destructive">Habis</Badge>}
      </div>

      <div className="border-y py-4">
        <div className="text-3xl font-bold text-amber-600">
          {formatPrice(product.price)}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-lg">Deskripsi Produk</h3>
        <p className="text-gray-700 leading-relaxed">
          {product.description || "Tidak ada deskripsi untuk produk ini."}
        </p>
      </div>

      {product.stock > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Jumlah:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseQty}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="px-6 py-2 font-semibold min-w-16 text-center">
                {quantity}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={increaseQty}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Harga:</span>
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-lg py-6"
        onClick={addToCart}
        disabled={product.stock === 0}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
      </Button>

      <div className="text-sm text-gray-600 space-y-2 border-t pt-4">
        <p>✓ Gratis ongkir untuk pembelian di atas Rp 500.000</p>
        <p>✓ Garansi resmi 1 tahun</p>
        <p>✓ Bisa ditukar dalam 7 hari</p>
      </div>
    </div>
  );
}
