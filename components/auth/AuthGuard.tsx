"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Cek token
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setAllowed(true);
    }
  }, [router]);

  // Cegah render awal supaya tidak error hydration
  if (!allowed) return null;

  return <>{children}</>;
}
