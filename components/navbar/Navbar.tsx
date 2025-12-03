"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth";
import { ShoppingCart, Package, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/userCartStore";
import { useLogout } from "@/lib/useProducts";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const totalItems = useCartStore((state) => state.totalItems());
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();

      toast.success("Logout berhasil!");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal logout, coba lagi");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled ? "bg-amber-50/80 opacity-90" : "bg-amber-100 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-neutral-800 hover:text-neutral-600 transition-colors cursor-pointer">
            🛍️ Whops
          </h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/cart"
            className="relative flex items-center gap-2 text-neutral-800 hover:text-neutral-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Keranjang</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-2 text-neutral-800 hover:text-neutral-600 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span className="hidden sm:inline">Riwayat Belanja</span>
          </Link>

          <Button
            variant="destructive"
            className="bg-red-500 text-amber-50 hover:bg-red-600"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logout...
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
