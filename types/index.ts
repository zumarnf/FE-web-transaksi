export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: Category;
  image: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}
