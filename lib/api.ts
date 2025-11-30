import axios from "axios";
import { getToken } from "./auth";

// ========================================
// CONFIGURATION
// ========================================

// Toggle ini untuk switch antara DummyJSON dan Laravel
const USE_DUMMY_API = true; // ⬅️ Ubah jadi false saat backend Laravel ready

const DUMMY_API_URL = "https://dummyjson.com";
const LARAVEL_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const BASE_URL = USE_DUMMY_API ? DUMMY_API_URL : LARAVEL_API_URL;

// ========================================
// AXIOS INSTANCE
// ========================================

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik
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

// Transform DummyJSON response to Laravel format
function transformDummyProduct(dummy: any) {
  return {
    id: dummy.id,
    category_id: 1, // dummy category
    name: dummy.title,
    image: dummy.thumbnail,
    description: dummy.description,
    price: dummy.price,
    stock: dummy.stock,
    category: {
      id: 1,
      name: dummy.category,
    },
  };
}

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  login: async (data: { username: string; password: string }) => {
    if (USE_DUMMY_API) {
      // ✅ FIX: DummyJSON endpoint adalah /auth/login
      return api.post("/auth/login", data);
    } else {
      return api.post("/login", data);
    }
  },

  register: async (data: {
    username: string;
    email?: string;
    password: string;
  }) => {
    if (USE_DUMMY_API) {
      return api.post("/users/add", data);
    } else {
      return api.post("/register", data);
    }
  },

  me: async () => {
    if (USE_DUMMY_API) {
      return api.get("/auth/me");
    } else {
      return api.get("/me");
    }
  },

  // ⬅️ Rename dari logout ke logoutAPI
  // Hanya untuk hit API, TIDAK menghapus token localStorage
  // Gunakan logout() dari lib/auth.ts untuk logout user
  logoutAPI: async () => {
    if (USE_DUMMY_API) {
      return Promise.resolve({ data: { message: "Logged out" } });
    } else {
      return api.post("/logout");
    }
  },
};

// ========================================
// PRODUCTS API
// ========================================

export const productsAPI = {
  getAll: async (params?: { limit?: number; skip?: number }) => {
    if (USE_DUMMY_API) {
      const response = await api.get("/products", { params });
      return {
        ...response,
        data: {
          data: response.data.products.map(transformDummyProduct),
          total: response.data.total,
        },
      };
    } else {
      return api.get("/products");
    }
  },

  getById: async (id: string | number) => {
    if (USE_DUMMY_API) {
      const response = await api.get(`/products/${id}`);
      return {
        ...response,
        data: transformDummyProduct(response.data),
      };
    } else {
      return api.get(`/products/${id}`);
    }
  },

  search: async (query: string) => {
    if (USE_DUMMY_API) {
      const response = await api.get(`/products/search?q=${query}`);
      return {
        ...response,
        data: {
          data: response.data.products.map(transformDummyProduct),
          total: response.data.total,
        },
      };
    } else {
      return api.get(`/products?search=${query}`);
    }
  },

  getByCategory: async (categoryId: number) => {
    if (USE_DUMMY_API) {
      const response = await api.get("/products");
      return {
        ...response,
        data: {
          data: response.data.products.map(transformDummyProduct),
        },
      };
    } else {
      return api.get(`/products?category_id=${categoryId}`);
    }
  },
};

// ========================================
// CATEGORIES API
// ========================================

export const categoriesAPI = {
  getAll: async () => {
    if (USE_DUMMY_API) {
      const response = await api.get("/products/categories");
      return {
        ...response,
        data: {
          data: response.data.map((name: string, index: number) => ({
            id: index + 1,
            name,
          })),
        },
      };
    } else {
      return api.get("/categories");
    }
  },
};

// ========================================
// CART API (LocalStorage based)
// ========================================

export const cartAPI = {
  getCart: () => {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },

  saveCart: (items: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  },

  addItem: (product: any, quantity: number = 1) => {
    const cart = cartAPI.getCart();
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    cartAPI.saveCart(cart);
    return cart;
  },

  updateQuantity: (productId: number, quantity: number) => {
    const cart = cartAPI.getCart();
    const item = cart.find((item: any) => item.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        return cartAPI.removeItem(productId);
      }
      cartAPI.saveCart(cart);
    }

    return cart;
  },

  removeItem: (productId: number) => {
    const cart = cartAPI.getCart();
    const filtered = cart.filter((item: any) => item.id !== productId);
    cartAPI.saveCart(filtered);
    return filtered;
  },

  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  },

  getTotal: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((count: number, item: any) => count + item.quantity, 0);
  },
};

// ========================================
// TRANSACTIONS API
// ========================================

export const transactionsAPI = {
  create: async (data: {
    items: Array<{ product_id: number; quantity: number; price: number }>;
    total: number;
  }) => {
    if (USE_DUMMY_API) {
      // Fake transaction - simpan ke localStorage
      const transaction = {
        id: Date.now(),
        user_id: 1,
        total: data.total,
        items: data.items,
        status: "success",
        created_at: new Date().toISOString(),
      };

      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      transactions.push(transaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));

      return { data: transaction };
    } else {
      return api.post("/transactions", data);
    }
  },

  getAll: async () => {
    if (USE_DUMMY_API) {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      return { data: { data: transactions } };
    } else {
      return api.get("/transactions");
    }
  },

  getById: async (id: string | number) => {
    if (USE_DUMMY_API) {
      const transactions = JSON.parse(
        localStorage.getItem("transactions") || "[]"
      );
      const transaction = transactions.find((t: any) => t.id === Number(id));
      return { data: transaction };
    } else {
      return api.get(`/transactions/${id}`);
    }
  },
};

export default api;
