export interface Product {
  id: string;
  category: {
    id: number;
    name: string;
  };
  gender?: {
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
  videoUrl?: string;
  stock: number;
  logo?: string;
  minPurchase: number;
  createdAt?: string;
  inventories: {
    id: number;
    code: string | null;
    color: string;
    colorId?: number;
    size: string;
    sizeId?: number;
    stock: number;
    images?: string[];
  }[];
}

export interface Manufacturer {
  id: number;
  name: string;
  image: string;
  minPurchase: number;
  phone: string;
  street: string;
}

export type RelatedProductItem = Pick<Product, 'id' | 'name' | 'price' | 'mainImage'> & {
  onSale?: boolean;
  salePrice?: number;
};

export interface ProductWithManufacturerResponse {
  product: Product;
  manufacturer: Manufacturer | null;
  manufacturerProducts: RelatedProductItem[];
  categoryProducts: RelatedProductItem[];
  views?: number;
  isFavorite?: boolean | null;
}