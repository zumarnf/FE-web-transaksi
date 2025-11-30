"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsAPI } from "@/lib/api";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types"; // ⬅️ Import dari types

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      // Nanti ganti ke Laravel endpoint
      // const res = await productsAPI.getAll();

      // Sementara dummy data untuk testing
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
            name: "Mouse Gaming Wireless",
            image:
              "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
            description: "Mouse gaming wireless dengan sensor presisi tinggi",
            price: 850000,
            stock: 0,
            category: { id: 2, name: "Accessories" },
          },
          {
            id: 4,
            category_id: 1,
            name: "Monitor 27 inch 144Hz",
            image:
              "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
            description:
              "Monitor gaming dengan refresh rate 144Hz untuk pengalaman gaming yang smooth",
            price: 3500000,
            stock: 8,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 5,
            category_id: 3,
            name: "Gaming Chair Ergonomic",
            image:
              "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500",
            description:
              "Kursi gaming ergonomis dengan penyangga lumbar yang nyaman",
            price: 2750000,
            stock: 3,
            category: { id: 3, name: "Furniture" },
          },
          {
            id: 6,
            category_id: 2,
            name: "Headset Gaming 7.1",
            image:
              "https://images.unsplash.com/photo-1599669454699-248893623440?w=500",
            description:
              "Headset gaming dengan surround sound 7.1 untuk audio yang immersive",
            price: 950000,
            stock: 12,
            category: { id: 2, name: "Accessories" },
          },
          {
            id: 7,
            category_id: 1,
            name: "Webcam 4K HD",
            image:
              "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
            description:
              "Webcam 4K dengan auto focus untuk streaming dan video call",
            price: 1500000,
            stock: 20,
            category: { id: 1, name: "Electronics" },
          },
          {
            id: 8,
            category_id: 2,
            name: "Mousepad XL RGB",
            image:
              "https://images.unsplash.com/photo-1616627644253-1e072c71de2a?w=500",
            description:
              "Mousepad extra large dengan RGB lighting di sekeliling tepi",
            price: 350000,
            stock: 25,
            category: { id: 2, name: "Accessories" },
          },
        ],
      };
    },
  });

  let products: Product[] = data?.data || [];

  // Search filter
  if (searchQuery) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sorting logic
  if (sortBy === "price-low") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "stock") {
    products = [...products].sort((a, b) => b.stock - a.stock);
  }

  return (
    <div className="space-y-8 p-20">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Daftar Produk</h1>
          <div className="text-sm text-gray-600">
            {isLoading ? "..." : `${products.length} produk`}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari produk..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name">Nama A-Z</SelectItem>
              <SelectItem value="price-low">Harga Terendah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
              <SelectItem value="stock">Stok Terbanyak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
