import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  removeManufacturer,
  removeProduct,
  clearCart,
  incrementItem,
  decrementItem,
} from '@/store/slices/cartSlice';
import {
  AddToCartPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload,
  CartInventoryItem,
} from '@/types/cart';
import {
  calculateTotalItems,
  getFlatCartItems,
  getManufacturersCount,
  getUniqueProductsCount,
  isCartEmpty,
  findInventoryItem,
  getProductTotalQuantity
} from '@/utils/cartUtils';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  // Calcular totales dinámicamente
  const totalItems = calculateTotalItems(cart.manufacturers);
  const isEmpty = isCartEmpty(cart.manufacturers);
  const manufacturersCount = getManufacturersCount(cart.manufacturers);
  const uniqueProductsCount = getUniqueProductsCount(cart.manufacturers);
  const flatItems = getFlatCartItems(cart.manufacturers);

  // Acciones del carrito
  const handleAddToCart = (payload: AddToCartPayload) => {
    dispatch(addToCart(payload));
  };

  const handleUpdateCartItem = (payload: UpdateCartItemPayload) => {
    dispatch(updateCartItem(payload));
  };

  const handleRemoveCartItem = (payload: RemoveCartItemPayload) => {
    dispatch(removeCartItem(payload));
  };

  const handleRemoveManufacturer = (manufacturerId: number) => {
    dispatch(removeManufacturer(manufacturerId));
  };

  const handleRemoveProduct = (manufacturerId: number, productId: string) => {
    dispatch(removeProduct({ manufacturerId, productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrementItem = (payload: RemoveCartItemPayload) => {
    dispatch(incrementItem(payload));
  };

  const handleDecrementItem = (payload: RemoveCartItemPayload) => {
    dispatch(decrementItem(payload));
  };

  // Utilidades y selectores
  const getCartItemQuantity = (manufacturerId: number, productId: string, inventoryId: number): number => {
    const manufacturer = cart.manufacturers[manufacturerId];
    if (!manufacturer) return 0;
    
    const inventories = manufacturer[productId];
    if (!inventories) return 0;
    
    const inventory = findInventoryItem(inventories, inventoryId);
    return inventory?.quantity || 0;
  };

  const isItemInCart = (manufacturerId: number, productId: string, inventoryId: number): boolean => {
    return getCartItemQuantity(manufacturerId, productId, inventoryId) > 0;
  };

  const getProductTotalQuantityInCart = (manufacturerId: number, productId: string): number => {
    return getProductTotalQuantity(cart.manufacturers, manufacturerId, productId);
  };

  const getManufacturerProductIds = (manufacturerId: number): string[] => {
    const manufacturer = cart.manufacturers[manufacturerId];
    return manufacturer ? Object.keys(manufacturer) : [];
  };

  const getProductInventories = (manufacturerId: number, productId: string): CartInventoryItem[] => {
    const manufacturer = cart.manufacturers[manufacturerId];
    if (!manufacturer) return [];
    
    return manufacturer[productId] || [];
  };

  const getManufacturerIds = (): number[] => {
    return Object.keys(cart.manufacturers).map(Number);
  };

  // Helper para crear payload de addToCart simplificado
  const createAddToCartPayload = (
    manufacturerId: number,
    productId: string,
    inventoryId: number,
    quantity: number = 1
  ): AddToCartPayload => {
    return {
      manufacturerId,
      productId,
      inventoryId,
      quantity,
    };
  };

  // Helper para obtener todos los items como una lista plana (para mostrar en UI)
  const getAllCartItems = () => {
    return flatItems;
  };

  // Helper para obtener manufacturers con conteos
  const getManufacturersWithCounts = () => {
    return Object.entries(cart.manufacturers).map(([manufacturerId, products]) => {
      const totalQuantity = Object.values(products).flat().reduce((sum, inv) => sum + inv.quantity, 0);
      const uniqueProducts = Object.keys(products).length;
      
      return {
        manufacturerId: Number(manufacturerId),
        totalQuantity,
        uniqueProducts,
        productIds: Object.keys(products)
      };
    });
  };

  return {
    // Estado del carrito (solo IDs)
    manufacturers: cart.manufacturers,
    lastUpdated: cart.lastUpdated,
    
    // Totales calculados
    totalItems,
    isEmpty,
    manufacturersCount,
    uniqueProductsCount,
    
    // Acciones
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeCartItem: handleRemoveCartItem,
    removeManufacturer: handleRemoveManufacturer,
    removeProduct: handleRemoveProduct,
    clearCart: handleClearCart,
    incrementItem: handleIncrementItem,
    decrementItem: handleDecrementItem,

    // Utilidades
    getCartItemQuantity,
    isItemInCart,
    getProductTotalQuantityInCart,
    getManufacturerProductIds,
    getProductInventories,
    getManufacturerIds,
    getAllCartItems,
    getManufacturersWithCounts,
    createAddToCartPayload,
  };
};