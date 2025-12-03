"use client";

import { useState, useMemo } from "react";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { HeaderProduct } from "@/components/products/HeaderProduct";
import { useDebounce } from "@/lib/useDebounce";
import { useProducts, useProductSearch } from "@/lib/useProducts";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 700);
  const [sortBy, setSortBy] = useState<string>("default");

  // ✅ Conditional fetching: search atau getAll
  const shouldSearch = (debouncedSearch || "").length > 0;

  const {
    data: allProductsData,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useProducts({}, !shouldSearch); // disabled jika search aktif

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useProductSearch(debouncedSearch || "");

  // ✅ Pilih data source
  const data = shouldSearch ? searchData : allProductsData;
  const isLoading = shouldSearch ? isLoadingSearch : isLoadingAll;
  const error = shouldSearch ? errorSearch : errorAll;

  // ✅ Sorting dengan useMemo untuk performance
  const products: Product[] = useMemo(() => {
    // ⚠️ Guard clause: return empty array jika data undefined
    if (!data?.data) return [];

    let result: Product[] = data.data;

    switch (sortBy) {
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price);
      case "name":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "stock":
        return [...result].sort((a, b) => b.stock - a.stock);
      default:
        return result;
    }
  }, [data, sortBy]);

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
        productCount={products?.length || 0}
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
          <p className="text-gray-500">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : "Coba kata kunci lain"}
          </p>
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
