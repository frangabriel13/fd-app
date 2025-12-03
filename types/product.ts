export interface Product {
  id: string;
  category: {
    id: number;
    name: string;
  };
  type: 'product' | 'service' | 'Vehicle' | 'Real Estate' | 'Other';
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  attributes: Record<string, any>;
  price: number;
  priceUSD?: number;
  salePrice: number;
  isVariable: boolean;
  isActive: boolean;
  isImported: boolean;
  userId: number;
  tags: string[];
  onSale: boolean;
  stock: number;
  logo?: string;
  minPurchase: number;
}

export interface Manufacturer {
  id: number;
  name: string;
  image: string;
  minPurchase: number;
  phone: string;
  street: string;
}

export interface ProductWithManufacturerResponse {
  product: Product;
  manufacturer: Manufacturer;
  manufacturerProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
  categoryProducts: Pick<Product, 'id' | 'name' | 'price' | 'mainImage'>[];
}