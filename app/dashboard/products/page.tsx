"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsAPI } from "@/lib/api";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { HeaderProduct } from "@/components/products/HeaderProduct";
import { useDebounce } from "@/lib/useDebounce";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 700);
  const [sortBy, setSortBy] = useState<string>("default");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch) {
        return await productsAPI.search(debouncedSearch);
      }

      return await productsAPI.getAll();
    },
  });

  let products: Product[] = data?.data?.data || [];

  if (sortBy === "price-low") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "stock") {
    products = [...products].sort((a, b) => b.stock - a.stock);
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Gagal memuat produk. Coba lagi.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-20">
      <HeaderProduct
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLoading={isLoading}
        productCount={products.length}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
          <p className="text-gray-500">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
