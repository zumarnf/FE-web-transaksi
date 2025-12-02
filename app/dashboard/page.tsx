"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/ProductCard";
import { productsAPI } from "@/lib/api";
import Link from "next/link";
import { HeroImage } from "@/components/dashboard/HeroImage";
import { TextHero } from "@/components/dashboard/TextHero";

export default function DashboardPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil user info dari localStorage
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      return await productsAPI.getAll();
    },
  });

  const products: Product[] = (data?.data?.data || []).slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="relative w-full min-h-[400px] flex flex-col justify-center">
        <HeroImage />
        <TextHero username={username} />
      </section>

      <div className="px-4 md:px-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Produk Pilihan</h2>
          <Link
            href="/dashboard/products"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Gagal memuat produk</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
