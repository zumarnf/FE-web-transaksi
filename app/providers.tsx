"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ✅ Global defaults untuk semua queries
            staleTime: 60 * 1000, // 1 minute - data dianggap fresh
            gcTime: 5 * 60 * 1000, // 5 minutes - cache duration (dulu cacheTime)
            retry: 1, // Retry 1x jika gagal
            refetchOnWindowFocus: false, // Jangan refetch saat focus window
            refetchOnReconnect: true, // Refetch saat internet reconnect
          },
          mutations: {
            // ✅ Global defaults untuk semua mutations
            retry: 0, // Jangan retry mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ✅ DevTools hanya tampil di development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
