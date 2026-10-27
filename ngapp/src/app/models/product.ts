export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | string;
  thumbnail: string;
  category: Category;
  stock: number;
}

export interface ProductPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
