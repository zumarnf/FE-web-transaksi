"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/auth";
import { api, attachAuth } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    attachAuth(token);
    // optional: fetch user profile
    api
      .get("/auth/profile")
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={logout} className="px-3 py-1 border rounded">
          Logout
        </button>
      </div>

      <div className="mt-6">
        Konten dashboard di sini (produk, transaksi, dsb)
      </div>
    </div>
  );
}
