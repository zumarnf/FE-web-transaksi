"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/ProductCard";
import { productsAPI } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
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

  const HeroImage = () => {
    return (
      <div className="w-full h-full absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1574901200090-ca061722bdb9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          unoptimized
          alt="HeroImage"
          fill
          className="object-cover bg-linear-to-l from-primary to-secondary w-full"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent w-full h-full"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative w-full min-h-[400px] flex flex-col justify-center">
        <HeroImage />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <h1 className="text-5xl font-bold leading-tight text-white">
            Selamat Datang,
            <br />
            <span className="text-amber-400">{username || "Pelanggan"}</span>
          </h1>
          <p className="text-white/90 mt-4 text-lg max-w-xl">
            Temukan produk terbaik dengan harga terjangkau
          </p>
        </div>
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
