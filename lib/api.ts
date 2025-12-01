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

function transformLaravelProduct(product: any) {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  // Build image URL
  let imageUrl = "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";

  if (product.image) {
    if (product.image.startsWith("http")) {
      imageUrl = product.image;
    } else {
      imageUrl = `${baseURL}/storage/${product.image}`;
    }
  }

  return {
    id: product.id,
    category_id: product.category_id,
    name: product.name,
    image: imageUrl,
    description: product.description,
    price: parseFloat(product.price),
    stock: product.stock,
    category: product.category,
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

    // Transform products
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
      .filter(
        (p: any) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      )
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
    items: Array<{ product_id: number; quantity: number }>;
  }) => {
    const response = await api.post("/transactions", data);
    return response;
  },

  getAll: async () => {
    try {
      const response = await api.get("/transactions/my");

      console.log("Transactions API Response:", response.data);

      return {
        data: {
          data: response.data.data || [], // ← Sudah benar!
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
      // ✅ Ambil dari list transactions lalu filter
      const response = await api.get("/transactions/my");
      const transactions = response.data.data || [];
      const transaction = transactions.find((t: any) => t.id === Number(id));

      console.log("Transaction detail:", transaction);

      return { data: transaction || null };
    } catch (error) {
      console.error("Transaction detail error:", error);
      return { data: null };
    }
  },
};

export default api;
