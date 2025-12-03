import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsAPI,
  categoriesAPI,
  transactionsAPI,
  authAPI,
} from "@/lib/api";

// ========================================
// QUERY KEYS - Centralized & Type-safe
// ========================================

export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.products.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.products.all, "search", query] as const,
    byCategory: (categoryId: number) =>
      [...queryKeys.products.all, "category", categoryId] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
  },

  // Transactions
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    details: () => [...queryKeys.transactions.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.transactions.details(), id] as const,
  },

  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },
};

// ========================================
// PRODUCTS HOOKS
// ========================================

export function useProducts(
  params?: { limit?: number; skip?: number },
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsAPI.getAll(params),
    select: (response) => response.data,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string | number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productsAPI.search(query),
    select: (response) => response.data,
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductsByCategory(categoryId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId),
    queryFn: () => productsAPI.getByCategory(categoryId),
    select: (response) => response.data,
    enabled: !!categoryId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ========================================
// CATEGORIES HOOKS
// ========================================

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoriesAPI.getAll(),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  });
}

// ========================================
// TRANSACTIONS HOOKS
// ========================================

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.lists(),
    queryFn: () => transactionsAPI.getAll(),
    select: (response) => response.data,
    staleTime: 1 * 60 * 1000, // 1 minute - transactions are important
  });
}

export function useTransaction(id: string | number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsAPI.getById(id),
    select: (response) => response.data,
    enabled: !!id && enabled,
    staleTime: 1 * 60 * 1000,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      items: Array<{ product_id: number; quantity: number }>;
    }) => transactionsAPI.create(data),

    // ✅ Optimistic update untuk UX yang lebih baik
    onMutate: async (newTransaction) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.transactions.lists(),
      });

      // Snapshot previous value
      const previousTransactions = queryClient.getQueryData(
        queryKeys.transactions.lists()
      );

      // Return context with snapshot
      return { previousTransactions };
    },

    // ✅ On success: invalidate & refetch
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.all,
      });

      // Also update product stock (karena berkurang)
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },

    // ✅ On error: rollback optimistic update
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          queryKeys.transactions.lists(),
          context.previousTransactions
        );
      }
    },
  });
}

// ========================================
// AUTH HOOKS
// ========================================

export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => authAPI.me(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry if unauthorized
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authAPI.login(data),
    onSuccess: () => {
      // Refetch user data after login
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => authAPI.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logoutAPI(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}
