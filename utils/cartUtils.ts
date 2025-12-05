import { CartState, CartInventoryItem, CartItemDisplay, CartManufacturerDisplay } from '@/types/cart';

/**
 * Encuentra un item de inventario en la lista
 */
export const findInventoryItem = (inventories: CartInventoryItem[], inventoryId: number): CartInventoryItem | undefined => {
  return inventories.find(item => item.inventoryId === inventoryId);
};

/**
 * Calcula el total de items en el carrito
 */
export const calculateTotalItems = (manufacturers: Record<number, Record<string, CartInventoryItem[]>>): number => {
  let total = 0;
  
  Object.values(manufacturers).forEach(products => {
    Object.values(products).forEach(inventories => {
      inventories.forEach(inventory => {
        total += inventory.quantity;
      });
    });
  });
  
  return total;
};

/**
 * Obtiene todos los items del carrito en formato plano
 */
export const getFlatCartItems = (manufacturers: Record<number, Record<string, CartInventoryItem[]>>) => {
  const items: Array<{ manufacturerId: number; productId: string; inventoryId: number; quantity: number }> = [];
  
  Object.entries(manufacturers).forEach(([manufacturerId, products]) => {
    Object.entries(products).forEach(([productId, inventories]) => {
      inventories.forEach(inventory => {
        items.push({
          manufacturerId: Number(manufacturerId),
          productId,
          inventoryId: inventory.inventoryId,
          quantity: inventory.quantity
        });
      });
    });
  });
  
  return items;
};

/**
 * Cuenta el total de manufacturers en el carrito
 */
export const getManufacturersCount = (manufacturers: Record<number, Record<string, CartInventoryItem[]>>): number => {
  return Object.keys(manufacturers).length;
};

/**
 * Cuenta el total de productos únicos en el carrito
 */
export const getUniqueProductsCount = (manufacturers: Record<number, Record<string, CartInventoryItem[]>>): number => {
  const uniqueProducts = new Set<string>();
  
  Object.values(manufacturers).forEach(products => {
    Object.keys(products).forEach(productId => {
      uniqueProducts.add(productId);
    });
  });
  
  return uniqueProducts.size;
};

/**
 * Valida si la cantidad es válida
 */
export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};

/**
 * Calcula subtotal para items con datos cargados
 */
export const calculateSubtotal = (items: CartItemDisplay[]): number => {
  return items.reduce((total, item) => {
    const price = item.salePrice || item.price || 0;
    return total + (price * item.quantity);
  }, 0);
};

/**
 * Formatea precio para mostrar
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Obtiene la cantidad total de un producto específico (sumando todos sus inventarios)
 */
export const getProductTotalQuantity = (
  manufacturers: Record<number, Record<string, CartInventoryItem[]>>, 
  manufacturerId: number, 
  productId: string
): number => {
  const manufacturer = manufacturers[manufacturerId];
  if (!manufacturer) return 0;
  
  const inventories = manufacturer[productId];
  if (!inventories) return 0;
  
  return inventories.reduce((total, inventory) => total + inventory.quantity, 0);
};

/**
 * Verifica si el carrito está vacío
 */
export const isCartEmpty = (manufacturers: Record<number, Record<string, CartInventoryItem[]>>): boolean => {
  return Object.keys(manufacturers).length === 0;
};