import { productInstance } from './axiosConfig';
import { CartManufacturerDisplay, CartItemDisplay } from '@/types/cart';

// Estructura del request body que esperamos
interface CartRequestItem {
  manufacturerId: number;
  products: {
    productId: string;
    variations: {
      inventoryId: number;
      quantity: number;
    }[];
  }[];
}

// Estructura de la respuesta del backend para fabricantes
interface ManufacturerResponse {
  id: number;
  userId: number;
  image?: string;
  name: string;
  minPurchase: number;
}

// Estructura de la respuesta del backend para productos
interface ProductResponse {
  id: number;
  name: string;
  price: string; // Viene como string desde el backend
  mainImage?: string;
  inventories?: InventoryResponse[];
}

interface InventoryResponse {
  id: number;
  size: string;
  color: string;
  code?: string;
  totalItem: number; // Cantidad agregada por el usuario
}

/**
 * Obtiene la información completa del carrito desde el backend
 */
export const getCartItemsService = async (cartItems: CartRequestItem[]): Promise<CartManufacturerDisplay[]> => {
  try {
    // Hacer la petición POST al backend
    // console.log('📦 Enviando carrito al backend:', JSON.stringify(cartItems, null, 2));
    const response = await productInstance.post('/mobile-cart', cartItems);
    
    // Transformar la respuesta del backend al formato que necesita nuestra app
    const transformedData: CartManufacturerDisplay[] = response.data.map((item: any) => {
      // Transformar productos
      const products: CartItemDisplay[] = item.products.map((product: ProductResponse) => {
        // Obtener inventarios con cantidad
        const inventoriesWithQuantity = product.inventories?.filter(inv => inv.totalItem !== undefined) || [];
        
        return inventoriesWithQuantity.map(inventory => ({
          manufacturerId: item.manufacturer?.id || 0,
          productId: product.id.toString(),
          inventoryId: inventory.id,
          quantity: inventory.totalItem || 0,
          productName: product.name,
          productImage: product.mainImage || '',
          price: parseFloat(product.price) || 0,
          salePrice: undefined, // No viene en esta respuesta
          color: inventory.color,
          size: inventory.size,
          stock: undefined, // No viene en esta respuesta
        }));
      }).flat();

      // Calcular totales
      const totalItems = products.reduce((sum: number, item: CartItemDisplay) => sum + item.quantity, 0);
      const subtotal = products.reduce((sum: number, item: CartItemDisplay) => {
        const itemPrice = item.salePrice || item.price || 0;
        return sum + (itemPrice * item.quantity);
      }, 0);

      return {
        manufacturerId: item.manufacturer?.id || 0,
        manufacturerEntityId: item.manufacturer?.id,
        manufacturerUserId: item.manufacturer?.userId,
        manufacturerName: item.manufacturer?.name,
        manufacturerLogo: item.manufacturer?.image,
        minPurchase: item.manufacturer?.minPurchase,
        items: products,
        totalItems,
        subtotal,
      };
    });

    return transformedData;
  } catch (error) {
    console.error('❌ Error fetching cart items:', error);
    throw new Error('Error al obtener los datos del carrito');
  }
};

/**
 * Convierte el estado del carrito de Redux al formato esperado por el backend
 */
export const transformCartStateToRequest = (manufacturers: Record<number, Record<string, { inventoryId: number; quantity: number }[]>>): CartRequestItem[] => {
  return Object.entries(manufacturers).map(([manufacturerId, products]) => ({
    manufacturerId: Number(manufacturerId),
    products: Object.entries(products).map(([productId, inventories]) => ({
      productId,
      variations: inventories.map(inventory => ({
        inventoryId: inventory.inventoryId,
        quantity: inventory.quantity,
      })),
    })),
  }));
};