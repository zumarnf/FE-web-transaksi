import AuthGuard from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Tambah padding-top karena navbar fixed */}
        <main className="pt-20 container mx-auto px-4 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
