import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface HeaderProductProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  isLoading: boolean;
  productCount: number;
}

export function HeaderProduct({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  isLoading,
  productCount: productsCount,
}: HeaderProductProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Daftar Produk</h1>
        <div className="text-sm text-gray-600">
          {isLoading ? "..." : `${productsCount} produk`}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
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

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Urutkan" />
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
  );
}
