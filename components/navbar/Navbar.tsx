"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth";
import { ShoppingCart, Package } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ⬅️ State untuk jumlah item
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⬅️ Load cart count dari localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logoutAPI(); // Optional: hit API
    } catch (error) {
      // Ignore API error
    } finally {
      logout(); // Hapus token & redirect
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
          {/* Cart with Badge */}
          <Link
            href="/dashboard/cart"
            className="relative flex items-center gap-2 text-neutral-800 hover:text-neutral-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
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
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
