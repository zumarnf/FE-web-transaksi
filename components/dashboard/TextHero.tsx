"use client";

export function TextHero({ username }: { username: string }) {
  return (
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
  );
}
