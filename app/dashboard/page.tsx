"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil user info dari localStorage (sementara)
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return {
        data: [
          {
            id: 1,
            category_id: 1,
            name: "Laptop Gaming ROG",
            image:
              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            description:
              "Laptop gaming dengan spesifikasi tinggi untuk performa maksimal",
            price: 15000000,
            stock: 5,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 2,
            category_id: 1,
            name: "Mechanical Keyboard RGB",
            image:
              "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
            description:
              "Keyboard mechanical dengan RGB lighting yang dapat dikustomisasi",
            price: 1250000,
            stock: 15,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 3,
            category_id: 2,
            name: "Tas Gaming",
            image:
              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            description:
              "Tas gaming dengan desain yang menarik dan spesifikasi tinggi untuk performa maksimal",
            price: 15000000,
            stock: 5,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 4,
            category_id: 2,
            name: "Mouse Gaming",
            image:
              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            description:
              "Mouse gaming dengan desain yang menarik dan spesifikasi tinggi untuk performa maksimal",
            price: 15000000,
            stock: 5,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 5,
            category_id: 2,
            name: "Headset Gaming",
            image:
              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            description:
              "Headset gaming dengan desain yang menarik dan spesifikasi tinggi untuk performa maksimal",
            price: 15000000,
            stock: 5,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 6,
            category_id: 2,
            name: "Monitor Gaming",
            image:
              "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
            description:
              "Monitor gaming dengan desain yang menarik dan spesifikasi tinggi untuk performa maksimal",
            price: 15000000,
            stock: 5,
            category: { id: 1, name: "Electronics" },
          },
        ],
      };
    },
  });

  let products: Product[] = data?.data || [];

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
        <div className="absolute inset-0 bg-linear-to-r from-20% from-secondary to-transparent w-full h-full"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative w-full min-h-[400px] flex flex-col justify-center">
        <HeroImage />

        {/* container hanya untuk teks */}
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold leading-16">
            Selamat Datang,
            <br />
            <span className="text-amber-400">Pelanggan</span>
          </h1>
        </div>
      </section>

      {/* Featured Products Grid */}
      <div className="px-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Produk Pilihan</h2>
          <Link
            href="/dashboard/products"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Lihat Semua
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
