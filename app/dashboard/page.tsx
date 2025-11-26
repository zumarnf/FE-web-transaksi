"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil user info dari localStorage (sementara)
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Selamat Datang, {username || "User"}!
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/dashboard/products")}
        >
          <CardHeader>
            <CardTitle>🛍️ Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Lihat semua produk yang tersedia</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/dashboard/cart")}
        >
          <CardHeader>
            <CardTitle>🛒 Keranjang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Lihat keranjang belanja Anda</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/dashboard/transactions")}
        >
          <CardHeader>
            <CardTitle>📦 Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Riwayat pembelian Anda</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
