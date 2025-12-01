export interface Product {
  id: number;
  category_id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  total_price: string;
  payment_proof: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  details: TransactionDetail[];
}

export interface TransactionDetail {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  price_per_item: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
