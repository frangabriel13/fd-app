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

// Usuario en el carrito
export interface CartUser {
  userId: number;
  products: Record<string, CartInventoryItem[]>; // Mapa de productId -> lista de inventarios
}

// Estado del carrito agrupado por users
export interface CartState {
  users: Record<number, Record<string, CartInventoryItem[]>>; // userId -> productId -> lista de inventarios
  lastUpdated: string; // Fecha y hora de la última actualización del carrito
}

// Datos necesarios para agregar un item al carrito
export interface AddToCartPayload {
  userId: number;
  productId: string;
  inventoryId: number;
  quantity: number;
}

// Datos necesarios para actualizar un item en el carrito
export interface UpdateCartItemPayload {
  userId: number;
  productId: string;
  inventoryId: number;
  quantity: number;
}

// Datos necesarios para eliminar un item del carrito
export interface RemoveCartItemPayload {
  userId: number;
  productId: string;
  inventoryId: number;
}

// Producto del carrito con datos adicionales obtenidos de la API
export interface CartItemDisplay {
  userId: number;
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

// Usuario con sus productos y totales calculados
export interface CartUserDisplay {
  userId: number;
  userName?: string;
  userLogo?: string;
  items: CartItemDisplay[];
  totalItems: number;
  subtotal: number;
}