// Inventario de un producto
export interface CartInventoryItem {
  inventoryId: number;
  quantity: number;
}

// Producto en el carrito
export interface CartProduct {
  productId: string;
  inventories: CartInventoryItem[];
}

// Fabricante en el carrito
export interface CartManufacturer {
  manufacturerId: number;
  products: Record<string, CartInventoryItem[]>; // Mapa de productId -> lista de inventarios
}

// Estado del carrito agrupado por manufacturers
export interface CartState {
  manufacturers: Record<number, Record<string, CartInventoryItem[]>>; // manufacturerId -> productId -> lista de inventarios
  lastUpdated: string; // Fecha y hora de la última actualización del carrito
}

// Datos necesarios para agregar un item al carrito
export interface AddToCartPayload {
  manufacturerId: number;
  productId: string;
  inventoryId: number;
  quantity: number;
}

// Datos necesarios para actualizar un item en el carrito
export interface UpdateCartItemPayload {
  manufacturerId: number;
  productId: string;
  inventoryId: number;
  quantity: number;
}

// Datos necesarios para eliminar un item del carrito
export interface RemoveCartItemPayload {
  manufacturerId: number;
  productId: string;
  inventoryId: number;
}

// Producto del carrito con datos adicionales obtenidos de la API
export interface CartItemDisplay {
  manufacturerId: number;
  productId: string;
  inventoryId: number;
  quantity: number;
  // Data fetched from API
  productName?: string;
  productImage?: string;
  price?: number;
  salePrice?: number;
  color?: string;
  size?: string;
  stock?: number;
}

// Fabricante con sus productos y totales calculados
export interface CartManufacturerDisplay {
  manufacturerId: number;
  manufacturerName?: string;
  manufacturerLogo?: string;
  items: CartItemDisplay[];
  totalItems: number;
  subtotal: number;
}