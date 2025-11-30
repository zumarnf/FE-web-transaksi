import AuthGuard from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="w-full">
        <Navbar />
        {/* Tambah padding-top karena navbar fixed */}
        <main className="py-16">{children}</main>
      </div>
    </AuthGuard>
  );
}
