"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled ? "bg-amber-100 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">Whops</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="" className="text-neutral-800 hover:text-neutral-300">
            Keranjang
          </Link>
          <Link href="" className="text-neutral-800 hover:text-neutral-300">
            Riwayat Belanja
          </Link>
          <Button
            variant="destructive"
            className="bg-red-500 text-amber-50 hover:bg-red-50 hover:text-neutral-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
