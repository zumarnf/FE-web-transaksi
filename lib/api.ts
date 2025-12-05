import axios from "axios";
import { getToken } from "./auth";

// ========================================
// CONFIGURATION
// ========================================

const LARAVEL_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const BASE_URL = LARAVEL_API_URL;

// ========================================
// AXIOS INSTANCE
// ========================================

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// ========================================
// REQUEST INTERCEPTOR - Auto attach token
// ========================================

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// HELPER FUNCTIONS
// ========================================

export function attachAuth(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ✅ Helper untuk transform image URL
function transformImageUrl(
  imagePath: string | null,
  isPaymentProof = false
): string {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  if (!imagePath) {
    return "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // ✅ Payment proof perlu ditambahkan prefix "paymentproof/"
  if (isPaymentProof) {
    // Cek apakah sudah ada "paymentproof/" di path
    const hasPrefix = imagePath.startsWith("payment_proofs/");
    return hasPrefix
      ? `${baseURL}/storage/${imagePath}`
      : `${baseURL}/storage/payment_proofs/${imagePath}`;
  }

  return `${baseURL}/storage/${imagePath}`;
}

function transformLaravelProduct(product: any) {
  return {
    id: product.id,
    category_id: product.category_id,
    name: product.name,
    image: transformImageUrl(product.image),
    description: product.description,
    price: parseFloat(product.price),
    stock: product.stock,
    category: product.category,
  };
}

// ✅ Helper untuk transform transaction dengan payment proof URL
function transformTransaction(transaction: any) {
  return {
    ...transaction,
    payment_proof: transaction.payment_proof
      ? transformImageUrl(transaction.payment_proof, true) // ✅ Pass true untuk payment proof
      : null,
    // Transform nested items jika ada
    items: transaction.items?.map((item: any) => ({
      ...item,
      product: item.product
        ? {
            ...item.product,
            image: transformImageUrl(item.product.image, false),
          }
        : null,
    })),
  };
}

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/user/login", data);
    return response;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post("/user/register", data);
    return response;
  },

  me: async () => {
    const response = await api.get("/user/profile");
    return response;
  },

  logoutAPI: async () => {
    const response = await api.post("/user/logout");
    return response;
  },
};

// ========================================
// PRODUCTS API
// ========================================

export const productsAPI = {
  getAll: async (params?: { limit?: number; skip?: number }) => {
    const response = await api.get("/product");

    const products = response.data.data.map(transformLaravelProduct);

    return {
      ...response,
      data: {
        data: products,
        total: products.length,
      },
    };
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/product/${id}`);

    const product = transformLaravelProduct(response.data.data);

    return {
      ...response,
      data: product,
    };
  },

  search: async (query: string) => {
    const response = await api.get("/product");

    const products = response.data.data
      .filter((p: any) => p.name.toLowerCase().includes(query.toLowerCase()))
      .map(transformLaravelProduct);

    return {
      ...response,
      data: {
        data: products,
        total: products.length,
      },
    };
  },

  getByCategory: async (categoryId: number) => {
    const response = await api.get("/product");

    const products = response.data.data
      .filter((p: any) => p.category_id === categoryId)
      .map(transformLaravelProduct);

    return {
      ...response,
      data: {
        data: products,
      },
    };
  },
};

// ========================================
// CATEGORIES API
// ========================================

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get("/category");
    return {
      ...response,
      data: {
        data: response.data.data,
      },
    };
  },
};

// ========================================
// TRANSACTIONS API
// ========================================

export const transactionsAPI = {
  create: async (data: {
    items: Array<{ product_id: number; quantity: number }>;
  }) => {
    const response = await api.post("/transactions", data);
    return response;
  },

  getAll: async () => {
    try {
      const response = await api.get("/transactions/my");

      console.log("Transactions API Response:", response.data);

      // ✅ Transform semua transactions untuk fix payment_proof URL
      const transformedTransactions = (response.data.data || []).map(
        transformTransaction
      );

      return {
        data: {
          data: transformedTransactions,
        },
      };
    } catch (error) {
      console.error("Transactions API error:", error);
      return {
        data: {
          data: [],
        },
      };
    }
  },

  getById: async (id: string | number) => {
    try {
      const response = await api.get("/transactions/my");
      const transactions = response.data.data || [];
      const transaction = transactions.find((t: any) => t.id === Number(id));

      console.log("Transaction detail:", transaction);

      // ✅ Transform transaction untuk fix payment_proof URL
      return {
        data: transaction ? transformTransaction(transaction) : null,
      };
    } catch (error) {
      console.error("Transaction detail error:", error);
      return { data: null };
    }
  },
};

export default api;
