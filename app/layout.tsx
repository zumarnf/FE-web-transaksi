import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner"; // ✅ import Toaster

export const metadata = {
  title: "Project Shop",
  description: "Marketplace starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        {/* Toaster harus ada di root agar toast muncul */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
