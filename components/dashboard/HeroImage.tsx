"use client";
import Image from "next/image";

export function HeroImage() {
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
}
