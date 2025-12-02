"use client";

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Memuat halaman...</p>
      </div>
    </div>
  );
}
